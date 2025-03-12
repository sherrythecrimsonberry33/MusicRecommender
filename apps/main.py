# main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import auth, spotify, recommend


app = FastAPI(debug=True)

origins = [
    "http://localhost:5173",
    # Add more origins here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(spotify.router, prefix="/spotify", tags=["Spotify API"])
app.include_router(recommend.router, tags=["AI Recommendations"])


@app.get("/")
def home():
    return {"message": "Welcome to the AI Song Recommendation API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)