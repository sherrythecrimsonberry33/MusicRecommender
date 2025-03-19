# # Helper function to properly encode Client ID & Secret
# import base64

# import requests #type: ignore
# import os
# from fastapi import APIRouter, HTTPException
# from dotenv import load_dotenv  #type: ignore


# router = APIRouter()

# #  Load environment variables from .env file
# load_dotenv()

# SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
# SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

# #  Function to get a Spotify access token
# def get_spotify_token():
#     auth_url = "https://accounts.spotify.com/api/token"

#     #  Correct authentication format
#     response = requests.post(
#         auth_url,
#         data={"grant_type": "client_credentials"},
#         headers={"Authorization": f"Basic {get_encoded_credentials()}"}
#     )

#     token_data = response.json()
#     if "access_token" not in token_data:
#         raise HTTPException(status_code=500, detail=f"Spotify Auth Error: {token_data}")

#     return token_data["access_token"]



# def get_encoded_credentials():
#     credentials = f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}"
#     return base64.b64encode(credentials.encode()).decode()

# @router.get("/spotify/search")
# def search_song(query: str):
#     token = get_spotify_token()
#     search_url = f"https://api.spotify.com/v1/search?q={query}&type=track&limit=1"
    
#     response = requests.get(
#         search_url,
#         headers={"Authorization": f"Bearer {token}"}
#     )

#     if response.status_code != 200:
#         raise HTTPException(status_code=400, detail=f"Error fetching songs from Spotify: {response.json()}")

#     return response.json()

# # NEW Endpoint: Fetch Songs Directly from Spotify Without OpenAI
# @router.get("/songs")
# def search_songs(query: str, limit: int = 5):
#     token = get_spotify_token()
#     search_url = f"https://api.spotify.com/v1/search?q={query}&type=track&limit={limit}"
    
#     response = requests.get(
#         search_url,
#         headers={"Authorization": f"Bearer {token}"}
#     )

#     if response.status_code != 200:
#         raise HTTPException(status_code=400, detail=f"Error fetching songs from Spotify: {response.json()}")

#     data = response.json()
    
#     #  Filter only songs that contain the query in the title or artist
#     filtered_songs = []
#     for track in data["tracks"]["items"]:
#         title = track["name"].lower()
#         artist = track["artists"][0]["name"].lower()
        
#         #  Check if query is a substring of the song title or artist
#         if query.lower() in title or query.lower() in artist:
#             filtered_songs.append({
#                 "title": track["name"],
#                 "artist": track["artists"][0]["name"],
#                 "spotify_url": track["external_urls"]["spotify"],
#                 "album_image": track["album"]["images"][0]["url"] if track["album"]["images"] else None,
#                 "preview_url": track["preview_url"]
#             })

#     #  If no valid matches found, return an empty list
#     if not filtered_songs:
#         return {"songs": []}

#     return {"songs": filtered_songs}



import base64
import requests # type: ignore
import os
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv # type: ignore

router = APIRouter()

#  Load environment variables
load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

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
            filtered_songs.append({
                "title": track["name"],
                "artist": track["artists"][0]["name"],
                "spotify_url": track["external_urls"]["spotify"],
                "album_image": track["album"]["images"][0]["url"] if track["album"]["images"] else None,
                "preview_url": track["preview_url"]
            })

    #  If no valid matches found, return an empty list
    if not filtered_songs:
         raise HTTPException(status_code=404, detail="No relevant songs found. Please enter a valid artist or song name.")

    return {"songs": filtered_songs}


