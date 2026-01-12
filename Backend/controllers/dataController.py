from fastapi import Request, Depends, HTTPException, APIRouter, Cookie
from sqlalchemy.orm import Session
from starlette import status
from models.user import User
from dependencies import get_db
from slowapi import Limiter
from slowapi.util import get_remote_address
import httpx

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

@router.get("/data/avatar")
@limiter.limit("15/minute")
def get_avatar(request: Request, userId: str = Cookie(None), db: Session = Depends(get_db)):
    print("Hit /data/avatar")
    print("userId cookie:", userId)
    if not userId:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")

    try:
        user_id_int = int(userId)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID cookie")

    user = db.query(User).filter(User.id == user_id_int).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    avatar_url = f"https://avatars.githubusercontent.com/u/{user.github_id}?v=4"
    return {"avatar_url": avatar_url}


@router.get("/user/github-bio")
@limiter.limit("15/minute")
def get_github_bio(request: Request, userId: str = Cookie(None), db: Session = Depends(get_db)):
    if not userId:
        raise HTTPException(status_code=401, detail="Not logged in")

    user = db.query(User).filter(User.id == int(userId)).first()
    if not user or not user.access_token:
        raise HTTPException(status_code=404, detail="User or token not found")

    headers = {"Authorization": f"Bearer {user.access_token}"}
    response = httpx.get("https://api.github.com/user", headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch GitHub profile")

    data = response.json()
    return {"bio": data.get("bio", "")}