from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from starlette import status
from DTOs.userDTO import UserResponseDTO, UserCreateDTO, UserLoginDTO, UserLoginResponseDTO
from scripts.post_simplicity import *
from scripts.auth import *
from dependencies import get_db
from models.user import User
from main import app, limiter


#Get User By username and password / Login
"""Checks if user exists, then checks password and username
Checks by github username, then moves to verifying password"""
@app.post("/user/login")
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
                detail="User wasn't found!{Checked through github_id}",
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
@app.post("/user", response_model=UserResponseDTO)
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
            password = hash_password(user_dto.password),
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
