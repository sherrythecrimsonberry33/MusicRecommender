from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)  # ✅ Add length
    email = Column(String(255), unique=True, index=True, nullable=False)  # ✅ Add length
    hashed_password = Column(String(255), nullable=False)  # ✅ Add length

    preferences = relationship("UserPreference", back_populates="user")

class UserPreference(Base):
    __tablename__ = "preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))  # ✅ Add ForeignKey
    liked_artists = Column(String(255))  # ✅ Add length
    liked_songs = Column(String(255))  # ✅ Add length

    user = relationship("User", back_populates="preferences")
