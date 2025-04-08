import os
import requests
import base64
import json
import secrets
from urllib.parse import urlencode
from fastapi import APIRouter, HTTPException, Depends, Request, Response, Query
from sqlalchemy.orm import Session
from database import get_db
from models import User
from authentication.auth_handler import decode_access_token
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

router = APIRouter()

#  Load environment variables
load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
FRONTEND_REDIRECT_URL = os.getenv("FRONTEND_REDIRECT_URL", "http://localhost:3000/dashboard")

#  Helper function to encode Client ID & Secret properly
def get_encoded_credentials():
    credentials = f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}"
    return base64.b64encode(credentials.encode()).decode()

#  Function to get a Spotify access token
def get_spotify_token():
    auth_url = "https://accounts.spotify.com/api/token"

    response = requests.post(
        auth_url,
        data={"grant_type": "client_credentials"},
        headers={"Authorization": f"Basic {get_encoded_credentials()}"}
    )

    token_data = response.json()
    if "access_token" not in token_data:
        raise HTTPException(status_code=500, detail=f"Spotify Auth Error: {token_data}")

    return token_data["access_token"]

def get_deezer_track(song_name, artist_name):
    try:
        # Encode the search query
        query = f"{song_name} {artist_name}".replace(" ", "+")
        response = requests.get(f"https://api.deezer.com/search?q={query}&limit=2")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("data") and len(data["data"]) > 0:
                return data["data"][0]["id"]  # Return the Deezer track ID
        
        return None
    except Exception as e:
        print(f"Error searching Deezer: {str(e)}")
        return None

#  Publicly accessible Spotify search endpoint
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

#  Publicly accessible endpoint to fetch songs from Spotify without OpenAI
@router.get("/songs")
def search_songs(query: str, limit: int = 7):
    token = get_spotify_token()
    search_url = f"https://api.spotify.com/v1/search?q={query}&type=track&limit={limit}"

    response = requests.get(
        search_url,
        headers={"Authorization": f"Bearer {token}"}
    )

    if response.status_code != 200:
        raise HTTPException(status_code=400, detail=f"Error fetching songs from Spotify: {response.json()}")

    data = response.json()

    # Filter only songs that contain the query in the title or artist
    filtered_songs = []
    for track in data["tracks"]["items"]:
        title = track["name"].lower()
        artist = track["artists"][0]["name"].lower()

        #  Check if query is a substring of the song title or artist
        if query.lower() in title or query.lower() in artist:
            # In spotify.py - Add before appending to filtered_songs
            print(f"Direct Track data: {track}")
            print(f"Direct Album data: {track.get('album', {})}")
            print(f"Direct Album images: {track.get('album', {}).get('images', [])}")

            deezer_id = None
            if len(filtered_songs) == 0:  # Only for the first track
                deezer_id = get_deezer_track(track["name"], track["artists"][0]["name"])
            filtered_songs.append({
                "title": track["name"],
                "artist": track["artists"][0]["name"],
                "spotify_url": track["external_urls"]["spotify"],
                "album_image": track["album"]["images"][0]["url"] if track["album"]["images"] else None,
                "preview_url": track["preview_url"],
                "deezer_id": deezer_id
            })

    #  If no valid matches found, return an empty list
    if not filtered_songs:
         raise HTTPException(status_code=404, detail="No relevant songs found. Please enter a valid artist or song name.")

    return {"songs": filtered_songs}

# Add these endpoints to your spotify.py file



# Get OAuth2 scheme for token validation
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")




# In-memory storage for pending playlist creation (keyed by state token)
# In a production app, you'd want to use Redis or a similar service
playlist_creation_requests = {}

class PlaylistCreationData(BaseModel):
    song_uris: List[str]
    name: str
    description: str
    is_public: bool = True

# Function to get base64 encoded auth string for Spotify
def get_spotify_auth_header():
    auth_string = f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}"
    return base64.b64encode(auth_string.encode()).decode()

