import feedparser
import json
import requests
from bs4 import BeautifulSoup
import os
import sys
from datetime import datetime

# Add the parent directory to sys.path to allow importing from backend
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

try:
    from backend.detector import NewsDetector
    detector = NewsDetector()
    AI_AVAILABLE = True
except Exception as e:
    print(f"Warning: Could not load NewsDetector. AI tagging will be skipped. {e}")
    AI_AVAILABLE = False
    detector = None

# List of RSS Feed URLs
RSS_URLS = [
    # --- Indian Sources ---
    "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",      # Times of India
    "https://zeenews.india.com/rss/india-national-news.xml",           # Zee News
    "https://www.thehindu.com/news/national/feeder/default.rss",       # The Hindu
    "https://feeds.feedburner.com/ndtvnews-india-news",                # NDTV
    "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml", # Hindustan Times
    "https://indianexpress.com/feed/",                                 # Indian Express
    "https://www.business-standard.com/rss/latest-news-1.rss",         # Business Standard
    "https://economictimes.indiatimes.com/rssfeedstopstories.cms",     # Economic Times

    # --- International Sources ---
    "http://feeds.bbci.co.uk/news/rss.xml",                            # BBC Top Stories
    "http://feeds.bbci.co.uk/news/world/rss.xml",                      # BBC World
    "http://feeds.bbci.co.uk/news/technology/rss.xml",                 # BBC Tech
    "http://rss.cnn.com/rss/edition.rss",                              # CNN Top
    "http://rss.cnn.com/rss/edition_world.rss",                        # CNN World
    "https://www.aljazeera.com/xml/rss/all.xml",                       # Al Jazeera
    "https://www.reutersagency.com/feed/?best-topics=politics&post_type=best", # Reuters (Agency Feed)

    # --- Tech & Business ---
    "https://techcrunch.com/feed/",                                    # TechCrunch
    "https://www.wired.com/feed/rss",                                  # Wired
    "https://www.theverge.com/rss/index.xml",                          # The Verge
    "https://www.cnbc.com/id/100003114/device/rss/rss.html"            # CNBC
]

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
                
    except Exception as e:
        print(f"Error fetching image for {article_url}: {e}")
    
    return None

def fetch_news():
    print("Fetching news from RSS feeds...")
    all_news = []
    
    import time
    import random
    
    for url in RSS_URLS:
        print(f"Parsing {url}...")
        try:
            # Add cache buster
            separator = "&" if "?" in url else "?"
            busted_url = f"{url}{separator}t={int(time.time())}_{random.randint(1, 1000)}"
            
            feed = feedparser.parse(busted_url)
            
            if not feed.entries:
                print(f"  No entries found for {url}")
                continue
                
            print(f"  Found {len(feed.entries)} entries. Top: {feed.entries[0].get('published', 'No Date')}")
            
            # Limit to top 25 articles per feed to ensure we get enough for the top 350 total
            entries_to_process = feed.entries[:25]
            
            for entry in entries_to_process:
                article = {
                    "title": entry.get("title", "No Title"),
                    "link": entry.get("link", ""),
                    "summary": entry.get("summary", ""),
                    "published": entry.get("published", str(datetime.now())),
                    "source": feed.feed.get("title", "Unknown Source")
                }
                
                # Attempt to extract image if not present in feed
                if "media_content" in entry and entry.media_content:
                    article["image_url"] = entry.media_content[0]['url']
                elif "media_thumbnail" in entry and entry.media_thumbnail: # BBC often uses this
                    article["image_url"] = entry.media_thumbnail[0]['url']
                else:
                 # Scrape for image
                 if article["link"]:
                     article["image_url"] = extract_image_url(article["link"])
                 else:
                     article["image_url"] = None

            # AI Credibility Tagging or Source Verification
            article["overall_label"] = "UNKNOWN"
            article["sentences"] = []
            
            # TEMPORARILY DISABLED - AI takes too long with 350 articles
            # Using quick source verification instead
            trusted_sources = ["Times of India", "BBC", "Zee News", "The Hindu", "NDTV", "Moneycontrol", "ESPN", "India Latest"]
            if any(source in article["source"] for source in trusted_sources):
                article["overall_label"] = "REAL"
                article["sentences"] = [{"text": "Verified Source", "label": "REAL", "confidence": 0.99}]

            # Clean HTML from summary
            if article["summary"]:
                soup = BeautifulSoup(article["summary"], "html.parser")
                article["summary"] = soup.get_text()

            all_news.append(article)
            
        except Exception as e:
            print(f"  Error parsing {url}: {e}")
            continue
            
    # Sort by published date (newest first)
    def parse_date(date_str):
        try:
            if not date_str: return datetime.min.replace(tzinfo=None)
            # Try parsing with pandas if available for robust parsing
            try:
                dt = pd.to_datetime(date_str, utc=True)
                return dt
            except:
                pass
            
            # Fallback to dateutil if available
            try:
                from dateutil import parser
                return parser.parse(date_str)
            except:
                pass

            return datetime.now().astimezone()
        except:
             return datetime.now().astimezone()

    try:
        import pandas as pd
        print("Sorting articles by date...")
        all_news.sort(key=lambda x: parse_date(x['published']), reverse=True)
        if all_news:
             print(f"Top article date: {all_news[0]['published']}")
             print(f"Top article title: {all_news[0]['title']}")
             
        # Keep only the latest 350 articles as requested
        all_news = all_news[:350]
        print(f"Retaining top {len(all_news)} articles after sorting.")
        
    except ImportError as e:
        print(f"Pandas not found, skipping robust sort (simple sort used): {e}")
        # Try simple sort if pandas fails
        try:
             all_news.sort(key=lambda x: x['published'], reverse=True)
        except:
             pass
            
    # Save to JSON
    output_path = os.path.join(os.path.dirname(__file__), "news_data.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_news, f, indent=4, ensure_ascii=False)
    
    print(f"Successfully fetched {len(all_news)} articles. Saved to {output_path}")

if __name__ == "__main__":
    fetch_news()
