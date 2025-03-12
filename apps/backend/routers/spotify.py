import requests
import os
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv  # ✅ Import dotenv

router = APIRouter()

# ✅ Load environment variables from .env file
load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

# ✅ Function to get a Spotify access token
def get_spotify_token():
    auth_url = "https://accounts.spotify.com/api/token"
    
    # ✅ Correct Spotify Authentication Request
    response = requests.post(
        auth_url,
        data={"grant_type": "client_credentials"},
        auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)  # 🔥 Correct auth method
    )

    token_data = response.json()
    if "access_token" not in token_data:
        raise HTTPException(status_code=500, detail=f"Spotify Auth Error: {token_data}")

    print(f"✅ Spotify Token: {token_data['access_token']}")  # Debugging
    return token_data["access_token"]

@router.get("/spotify/search")
def search_song(query: str):
    token = get_spotify_token()
    search_url = f"https://api.spotify.com/v1/search?q={query}&type=track&limit=1"
    
    response = requests.get(
        search_url,
        headers={"Authorization": f"Bearer {token}"}
    )

    if response.status_code != 200:
        raise HTTPException(status_code=400, detail=f"Error fetching songs from Spotify: {response.json()}")

    return response.json()
