from backend.database import Base, engine
from backend.models import User, SearchHistory, Recommendation 

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")
