#models.py

from sqlalchemy import Column, Integer, String, Boolean # type: ignore 
from sqlalchemy.ext.declarative import declarative_base  

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_action = Column(Boolean, default=True)