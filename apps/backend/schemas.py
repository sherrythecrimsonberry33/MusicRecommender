from pydantic import BaseModel, EmailStr
from typing import Optional, List

# User Schema with email (since register expects email)
class UserSchema(BaseModel):
    username: str
    email: EmailStr  # Ensures a valid email format
    password: str

# Schema for storing user preferences
class UserPreferenceSchema(BaseModel):
    liked_artists: Optional[List[str]] = []  # Stores as a list
    liked_songs: Optional[List[str]] = []

# Request schema for recommendations
class RecommendationRequest(BaseModel):
    query: str

# Schema for JWT token data
class TokenData(BaseModel):
    username: str
