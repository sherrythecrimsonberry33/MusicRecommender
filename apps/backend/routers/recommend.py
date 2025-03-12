import openai
from fastapi import APIRouter
from config import OPENAI_API_KEY  # Store API keys in a config file

router = APIRouter()

# OpenAI API Key
openai.api_key = OPENAI_API_KEY

@router.get("/recommend")
def recommend_songs(query: str):
    prompt = f"Suggest 5 songs similar to {query}. Provide only song names."

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )

    return {"recommendations": response["choices"][0]["message"]["content"].split("\n")}
