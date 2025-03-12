import requests #type: ignore
from fastapi import APIRouter
from backend.config import SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET  # Store secrets in config.py

router = APIRouter()

# Get Spotify Token
def get_spotify_token():
    url = "https://accounts.spotify.com/api/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"grant_type": "client_credentials", "client_id": SPOTIFY_CLIENT_ID, "client_secret": SPOTIFY_CLIENT_SECRET}

    response = requests.post(url, headers=headers, data=data)
    return response.json().get("access_token")

# Spotify Search Route
@router.get("/search")
def search_song(query: str):
    token = get_spotify_token()
    headers = {"Authorization": f"Bearer {token}"}
    url = f"https://api.spotify.com/v1/search?q={query}&type=track&limit=5"

    response = requests.get(url, headers=headers)
    return response.json()
