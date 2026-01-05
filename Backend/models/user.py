from typing import Optional
from sqlalchemy import Column, Integer, String, BigInteger, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from DB.database import Base  # must import the exact Base from database.py

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    github_id = Column(BigInteger, unique=True, nullable=False)
    username = Column(String(50), nullable=False)
    password = Column(String(255), nullable=True)
    age_range = Column(BigInteger, nullable=True)
    access_token = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
