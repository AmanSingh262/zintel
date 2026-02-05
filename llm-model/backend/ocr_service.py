import json
import os
import re

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except (ImportError, OSError):
    print("Warning: Google Generative AI not available. AI features will be disabled.")
    GEMINI_AVAILABLE = False

# Lazy initialization - don't load on startup
_news_detector = None

def get_news_detector():
    """Lazy load news detector only when needed"""
    global _news_detector
    if _news_detector is None and GEMINI_AVAILABLE:
        try:
            from backend.detector import NewsDetector
        except ModuleNotFoundError:
            try:
                from detector import NewsDetector
            except ModuleNotFoundError:
                print("Could not import NewsDetector")
                return None
        _news_detector = NewsDetector()
    return _news_detector

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
    """
    Simplified verification using Gemini Vision API instead of EasyOCR.
    This avoids memory-heavy model downloads.
    """
    print(f"Processing image: {image_path}")
    
    if not GEMINI_AVAILABLE:
        return {"error": "AI vision system is unavailable. Please set GOOGLE_GEMINI_API_KEY environment variable."}

    try:
        # Use Gemini Vision to extract text from image
        from PIL import Image
        
        # Configure Gemini
        api_key = os.environ.get("GOOGLE_GEMINI_API_KEY")
        if not api_key:
            return {"error": "GOOGLE_GEMINI_API_KEY not configured"}
            
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Open and analyze image
        img = Image.open(image_path)
        prompt = "Extract all text from this image. Focus on headlines and main content."
        response = model.generate_content([prompt, img])
        extracted_text = response.text.strip()
        
        print(f"Extracted Text: {extracted_text}")
        
        if not extracted_text:
            return {"error": "No text detected in image"}
        
        # 2. Cross-reference with news database
        news_db = load_news_db()
        db_match = None
        
        # Simple check: is the extracted text (or part of it) in any stored title?
        for article in news_db:
            if article["title"] in extracted_text or extracted_text in article["title"]:
                db_match = article
                break
                
        # 3. AI Detection (lazy load)
        news_detector = get_news_detector()
        if news_detector is not None:
            ai_analysis = news_detector.predict_article(extracted_text)
            is_fake_news = news_detector.is_fake(extracted_text)
        else:
            ai_analysis = {"error": "AI detection not available"}
            is_fake_news = False
        
        return {
            "extracted_text": extracted_text,
            "database_match": db_match,
            "ai_analysis": ai_analysis,
            "overall_prediction": "FAKE" if is_fake_news else "REAL",
            "verified_source": db_match is not None
        }
        
    except Exception as e:
        print(f"Error processing image: {e}")
        return {"error": f"Image processing failed: {str(e)}"}