# Endpoint to initiate Spotify authorization for playlist creation
@router.get("/create-playlist")
async def authorize_playlist_creation(
    name: str, 
    description: str = "Created with Musify",
    is_public: bool = True,
    song_uris: str = Query(..., description="Comma-separated list of Spotify track URIs"),
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    # Authenticate user in our system
    username = decode_access_token(token)
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Parse song URIs
    track_uris = song_uris.split(",")
    if not track_uris:
        raise HTTPException(status_code=400, detail="No song URIs provided")
    
    # Generate a unique state token to prevent CSRF
    state = secrets.token_urlsafe(16)
    
    # Store the playlist creation data
    playlist_creation_requests[state] = PlaylistCreationData(
        song_uris=track_uris,
        name=name,
        description=description,
        is_public=is_public
    )
    
    # Define the Spotify authorization URL parameters
    params = {
    "client_id": SPOTIFY_CLIENT_ID,
    "response_type": "code",
    "redirect_uri": f"{os.getenv('API_BASE_URL')}/spotify/callback",
    "state": state,
    "scope": "playlist-modify-public playlist-modify-private",
    "show_dialog": "true"
    }
    
    # Build the authorization URL
    auth_url = f"https://accounts.spotify.com/authorize?{urlencode(params)}"
    
    # Return the URL instead of redirecting, so frontend can handle it
    # In spotify.py
    return {"authUrl": auth_url, "state": state}  # Now uses camelCase

# Callback endpoint for Spotify OAuth
@router.get("/callback")
async def spotify_callback(
    code: Optional[str] = None, 
    state: Optional[str] = None,
    error: Optional[str] = None
):
    # Add debug logging
    print(f"Spotify callback received: code={code}, state={state}, error={error}")
    
    # Check for errors
    if error:
        redirect_url = f"{FRONTEND_REDIRECT_URL}?error={error}"
        return RedirectResponse(url=redirect_url)
    
    # Validate state token
    if not state or state not in playlist_creation_requests:
        print(f"Invalid state: {state}")
        print(f"Available states: {list(playlist_creation_requests.keys())}")
        redirect_url = f"{FRONTEND_REDIRECT_URL}?error=invalid_state"
        return RedirectResponse(url=redirect_url)
    
    try:
        # Get the playlist creation data
        playlist_data = playlist_creation_requests[state]
        
        # Exchange code for access token
        token_url = "https://accounts.spotify.com/api/token"
        payload = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": f"{os.getenv('API_BASE_URL')}/spotify/callback"
        }
        headers = {
            "Authorization": f"Basic {get_spotify_auth_header()}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        # Add debug logging
        print(f"Token request: URL={token_url}, redirect_uri={payload['redirect_uri']}")
        
        token_response = requests.post(token_url, data=payload, headers=headers)
        
        # Debug log the response
        print(f"Token response status: {token_response.status_code}")
        print(f"Token response: {token_response.text[:100]}...")
        
        if token_response.status_code != 200:
            # Cleanup the request
            del playlist_creation_requests[state]
            redirect_url = f"{FRONTEND_REDIRECT_URL}?error=token_error:{token_response.text[:50]}"
            return RedirectResponse(url=redirect_url)
        
        token_data = token_response.json()
        access_token = token_data["access_token"]
        
        # Get Spotify user ID
        user_response = requests.get(
            "https://api.spotify.com/v1/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        if user_response.status_code != 200:
            # Cleanup the request
            del playlist_creation_requests[state]
            redirect_url = f"{FRONTEND_REDIRECT_URL}?error=user_info_error"
            return RedirectResponse(url=redirect_url)
        
        spotify_user_id = user_response.json()["id"]
        
        # Create playlist
        create_playlist_url = f"https://api.spotify.com/v1/users/{spotify_user_id}/playlists"
        playlist_payload = {
            "name": playlist_data.name,
            "description": playlist_data.description,
            "public": playlist_data.is_public
        }
        
        playlist_response = requests.post(
            create_playlist_url,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            },
            data=json.dumps(playlist_payload)
        )
        
        if playlist_response.status_code not in (200, 201):
            # Cleanup the request
            del playlist_creation_requests[state]
            redirect_url = f"{FRONTEND_REDIRECT_URL}?error=playlist_creation_error"
            return RedirectResponse(url=redirect_url)
        
        playlist_id = playlist_response.json()["id"]
        playlist_url = playlist_response.json()["external_urls"]["spotify"]
        
        # Add tracks to playlist
        if playlist_data.song_uris:
            add_tracks_url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
            tracks_payload = {"uris": playlist_data.song_uris}
            
            tracks_response = requests.post(
                add_tracks_url,
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json"
                },
                data=json.dumps(tracks_payload)
            )
            
            if tracks_response.status_code not in (200, 201):
                print(f"Warning: Tracks could not be added to playlist: {tracks_response.text}")
        
        # Cleanup the request
        del playlist_creation_requests[state]
        
        # Redirect back to frontend with success params
        redirect_url = f"{FRONTEND_REDIRECT_URL}?playlist_created=true&playlist_url={playlist_url}"
        return RedirectResponse(url=redirect_url)
        
    except Exception as e:
        # Cleanup the request
        if state in playlist_creation_requests:
            del playlist_creation_requests[state]
        
        print(f"Error in Spotify callback: {str(e)}")
        redirect_url = f"{FRONTEND_REDIRECT_URL}?error=server_error"
        return RedirectResponse(url=redirect_url)

