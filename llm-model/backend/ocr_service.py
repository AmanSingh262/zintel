import json
import os
import re

try:
    import easyocr
    EASYOCR_AVAILABLE = True
except (ImportError, OSError):
    print("Warning: EasyOCR not available. OCR features will be disabled.")
    EASYOCR_AVAILABLE = False
    
try:
    from backend.detector import NewsDetector
except ModuleNotFoundError:
    try:
        from detector import NewsDetector
    except ModuleNotFoundError:
         # Fallback if running script directly from root
         try:
             import sys
             sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
             from backend.detector import NewsDetector
         except:
             print("Could not import NewsDetector")
             NewsDetector = None

# Initialize components
if EASYOCR_AVAILABLE:
    try:
        reader = easyocr.Reader(['en'])
    except Exception as e:
        print(f"Failed to init EasyOCR: {e}")
        reader = None
else:
    reader = None

news_detector = NewsDetector() if NewsDetector is not None else None

# Path to the fetched news database
NEWS_DB_PATH = os.path.join(os.path.dirname(__file__), '../scripts/news_data.json')

def load_news_db():
    if os.path.exists(NEWS_DB_PATH):
        with open(NEWS_DB_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def clean_extracted_text(text_list):
    """
    Joins OCR text list and tries to identify the headline (usually the longest or first significant line).
    """
    full_text = " ".join(text_list)
    # Simple heuristic: The longest continuous segment might be the headline
    # Or just return the full text for analysis
    return full_text.strip()

def verify_from_image(image_path):
    print(f"Processing image: {image_path}")
    
    if reader is None:
        return {"error": "OCR system is unavailable on this server."}

    # 1. Read text from image
    result = reader.readtext(image_path, detail=0)
    
    if not result:
        return {"error": "No text detected in image"}
        
    extracted_text = clean_extracted_text(result)
    print(f"Extracted Text: {extracted_text}")
    
    # 2. Cross-reference with news database
    news_db = load_news_db()
    db_match = None
    
    # Simple check: is the extracted text (or part of it) in any stored title?
    # In a real app, use fuzzy matching (Levenshtein distance)
    for article in news_db:
        if article["title"] in extracted_text or extracted_text in article["title"]:
            db_match = article
            break
            
    # 3. AI Detection
    if news_detector is not None:
        ai_analysis = news_detector.predict_article(extracted_text)
        is_fake_news = news_detector.is_fake(extracted_text)
    else:
        ai_analysis = {"error": "AI detection not available"}
        is_fake_news = False
    
    return {
        "extracted_text": extracted_text,
        "database_match": db_match, # If found, it's likely verified real news
        "ai_analysis": ai_analysis,
        "overall_prediction": "FAKE" if is_fake_news else "REAL",
        "verified_source": db_match is not None
    }
