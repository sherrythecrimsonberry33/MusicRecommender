from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from database import get_db
from models import SearchHistory, Recommendation, User
from authentication.auth_handler import decode_access_token
from routers.spotify import search_song, get_deezer_track
import openai
import os
from dotenv import load_dotenv

router = APIRouter()

#  Load environment variables
load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

#  Read OpenAI API Key after loading .env
openai.api_key = os.getenv("OPENAI_API_KEY")

#  Function to validate query before recommending songs
def validate_query(query: str):
    client = openai.OpenAI()
    validation_response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an AI moderator ensuring user input is safe and appropriate."},
            {"role": "user", "content": f"Classify the following query into one of these categories: 'Music-Related', 'Safe but Unrelated', 'Extremely Inappropriate'. Query: '{query}'. Respond with only one of the categories."}
        ]
    )

    validation_result = validation_response.choices[0].message.content.strip().lower()

    if validation_result == "extremely inappropriate":
        return "The query is highly inappropriate. Please enter a valid music-related query."

    return None  #  Allows safe or music-related queries


#  Recommend Songs (Authenticated Users - Saves History)
@router.get("/recommend")
def recommend_songs(query: str, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    #  Authenticate user
    username = decode_access_token(token)
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    #  Validate the query before proceeding
    validation_message = validate_query(query)
    if validation_message:
        return {"message": validation_message}

    try:
        # Save Search History
        search_entry = SearchHistory(user_id=user.id, query=query)
        db.add(search_entry)
        db.commit()
        db.refresh(search_entry)

        #  Call OpenAI API for song recommendations
        client = openai.OpenAI()
        ai_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a music recommendation assistant."},
                {"role": "user", "content": f"Recommend 5 songs based on: {query}"}
            ]
        )

        suggested_songs = ai_response.choices[0].message.content.split("\n")

        #  Fetch song details from Spotify and store them
        recommendations = []
        for index, song in enumerate(suggested_songs):
            song = song.strip()
            if song:
                spotify_data = search_song(song)
                if "tracks" in spotify_data and len(spotify_data["tracks"]["items"]) > 0:
                    track = spotify_data["tracks"]["items"][0]
                    
                    # Add debug logs here
                    print(f"AI Track data: {track}")
                    print(f"AI Album data: {track.get('album', {})}")
                    print(f"AI Album images: {track.get('album', {}).get('images', [])}")
                    
                    # Fix the album_image assignment
                    album_image_url = None
                    if track.get('album', {}).get('images') and len(track['album']['images']) > 0:
                        album_image_url = track['album']['images'][0]['url']
                    
                    recommendation_entry = Recommendation(
                        search_id=search_entry.id,
                        song_title=track["name"],
                        artist=track["artists"][0]["name"],
                        spotify_url=track["external_urls"]["spotify"],
                        album_image=album_image_url,
                    )
                    db.add(recommendation_entry)

                    deezer_id = None
                    if index == 0:  # Only for the first track
                        deezer_id = get_deezer_track(track["name"], track["artists"][0]["name"])
                    recommendations.append({
                        "title": track["name"],
                        "artist": track["artists"][0]["name"],
                        "spotify_url": track["external_urls"]["spotify"],
                        "album_image": album_image_url,
                        "deezer_id": deezer_id  # Add this field
                    })

        db.commit()  #  Commit recommendations to DB

        return {"recommendations": recommendations}

    except openai.OpenAIError as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API Error: {str(e)}")


