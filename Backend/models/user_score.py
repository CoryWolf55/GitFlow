from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from DB.database import Base

class UserScore(Base):
    __tablename__ = "user_scores"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    score = Column(Float, nullable=False)
    percentile = Column(Float, nullable=False)
    tier = Column(String(20), nullable=False)

    calculated_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="scores")
