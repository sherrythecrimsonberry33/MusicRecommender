import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API Key
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("Missing OpenAI API Key! Please check your .env file.")

openai.api_key = api_key

# List available models
models = openai.models.list()
print("Available models:")
for model in models.data:
    print(model.id)
