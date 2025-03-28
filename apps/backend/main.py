import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, spotify, recommend

app = FastAPI(
    debug=True,
    title="Musify",  
    description="An AI-powered music recommendation system using OpenAI & Spotify APIs",
    version="1.0.0",
    docs_url="/docs", 
    redoc_url="/redoc"  
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(spotify.router, prefix="/spotify", tags=["Spotify API"])
app.include_router(recommend.router, tags=["AI Recommendations"])

# Home Route
@app.get("/")
def home():
    return {"message": "Welcome to Musify"}

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return HTTPException(status_code=500, detail="An unexpected error occurred")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)  
