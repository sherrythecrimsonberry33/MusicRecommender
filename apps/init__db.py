from backend.database import Base, engine
from backend.models import User, UserPreference  # ✅ Ensure models are imported

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")
