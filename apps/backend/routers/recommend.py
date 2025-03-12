from fastapi import APIRouter, HTTPException
import openai
import os
from dotenv import load_dotenv

router = APIRouter()

# Load environment variables
load_dotenv()

# Get API Key
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("Missing OpenAI API Key!")

# Set up OpenAI client
client = openai.OpenAI(api_key=api_key)

@router.get("/recommend")
def recommend_songs(query: str):
    if not query:
        raise HTTPException(status_code=400, detail="Query parameter is required")

    try:
        prompt = f"Suggest 5 songs similar to {query}. Provide only song names."

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # ✅ Use a valid model from your available models
            messages=[{"role": "user", "content": prompt}]
        )

        return {"recommendations": response.choices[0].message.content.split("\n")}

    except openai.OpenAIError as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")
