import feedparser
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import urllib.parse

# List of RSS Feed URLs
RSS_URLS = [
    "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
    "https://zeenews.india.com/rss/india-national-news.xml",
    "http://feeds.bbci.co.uk/news/world/rss.xml",
    "https://www.thehindu.com/news/national/feeder/default.rss",
    "https://feeds.feedburner.com/ndtvnews-top-stories",
    "https://www.indiatoday.in/rss/1206584",
    "https://economictimes.indiatimes.com/rssfeeds/default.cms",
    "https://www.moneycontrol.com/rss/latestnews.xml",
    "https://www.espncricinfo.com/rss/content/story/feeds/0.xml",
    "https://www.techcrunch.com/feed",
    "https://www.wired.com/feed/rss",
    "https://www.bollywoodhungama.com/rss/news.xml",
    "https://www.pinkvilla.com/feed"
]

TRUSTED_SOURCES = ["Times of India", "Zee News", "BBC", "The Hindu", "NDTV", "India Today", "Livemint", "Moneycontrol", "ICC", "ESPN", "Cricbuzz", "Google News", "The Economic Times", "Hindustan Times", "News18"]

# Known placeholder images to filter out
BAD_IMAGE_PATTERNS = [
    "google_news_logo", 
    "googleusercontent.com", 
    "gstatic.com", 
    "placeholder", 
    "pixel.gif",
    "feedburner"
]

def detailed_heuristic_check(title, summary):
    """
    Simulates AI detection using keyword analysis since Torch is disabled.
    Returns: Label (REAL/FAKE/CLICKBAIT), Confidence
    """
    text = (title + " " + summary).lower()
    
    # Suspicious/Fake Keywords
    fake_keywords = [
        "shocking", "you won't believe", "omg", "miracle", "secret cure", 
        "banned", "what they don't want you to know", "100% waorking", 
        "free money", "winner", "lottery", "viral video"
    ]
    
    # Clickbait indicators
    clickbait_starts = ["this is why", "the reason why", "what happened next"]
    
    # Legit News Indicators
    legit_keywords = [
        "report", "official", "statement", "announced", "update", "scores", 
        "market", "sensex", "nifty", "government", "police", "court", 
        "stats", "match", "tournament", "meeting", "launch", "forecast"
    ]

    score = 0
    # Penalize Fake/Clickbait
    if any(k in text for k in fake_keywords): score -= 5
    if any(text.startswith(c) for c in clickbait_starts): score -= 3
    
    # Reward Legit
    score += sum(1 for k in legit_keywords if k in text)
    
    # Logic
    if score < -2:
        return "SUSPICIOUS", 0.75
    elif score >= 1:
        return "REAL", 0.85
    else:
        return "NEUTRAL", 0.50

def extract_image_url(article_url):
    """
    Attempts to scrape the main image URL from the article page.
    """
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(article_url, headers=headers, timeout=5)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Try finding Open Graph image
            og_image = soup.find("meta", property="og:image")
            if og_image and og_image.get("content"):
                return og_image["content"]
                
            # Try finding Twitter image
            twitter_image = soup.find("meta", name="twitter:image")
            if twitter_image and twitter_image.get("content"):
                return twitter_image["content"]
            
            # Fallback: Find first img tag
            img = soup.find("img")
            if img and img.get("src"):
                return img["src"]
                
    except (requests.exceptions.Timeout, requests.exceptions.ConnectionError):
        # Silently skip timeout/connection errors - very common and expected
        pass
    except Exception as e:
        # Only log unexpected errors
        pass
    
    return None

def process_entry(entry, source_name):
    article = {
        "title": entry.get("title", "No Title"),
        "link": entry.get("link", ""),
        "summary": entry.get("summary", ""),
        "published": entry.get("published", str(datetime.now())),
        "source": source_name
    }
    
    # Image Extraction
    img_url = None
    if "media_content" in entry and entry.media_content:
        img_url = entry.media_content[0]['url']
    elif "media_thumbnail" in entry and entry.media_thumbnail:
        img_url = entry.media_thumbnail[0]['url']
    
    # Filter out bad/placeholder images
    if img_url:
         if any(bad in img_url for bad in BAD_IMAGE_PATTERNS):
             img_url = None

    if img_url:
         article["image_url"] = img_url
    else:
        # Fallback: Scrape the article page for an image (only if link is available)
        if article.get("link"):
            article["image_url"] = extract_image_url(article["link"])
        else:
            article["image_url"] = None

    # Simplified Credibility Logic (Safe Mode with Heuristics)
    is_trusted = any(ts.lower() in source_name.lower() for ts in TRUSTED_SOURCES)
    
    article["sentences"] = []
    
    if is_trusted:
        article["overall_label"] = "REAL"
        article["sentences"].append({
            "text": "Verified Source",
            "label": "REAL", 
            "confidence": 0.99
        })
    else:
        # Fallback to Heuristic Check
        label, conf = detailed_heuristic_check(article["title"], article["summary"])
        article["overall_label"] = label
        article["sentences"].append({
            "text": "Heuristic Analysis",
            "label": label, 
            "confidence": conf
        })
    
    return article

def fetch_rss_news():
    print("Fetching news from RSS feeds...")
    all_news = []
    
    for url in RSS_URLS:
        try:
            print(f"Parsing {url}...")
            feed = feedparser.parse(url)
            source_title = feed.feed.get("title", "Unknown Source")
            
            # Increased limit to get more news (was 10)
            for entry in feed.entries[:30]: 
                article = process_entry(entry, source_title)
                all_news.append(article)
        except Exception as e:
            print(f"Error parsing feed {url}: {e}")
            
    return all_news

def search_news_topic(query):
    print(f"Searching news for topic: {query}")
    encoded_query = urllib.parse.quote(query)
    url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"
    
    all_news = []
    try:
        feed = feedparser.parse(url)
        for entry in feed.entries[:50]:
            # Google News RSS source is usually in the title or a separate field
            source = entry.get("source", {}).get("title", "Google News")
            article = process_entry(entry, source)
            all_news.append(article)
    except Exception as e:
        print(f"Error searching news: {e}")
        
    return all_news
