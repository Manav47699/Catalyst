from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ollama import chat

app = FastAPI()

# Enable CORS so Next.js can talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    messages: list # We send the whole history for "memory"

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    # Pass the entire history to Ollama so it remembers the context
    response = chat(model="legalbot", messages=req.messages)
    return {"response": response['message']['content']}