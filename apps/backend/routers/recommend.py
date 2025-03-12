from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from backend.routers.spotify import search_song
from backend.authentication.auth_handler import decode_access_token
import openai #type: ignore
import os
from dotenv import load_dotenv #type: ignore

router = APIRouter()

#  Load environment variables
load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

#  Read OpenAI API Key after loading .env
openai.api_key = os.getenv("OPENAI_API_KEY")

@router.get("/recommend")
def recommend_songs(query: str, token: str = Depends(oauth2_scheme)):
    #  Authenticate user
    username = decode_access_token(token)
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    try:
        #  Correct OpenAI API Call
        client = openai.OpenAI()  
        ai_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a music recommendation assistant."},
                {"role": "user", "content": f"Recommend 5 songs based on: {query}"}
            ]
        )

        suggested_songs = ai_response.choices[0].message.content.split("\n")

        print(f" AI Suggested Songs: {suggested_songs}") 

        #  Fetch real song data from Spotify
        spotify_results = []
        for song in suggested_songs:
            song = song.strip()
            if song:  #  Ensure song name isn't empty
                spotify_data = search_song(song)
                if "tracks" in spotify_data and len(spotify_data["tracks"]["items"]) > 0:
                    track = spotify_data["tracks"]["items"][0]
                    spotify_results.append({
                        "title": track["name"],
                        "artist": track["artists"][0]["name"],
                        "spotify_url": track["external_urls"]["spotify"],
                    })

        return {"recommendations": spotify_results}
    
    except openai.OpenAIError as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API Error: {str(e)}")
