# from sqlalchemy import Column, Integer, String, ForeignKey
# from sqlalchemy.orm import relationship
# from backend.database import Base

# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String(255), unique=True, index=True, nullable=False)  #Add length
#     email = Column(String(255), unique=True, index=True, nullable=False)  #Add length
#     hashed_password = Column(String(255), nullable=False)  #Add length

#     preferences = relationship("UserPreference", back_populates="user")

# class UserPreference(Base):
#     __tablename__ = "preferences"

#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"))  #Add ForeignKey
#     liked_artists = Column(String(255))  #Add length
#     liked_songs = Column(String(255))  #Add length

#     user = relationship("User", back_populates="preferences")
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
