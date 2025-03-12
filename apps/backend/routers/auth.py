from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import User
from backend.auth.auth_handler import hash_password, verify_password, create_access_token
from pydantic import BaseModel

router = APIRouter()

# ✅ Define `oauth2_scheme` before using it
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ✅ Ensure FastAPI expects a JSON body
class RegisterUser(BaseModel):
    username: str
    email: str
    password: str

@router.post("/register")
def register(user: RegisterUser, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(username=user.username, email=user.email, hashed_password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

# ✅ LOGIN Endpoint
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# ✅ PROTECTED Endpoint (Check JWT)
@router.get("/me")
def get_current_user(token: str = Depends(oauth2_scheme)):
    from backend.auth.auth_handler import decode_access_token  # Import here to avoid circular imports
    username = decode_access_token(token)
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return {"username": username}
