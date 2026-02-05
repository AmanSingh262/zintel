from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import json
# Import the services we created
try:
    from .ocr_service import verify_from_image, get_news_detector
except ImportError:
    from ocr_service import verify_from_image, get_news_detector

# Lazy load news detector
def get_detector():
    return get_news_detector()

app = FastAPI()

# Allow connections from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "News Aggregator & Fake News Detector API is running"}

@app.get("/news")
def get_news():
    """Returns the JSON news data fetched by the script."""
    # Try multiple paths to find news_data.json
    possible_paths = [
        "../scripts/news_data.json",
        "../../scripts/news_data.json",
        "scripts/news_data.json"
    ]
    
    news_path = None
    for p in possible_paths:
        path = os.path.join(os.path.dirname(__file__), p)
        if os.path.exists(path):
            news_path = path
            break
            
    if news_path and os.path.exists(news_path):
        try:
            with open(news_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data
        except:
            pass
            
    # Return mock data so the UI always has something to show
    return [
        {
            "title": "Backend Connected: No News Data Found",
            "link": "#",
            "summary": "The API is working, but 'news_data.json' was not found. Please run 'scripts/fetch_news.py' to generate real news data.",
            "published": "Just now",
            "source": "System",
            "image_url": None,
            "overall_label": "REAL"
        }
    ]

@app.post("/verify-ocr")
async def verify_ocr_endpoint(file: UploadFile = File(...)):
    """Receives an image, extracts text, and verifies it."""
    temp_file = f"temp_{file.filename}"
    try:
        with open(temp_file, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Determine verified status using our OCR service
        result = verify_from_image(temp_file)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(temp_file):
            os.remove(temp_file)

@app.post("/predict")
def predict_news(text: str = ""):
    """Direct text prediction endpoint."""
    detector = get_detector()
    if detector is None:
        return {"error": "News detector not available. Please configure GOOGLE_GEMINI_API_KEY."}
    return detector.predict_article(text)

if __name__ == "__main__":
    import uvicorn
    # Using port 8001 to avoid conflicts
    print("Starting LLM Backend on port 8001 (host 0.0.0.0)...")
    uvicorn.run(app, host="0.0.0.0", port=8001)
