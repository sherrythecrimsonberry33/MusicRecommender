from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    searches = relationship("SearchHistory", back_populates="user")

class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    query = Column(Text, nullable=False)  # Stores search query
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="searches")
    recommendations = relationship("Recommendation", back_populates="search")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    search_id = Column(Integer, ForeignKey("search_history.id"), nullable=False)
    song_title = Column(String(255), nullable=False)
    artist = Column(String(255), nullable=False)
    spotify_url = Column(String(255), nullable=True)
    album_image = Column(String(255), nullable=True)

    search = relationship("SearchHistory", back_populates="recommendations")
