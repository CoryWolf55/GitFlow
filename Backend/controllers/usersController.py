from fastapi import Depends, HTTPException, Request, APIRouter, Cookie
from fastapi.responses import RedirectResponse
import httpx
from sqlalchemy.orm import Session
from starlette import status
from DTOs.userDTO import UserResponseDTO, UserCreateDTO, UserLoginDTO, UserLoginResponseDTO
from scripts.post_simplicity import *
from scripts.auth import *
import os
from dotenv import load_dotenv

from dependencies import get_db

from models.user import User

from slowapi import Limiter
from slowapi.util import get_remote_address

# Add this at the top of usersController.py
limiter = Limiter(key_func=get_remote_address)

router = APIRouter()
#Test
@router.get("/user")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"github_id": u.github_id, "username": u.username} for u in users]

#Get User By username and password / Login
"""Checks if user exists, then checks password and username
Checks by github username, then moves to verifying password"""
@router.post("/user/login")
@limiter.limit("5/minute; 50/hour")  # max 5 login attempts per minute per IP
def get_user(user_dto: UserLoginDTO, request: Request, db: Session = Depends(get_db)):
    print("received request")
    try:
        existing_user = (
            db.query(User)
            .filter(User.username == user_dto.username)
            .first()
        )
        #Check if there is a user that matches
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User wasn't found!{Checked through username}",
            )
        #set user
        user = existing_user
        #Checks password sent to password received
        if not verify_password(user_dto.password, str(user.password)):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        response = UserLoginResponseDTO.model_validate(user)
        return response


    except Exception as e:
        print("Error fetching users:", e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


#Create User / Sign Up
"""Checks if user exists, if not, creates new user"""
@router.post("/user", response_model=UserResponseDTO)
@limiter.limit("10/minute; 100/hour")
def create_user(user_dto: UserCreateDTO,request: Request, db: Session = Depends(get_db)):
    try:
        # check by UNIQUE field
        existing_user = (
            db.query(User)
            .filter(User.github_id == user_dto.github_id)
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User already exists{Checked through github_id}",
            )

        user = User(
            github_id=user_dto.github_id,
            username=user_dto.username,
            access_token=user_dto.access_token,
            #Hashing Password
            #password = hash_password(user_dto.password),
        )


        #sending data to base then frontend
        post_commit(user, db)

        user_response = UserResponseDTO(
            github_id=user_dto.github_id,
            username=user_dto.username,
        )
        return user_response

    except HTTPException:
        raise
    except Exception as e:
        post_rollback(e, db)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))



"""Github Auth Routes"""
load_dotenv(dotenv_path="envfolder/env_file.env")

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_CALLBACK_URL = "http://localhost:8000/auth/github/callback"  # adjust for production
frontend_url = "http://localhost:5173"
@router.get("/auth/github/login")
def github_login():
    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&redirect_uri={GITHUB_CALLBACK_URL}"
        f"&scope=repo read:user user:email"
    )
    return RedirectResponse(github_auth_url)


@router.get("/auth/github/callback")
def github_callback(code: str, db: Session = Depends(get_db)):
    # Exchange code for access token
    token_url = "https://github.com/login/oauth/access_token"
    headers = {"Accept": "application/json"}
    data = {
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET,
        "code": code,
    }

    response = httpx.post(token_url, headers=headers, data=data)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to get access token from GitHub")

    response_data = response.json()
    access_token = response_data.get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail=f"Failed to get access token: {response_data}")

    # Get user info from GitHub
    user_response = httpx.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    github_user = user_response.json()
    if "id" not in github_user or "login" not in github_user:
        raise HTTPException(status_code=400, detail=f"GitHub user info incomplete: {github_user}")

    # Check if user exists
    existing_user = db.query(User).filter(User.github_id == github_user["id"]).first()

    try:
        if not existing_user:
            # Create new user
            new_user = User(
                github_id=github_user["id"],
                username=github_user.get("login", f"user_{github_user['id']}"),
                access_token=hash_password(access_token)
            )
            post_commit(new_user, db)
            existing_user = new_user
            #return UserResponseDTO(github_id=new_user.github_id, username=new_user.username)
        else:
            # Update access token safely
            existing_user.access_token = hash_password(access_token)
            db.commit()

            #return UserResponseDTO.model_validate(existing_user)

        #Redirect
        response = RedirectResponse(url=frontend_url)
        #SetCookie
        response.set_cookie(
            key="userId",
            value=str(existing_user.id),
            httponly=True,
            max_age=86400,  # 1 day
            secure=False  # True in production with HTTPS
        )
        return response
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.get("/userID")
@limiter.limit("5/min")
def dashboard_data(request: Request, userId: str = Cookie(None)):
    if not userId:
        raise HTTPException(status_code=401, detail="Not logged in")
    return {"userId": userId}




"""Project FLow, Github redirect, grab token. Then create or login to local account. Local account will ask questions such as 
age and password. This can then be moved onto the data showing or maybe resume viewing."""


"""
Example of Data Grab

@router.get("/user/{user_id}/github-data")

def get_github_data(user_id: int,db: Session = Depends(get_db)):
    # 1. Get the user from your DB
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.access_token:
        raise HTTPException(status_code=404, detail="User not found or no GitHub token")

    headers = {"Authorization": f"Bearer {user.access_token}"}

    # 2. Fetch profile info
    profile_resp = httpx.get("https://api.github.com/user", headers=headers)
    if profile_resp.status_code != 200:
        raise HTTPException(status_code=profile_resp.status_code, detail="Failed to fetch profile")
    profile = profile_resp.json()

    # 3. Fetch emails
    emails_resp = httpx.get("https://api.github.com/user/emails", headers=headers)
    emails = emails_resp.json() if emails_resp.status_code == 200 else []

    # 4. Fetch repositories (handle pagination)
    repos = []
    page = 1
    while True:
        repo_resp = httpx.get(
            "https://api.github.com/user/repos",
            headers=headers,
            params={"per_page": 100, "page": page}
        )
        if repo_resp.status_code != 200:
            break
        data = repo_resp.json()
        if not data:
            break
        repos.extend(data)
        page += 1

    # 5. Return everything as JSON
    return {
        "profile": profile,
        "emails": emails,
        "repos": repos
    }
    
"""
