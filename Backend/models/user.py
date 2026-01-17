from sqlalchemy import Column, Integer, String, BigInteger, DateTime, func
from sqlalchemy.orm import relationship
from DB.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    github_id = Column(BigInteger, unique=True, nullable=False)
    username = Column(String(50), nullable=False)
    password = Column(String(255), nullable=True)
    age = Column(Integer, nullable=True)
    access_token = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # relationships
    stats = relationship("GitHubStats", back_populates="user", uselist=False)
    scores = relationship("UserScore", back_populates="user")
