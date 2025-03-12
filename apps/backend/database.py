# database.py
from sqlalchemy import create_engine, MetaData # type: ignore 
from sqlalchemy.orm import sessionmaker # type: ignore 
from .models import Base # type: ignore 

DATABASE_URL = "sqlite:///./test.db"  # Boiler plate db

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
metadata = MetaData()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)