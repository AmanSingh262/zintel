"use client";
import React, { useState, ChangeEvent } from 'react';

// Define interfaces for the props
interface Sentence {
  text: string;
  label: string;
  confidence: number;
}

interface Article {
  title: string;
  summary?: string;
  link?: string;
  image_url?: string | null;
  sentences?: Sentence[];
  overall_label?: string;
}

interface VerificationResult {
  extracted_text: string;
  overall_prediction: string;
  verified_source: boolean;
  database_match?: { title: string };
}

interface NewsArticleProps {
  article: Article;
}

const NewsArticle: React.FC<NewsArticleProps> = ({ article }) => {
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [localSentences, setLocalSentences] = useState<Sentence[] | undefined>(article.sentences);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    // Use the article text (summary or title) for analysis locally
    // Since backend expects just text string to /predict
    const textToAnalyze = article.sentences ? "" : (article.summary || article.title || "");
    
    if (!textToAnalyze) return;

    try {
        const response = await fetch(`http://localhost:8080/predict?text=${encodeURIComponent(textToAnalyze)}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        // Backend returns list of objects {text, label, confidence}
        setLocalSentences(data);
    } catch (e) {
        console.error("Analysis failed", e);
        alert("Analysis failed. Is the backend AI running?");
    } finally {
        setAnalyzing(false);
    }
  };

  const displaySentences = localSentences || article.sentences;

  // Determine Stamp Image
  // Assumes images are at /public/images/fake.webp and /public/images/Real.png
  let stampUrl = null;
  if (article.overall_label === 'FAKE') stampUrl = '/images/fake.webp';
  else if (article.overall_label === 'REAL') stampUrl = '/images/Real.png';
  
  const handleCameraCapture = async (e: ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/verify-ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setVerificationResult(data);
    } catch (error) {
      console.error("Error verifying image:", error);
      alert("Failed to verify image. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="news-card">
      
      {/* Credibility Stamp */}
      {stampUrl ? (
        <img 
            src={stampUrl} 
            alt={article.overall_label}
            style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '100px',
                height: '100px',
                opacity: 0.85,
                zIndex: 10,
                pointerEvents: 'none'
            }}
            onError={(e) => {
                // If image fails, hide it and maybe show text backup
                (e.target as HTMLImageElement).style.display = 'none';
                
                // Add a text-based badge as fallback (simulated via creating element or just relying on parent)
                const parent = (e.target as HTMLImageElement).parentElement;
                if(parent) {
                    const badge = document.createElement("div");
                    badge.innerText = article.overall_label || "UNKNOWN";
                    badge.style.position = "absolute";
                    badge.style.top = "10px";
                    badge.style.right = "10px";
                    badge.style.background = article.overall_label === 'FAKE' ? "red" : "green";
                    badge.style.color = "white";
                    badge.style.padding = "5px 10px";
                    badge.style.fontWeight = "bold";
                    badge.style.borderRadius = "4px";
                    parent.appendChild(badge);
                }
            }}
        />
      ) : article.overall_label ? (
         <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: article.overall_label === 'FAKE' ? "red" : (article.overall_label === 'REAL' ? "green" : "gray"),
            color: "white",
            padding: "5px 10px",
            fontWeight: "bold",
            borderRadius: "4px",
            zIndex: 10
         }}>
            {article.overall_label}
         </div>
      ) : null}

      {/* News Image */}
      {article.image_url && (
          <div style={{ marginBottom: '15px' }}>
              <img 
                  src={article.image_url} 
                  alt="News highlight" 
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '6px' }}
                  onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'; // Hide if broken
                  }}
              />
          </div>
      )}

      <h2 style={{marginTop: 0}}>
        {article.link ? (
            <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                {article.title} <span style={{fontSize: '0.6em'}}>🔗</span>
            </a>
        ) : (
            article.title
        )}
      </h2>
      
      <div className="article-content" style={{ lineHeight: '1.6', fontSize: '16px', marginBottom: '15px' }}>
        <p style={{color: '#333'}}>
            {article.summary || "No summary available."}
        </p>
        
        {displaySentences && displaySentences.length > 0 && (
            <div style={{marginTop: '10px', fontSize: '14px', background: '#f5f5f5', padding: '10px', borderRadius: '4px'}}>
                <strong>Analysis:</strong>
                {displaySentences.map((sent, index) => (
                    <span 
                        key={index} 
                        style={{
                            marginLeft: '8px',
                            color: sent.label === 'fake' || sent.label.includes('LABEL_0') ? 'red' : 'green',
                            fontWeight: 'bold'
                        }}
                    >
                        {sent.text} 
                    </span>
                ))}
            </div>
        )}
        
        {!displaySentences && (
             <button 
                onClick={handleAnalyze} 
                disabled={analyzing}
                style={{
                    padding: '6px 12px',
                    background: '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '10px'
                }}
            >
                {analyzing ? "Analyzing..." : "🔍 Analyze Credibility"}
            </button>
        )}
      </div>

      {/* Verification / AI Logic used to be here (OCR), now removed as per request */}
    </div>
  );
};

export default NewsArticle;
