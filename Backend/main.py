from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from dependencies import get_db
from models.user import User
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Debug Example
@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    print("received request")
    try:
        users = db.query(User).all()
        return users
    except Exception as e:
        print("Error fetching users:", e)
        raise HTTPException(status_code=500, detail=str(e))
