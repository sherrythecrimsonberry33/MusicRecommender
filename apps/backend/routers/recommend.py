from fastapi import APIRouter, Depends, HTTPException
import openai
import os
from backend.routers.auth import oauth2_scheme
from backend.auth.auth_handler import decode_access_token

router = APIRouter()

openai.api_key = os.getenv("OPENAI_API_KEY")

# ✅ Secure the `/recommend` Endpoint
@router.get("/recommend")
def recommend_songs(query: str, token: str = Depends(oauth2_scheme)):
    username = decode_access_token(token)
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    prompt = f"Suggest 5 songs similar to {query}. Provide only song names."

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )

    return {"recommendations": response["choices"][0]["message"]["content"].split("\n")}
