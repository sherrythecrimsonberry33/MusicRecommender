from backend.database import Base, engine
from backend.models import User, SearchHistory, Recommendation  # ✅ Import new tables

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")
