import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
API_KEY = os.getenv("GENAI_API_KEY")
if not API_KEY:
    raise ValueError("API key not found. Please set the GENAI_API_KEY environment variable.")

genai.configure(api_key=API_KEY)

# FastAPI app instance
app = FastAPI()

# Generation configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Initialize the generative model
model = genai.GenerativeModel(
    model_name="tunedModels/telemedicine-xw99dbwm2dhy",
    generation_config=generation_config,
)

# Define a request model with `question` field for input validation
class PromptRequest(BaseModel):
    question: str

@app.post("/generate_response")
async def generate_response(request: PromptRequest):
    try:
        # Start a chat session with an empty history
        chat_session = model.start_chat(history=[])
        
        # Send the user question to the chat session
        response = chat_session.send_message(
            "Background: Don't use words like I saw in the image, etc. and don't give medicinal description, only give advice to soothe the condition without the medicines. The symptoms along with the problem are mentioned: " + request.question
        )
        
        # Return the response text
        return {"response": response.text}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the app with Uvicorn
# To start the server, use: `uvicorn your_file_name:app --reload`