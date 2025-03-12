from backend.database import Base, engine
from backend.models import User, UserPreference  

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")