#  Recommend Songs (Guest Users - No History)
@router.get("/recommend/guest")
def recommend_songs_guest(query: str):
    #  Validate the query before proceeding
    validation_message = validate_query(query)
    if validation_message:
        return {"message": validation_message}

    try:
        #  OpenAI API Call
        client = openai.OpenAI()  
        ai_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a music recommendation assistant."},
                {"role": "user", "content": f"Recommend 5 songs based on: {query}"}
            ]
        )

        suggested_songs = ai_response.choices[0].message.content.split("\n")

        print(f"AI Suggested Songs (Guest): {suggested_songs}")

        #  Fetch song data from Spotify (NO HISTORY STORAGE)
        recommendations = []
        for index, song in enumerate(suggested_songs):
            song = song.strip()
            if song:
                spotify_data = search_song(song)
                if "tracks" in spotify_data and len(spotify_data["tracks"]["items"]) > 0:
                    track = spotify_data["tracks"]["items"][0]
                    
                    # Add debug logs here
                    print(f"AI Guest Track data: {track}")
                    print(f"AI Guest Album data: {track.get('album', {})}")
                    print(f"AI Guest Album images: {track.get('album', {}).get('images', [])}")
                    
                    # Fix the album_image assignment
                    album_image_url = None
                    if track.get('album', {}).get('images') and len(track['album']['images']) > 0:
                        album_image_url = track['album']['images'][0]['url']
                    deezer_id = None
                    if index == 0:  # Only for the first track
                        deezer_id = get_deezer_track(track["name"], track["artists"][0]["name"])
                    recommendations.append({
                        "title": track["name"],
                        "artist": track["artists"][0]["name"],
                        "spotify_url": track["external_urls"]["spotify"],
                        "album_image": album_image_url,
                        "deezer_id": deezer_id  
                    })

        return {"recommendations": recommendations}

    except openai.OpenAIError as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API Error: {str(e)}")

@router.get("/search/history")
def get_search_history(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    username = decode_access_token(token)
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    search_history = (
        db.query(SearchHistory)
        .filter(SearchHistory.user_id == user.id)
        .order_by(SearchHistory.timestamp.desc())
        .all()
    )

    return [
        {
            "query": search.query,
            "timestamp": search.timestamp,
            "recommendations": [
                {"title": rec.song_title, "artist": rec.artist, "spotify_url": rec.spotify_url}
                for rec in search.recommendations
            ],
        }
        for search in search_history
    ]


@router.delete("/search/history/{history_id}")
def delete_search_history(history_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Delete a specific search history entry"""
    # Authenticate user
    username = decode_access_token(token)
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    print(f"Deleting history ID {history_id} for user {username} (ID: {user.id})")

    # Find the search history entry - without filtering by user first
    search_entry = db.query(SearchHistory).filter(SearchHistory.id == history_id).first()
    
    # If no entry found with that ID at all
    if not search_entry:
        raise HTTPException(status_code=404, detail="Search history entry not found")
    
    # Check if this entry belongs to the authenticated user
    if search_entry.user_id != user.id:
        print(f"Security: User {user.id} tried to delete history owned by user {search_entry.user_id}")
        raise HTTPException(
            status_code=403, 
            detail="You do not have permission to delete this search history entry"
        )

    try:
        # Delete all recommendations associated with this search
        deleted_recs = db.query(Recommendation).filter(
            Recommendation.search_id == history_id
        ).delete(synchronize_session=False)
        
        # Delete the search history entry
        db.delete(search_entry)
        db.commit()
        
        print(f"Successfully deleted history ID {history_id} with {deleted_recs} recommendations")
        return {"message": "Search history deleted successfully", "id": history_id}
    
    except Exception as e:
        db.rollback()
        print(f"Error deleting history: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/search/history")
def delete_all_search_history(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Delete all search history for the authenticated user"""
    # Authenticate user
    username = decode_access_token(token)
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Find all search history entries for this user
    search_ids = [search.id for search in db.query(SearchHistory).filter(SearchHistory.user_id == user.id).all()]
    
    # Delete associated recommendations
    if search_ids:
        db.query(Recommendation).filter(Recommendation.search_id.in_(search_ids)).delete(synchronize_session=False)
    
    # Delete the search history entries
    rows_deleted = db.query(SearchHistory).filter(SearchHistory.user_id == user.id).delete()
    db.commit()

    return {"message": f"All search history deleted successfully", "count": rows_deleted}