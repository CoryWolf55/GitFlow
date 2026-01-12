from fastapi import Request, Depends, HTTPException, APIRouter, Cookie
from sqlalchemy.orm import Session
from starlette import status
from models.user import User
from dependencies import get_db
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

@router.get("/data/avatar")
@limiter.limit("10/minute")
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
