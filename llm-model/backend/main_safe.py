from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import json
import asyncio
from contextlib import asynccontextmanager
from .news_fetcher import fetch_rss_news, search_news_topic

# Global variable to store news in memory
current_news_db = []

def update_news_db():
    global current_news_db
    print("Updating news database...")
    try:
        current_news_db = fetch_rss_news()
        print(f"News updated. Count: {len(current_news_db)}")
        # Optional: Save to file for persistence
        news_path = os.path.join(os.path.dirname(__file__), "../scripts/news_data.json")
        with open(news_path, "w", encoding="utf-8") as f:
             json.dump(current_news_db, f, default=str)
    except Exception as e:
        print(f"Failed to update news: {e}")

# Background Task for auto-refresh
async def periodic_news_refresh():
    while True:
        update_news_db()
        # Wait 20 minutes
        await asyncio.sleep(20 * 60)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load initial data
    update_news_db()
    # Start background task
    task = asyncio.create_task(periodic_news_refresh())
    yield
    # Cleanup (if needed)
    task.cancel()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "News Aggregator API (Safe Mode) is running"}

@app.get("/news")
def get_news():
    global current_news_db
    # If empty, try loading from file
    if not current_news_db:
        news_path = os.path.join(os.path.dirname(__file__), "../scripts/news_data.json")
        if os.path.exists(news_path):
            with open(news_path, "r", encoding="utf-8") as f:
                current_news_db = json.load(f)
    return current_news_db

@app.get("/search")
def search_handler(q: str = Query(..., description="Search query")):
    if not q:
        return []
    results = search_news_topic(q)
    return results

@app.post("/verify-ocr")
async def verify_ocr_endpoint(file: UploadFile = File(...)):
    return {
        "extracted_text": "OCR Disabled in Safe Mode",
        "overall_prediction": "UNKNOWN",
        "verified_source": False
    }

@app.post("/predict")
def predict_news(text: str):
    return [{
        "text": text[:50] + "...",
        "label": "AI Disabled",
        "confidence": 0.0
    }]
