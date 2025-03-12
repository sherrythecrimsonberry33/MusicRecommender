from pydantic import BaseModel

class UserSchema(BaseModel):
    username: str
    password: str

class RecommendationRequest(BaseModel):
    query: str

class TokenData(BaseModel):
    username: str
