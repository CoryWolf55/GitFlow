from fastapi import Request, Depends, HTTPException, APIRouter, Cookie
from sqlalchemy.orm import Session
from starlette import status

"""MODELS"""
from models.user import User
from models.github_stats import GitHubStats
from models.user_score import UserScore

from dependencies import get_db
from slowapi import Limiter
from slowapi.util import get_remote_address
import httpx

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()
