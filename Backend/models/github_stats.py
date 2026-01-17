from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from DB.database import Base

class GitHubStats(Base):
    __tablename__ = "github_stats"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    repo_count = Column(Integer, default=0)
    commit_count = Column(Integer, default=0)
    star_count = Column(Integer, default=0)
    languages = Column(Integer, default=0)

    last_synced = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="stats")
