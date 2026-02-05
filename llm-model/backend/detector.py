try:
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    import torch
    import torch.nn.functional as F
    import os
    import google.generativeai as genai
except (ImportError, OSError) as e:
    print(f"Warning: AI libraries not found or failed to load. AI features will be disabled. Error: {e}")
    torch = None

import nltk
from dotenv import load_dotenv

# Load environment variables from the root .env.local file
# content is in llm model/backend/detector.py, so root is ../../
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
env_path = os.path.join(root_dir, ".env.local")
load_dotenv(env_path)

class NewsDetector:
    def __init__(self, model_name="elvis/fake-news-bert-detector"):
        if torch is None:
            print("AI functionalities are disabled due to missing libraries.")
            return

        self.google_api_key = os.getenv("GEMINI_API_KEY")
        self.gemini_model = None
        
        if self.google_api_key:
            try:
                print("Initializing Gemini API...")
                genai.configure(api_key=self.google_api_key)
                self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
                print("Gemini API initialized successfully.")
            except Exception as e:
                print(f"Failed to load Gemini: {e}")

        if not self.gemini_model:
            print(f"Loading local model: {model_name}...")
            try:
                self.tokenizer = AutoTokenizer.from_pretrained(model_name)
                self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
                self.model.eval() # Set to evaluation mode
                print("Model loaded successfully.")
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model = None

        # Ensure NLTK data is available
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            print("Downloading NLTK punkt tokenizer...")
            nltk.download('punkt')
            nltk.download('punkt_tab')

    def _predict_text(self, text):
        if self.gemini_model:
            try:
                prompt = f"""
                Analyze the credibility of the following news snippet. 
                Classify it as 'REAL' or 'FAKE'. 
                Provide a score between 0.0 and 1.0 (where 1.0 is highly credible).
                
                Snippet: "{text}"
                
                Return JSON format ONLY: {{"label": "REAL/FAKE", "confidence": float}}
                """
                response = self.gemini_model.generate_content(prompt)
                import json
                # Extract JSON from response (handling potential markdown)
                content = response.text.replace('```json', '').replace('```', '').strip()
                result = json.loads(content)
                
                return {
                    "label": result.get("label", "UNKNOWN"),
                    "confidence": result.get("confidence", 0.0),
                    "scores": {"fake": 0 if result.get("label") == "REAL" else 1, "real": 1 if result.get("label") == "REAL" else 0}
                }
            except Exception as e:
                print(f"Gemini API Error: {e}")
                # Fallback to local
        
        if torch is None or self.model is None:
             return { "label": "UNKNOWN", "confidence": 0.0, "scores": {"fake": 0, "real": 0} }

        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
        with torch.no_grad():
            outputs = self.model(**inputs)
            probabilities = F.softmax(outputs.logits, dim=1)
            
        fake_score = probabilities[0][0].item()
        real_score = probabilities[0][1].item()
        
        predicted_class_id = torch.argmax(probabilities).item()
        label = self.model.config.id2label[predicted_class_id] # Uses model's internal config for labels
        
        return {
            "label": label,
            "confidence": max(fake_score, real_score),
            "scores": {"fake": fake_score, "real": real_score}
        }

    def predict_article(self, text):
        """
        Splits article into sentences and predicts credibility for each.
        """
        sentences = nltk.sent_tokenize(text)
        results = []
        
        for sentence in sentences:
            if not sentence.strip():
                continue
            prediction = self._predict_text(sentence)
            results.append({
                "text": sentence,
                "label": prediction["label"],
                "confidence": prediction["confidence"]
            })
            
        return results

    def is_fake(self, headline):
        """
        Quick check for a headline. Returns True if Fake, False if Real.
        """
        prediction = self._predict_text(headline)
        # Check if label indicates fake. Adjust string matching based on model config.
        # Usually labels are 'FAKE', 'REAL' or 'Label_0', 'Label_1'
        label = prediction["label"].upper()
        return "FAKE" in label or label == "LABEL_0"
