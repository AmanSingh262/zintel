"use client";

import { useEffect, useState, useMemo } from 'react';
import NewsArticle from './components/NewsArticle';

interface Article {
  title: string;
  link: string;
  summary: string;
  published: string;
  source: string;
  image_url: string | null;
  sentences?: any[];
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Top Stories");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/news');
      if (!res.ok) throw new Error('Failed to connect to backend');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setArticles(data);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError(data.error || "Unknown error");
      }
    } catch (err) {
      setError("News Service Unavailable");
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch & Auto Refresh (20 mins)
  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 20 * 60 * 1000); 
    return () => clearInterval(interval);
  }, []);

  // Filtering Logic
  const filteredArticles = useMemo(() => {
    // If we have search results from the server, use them directly (assuming we store them in 'articles' or a separate state)
    // However, the prompt implies the search replaces the view.
    // For now, let's keep client-side filtering for category, but search should perhaps trigger a server fetch if the user hits enter/search button.
    
    let filtered = articles;
    if (searchTerm && !selectedCategory.startsWith("Results:")) {
        // Client side filter for immediate feedback or if using local data
       const lowerSearch = searchTerm.toLowerCase();
       filtered = filtered.filter(a => 
         (a.title && a.title.toLowerCase().includes(lowerSearch)) || 
         (a.summary && a.summary.toLowerCase().includes(lowerSearch))
       );
    }
    
    // Category/Source Filter
    if (selectedCategory !== "Top Stories") {
      if (selectedCategory === "Market") {
        const marketKeywords = ['market', 'sensex', 'nifty', 'economy', 'bank', 'stock', 'trade', 'finance', 'business'];
        filtered = filtered.filter(a => marketKeywords.some(k => a.title.toLowerCase().includes(k) || a.summary.toLowerCase().includes(k)));
      } 
      else if (selectedCategory === "World") {
        filtered = filtered.filter(a => a.source.includes('BBC') || a.title.toLowerCase().includes('global') || a.title.toLowerCase().includes('us '));
      }
      else if (selectedCategory === "GenZ News") {
        // Filter for social media trends and viral content
        const trendKeywords = [
            'viral', 'trend', 'instagram', 'youtube', 'facebook', 'social media', 'video', 
            'watch', 'reveal', 'hack', 'influencer', 'meme', 'crypto', 'technology', 
            'ai ', 'chatgpt', 'meta', 'snapchat', 'reddit', 'drama', 'shocking'
        ];
        filtered = filtered.filter(a => 
            trendKeywords.some(k => 
                a.title.toLowerCase().includes(k) || 
                (a.summary && a.summary.toLowerCase().includes(k))
            )
        );
      }
    }
    
    return filtered;
  }, [articles, searchTerm, selectedCategory]);

  const categories = ["Top Stories", "Market", "World", "GenZ News"];

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
        fetchNews(); // Reset to top stories if empty
        return;
    }
    setLoading(true);
    try {
        const res = await fetch(`http://localhost:8080/search?q=${encodeURIComponent(searchTerm)}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setArticles(data);
        setLastUpdated(new Date());
        setSelectedCategory(`Results: "${searchTerm}"`);
    } catch (e) {
        setError("Search failed to fetch results.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header>
        <div className="container header-inner">
          <div className="brand" onClick={() => { setSearchTerm(""); setSelectedCategory("Top Stories"); fetchNews(); }} style={{cursor: 'pointer'}}>
            <span style={{fontSize: '30px'}}>🛡️</span>
            <div>
              <div style={{lineHeight: 1}}>NEWS<span style={{color: '#B90000'}}>GUARD</span></div>
              <div style={{fontSize: '10px', fontWeight: 'normal', opacity: 0.7}}>AI Powered Integrity</div>
            </div>
          </div>
          
          <div className="search-bar">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search news, topics..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav-categories">
        <div className="container">
          <ul className="nav-list">
            {categories.map(cat => (
              <li 
                key={cat} 
                className={`nav-item ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container news-layout">

        {/* Hero / Info Banner */}
        <div className="hero-banner">
          <div className="hero-content">
             <h4>🤖 AI-Powered Fact Check</h4>
             <p>Our system continuously scans 1,000+ sources to flag potential misinformation. <span style={{color: 'green', fontWeight: 'bold'}}>Green</span> means verified. <span style={{color: 'red', fontWeight: 'bold'}}>Red</span> means suspicious.</p>
          </div>
          <div style={{fontSize: '30px', opacity: 0.2}}>🛡️</div>
        </div>
        
        {/* Feed Section */}
        <section>
          <div className="section-header">
            <h2 className="section-title">{selectedCategory}</h2>
            <span className="refresh-badge">
                {lastUpdated ? `UPDATED ${lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'UPDATING...'}
            </span>
          </div>

          {loading ? (
             <div style={{textAlign: 'center', padding: '60px', color: '#888'}}>
                <div style={{fontSize: '40px', marginBottom: '10px'}}>🗞️</div>
                <div>Fetching the latest headlines...</div>
             </div>
          ) : error ? (
            <div style={{padding: '20px', background: '#ffebe9', color: '#d32f2f', border: '1px solid #ffcdd2', borderRadius: '4px'}}>
              {error}
            </div>
          ) : (
            <div className="articles-grid">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article, index) => (
                  <NewsArticle key={index} article={article} />
                ))
              ) : (
                <div style={{textAlign: 'center', padding: '40px', color: '#555', gridColumn: '1/-1'}}>
                  <p>No articles found for this category.</p>
                  <button onClick={() => setSelectedCategory("Top Stories")} style={{color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer'}}>Go back to Top Stories</button>
                </div>
              )}
            </div>
          )}
        </section>

      </main>
      
      {/* Footer */}
      <footer style={{background: '#333', color: '#fff', padding: '20px 0', marginTop: 'auto', textAlign: 'center', fontSize: '14px'}}>
        <div className="container">
           &copy; {new Date().getFullYear()} NewsGuard AI. All rights reserved. | <span onClick={() => window.scrollTo(0,0)} style={{cursor: 'pointer', textDecoration: 'underline'}}>Back to Top</span>
        </div>
      </footer>
    </div>
  );
}

