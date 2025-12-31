from sqlalchemy import Column, Integer, String, BigInteger, DateTime, func
from DB.database import Base  # must import the exact Base from database.py

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(BigInteger, unique=True, nullable=False)
    username = Column(String(50), nullable=False)
    access_token = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
