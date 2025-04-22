from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tatpara.netlify.app"],  # Removed trailing slash
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable not set")

@app.get("/motivation")
async def get_motivation():
    """Get a motivational quote from Groq API"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {"role": "system", "content": "You are a wise sage"},
                        {"role": "user", "content": "Generate a thoughtful and motivating quote or life lesson that combines wisdom, encouragement, and guidance. It should inspire personal growth, help overcome challenges, and provide a positive perspective on life, like a wise sage or master or sensei sharing timeless advice. (UNDER 100 words) "}
                    ],
                    "max_tokens": 1024
                },
                timeout=10.0
            )
            
            if response.status_code == 200:
                data = response.json()
                quote = data["choices"][0]["message"]["content"].strip()
                quote = quote.strip('"')
                
                return {"quote": quote}
            else:
                raise HTTPException(status_code=response.status_code, detail="Error from Groq API")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)