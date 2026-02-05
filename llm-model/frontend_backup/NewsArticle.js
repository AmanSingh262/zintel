import React, { useState } from 'react';

const NewsArticle = ({ article }) => {
  // article.sentences is expected to be a list of objects: 
  // { text: "Some sentence.", label: "real" | "fake", confidence: 0.95 }
  
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCameraCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Assuming FastAPI backend is running on localhost:8000
      const response = await fetch('http://localhost:8000/verify-ocr', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setVerificationResult(data);
    } catch (error) {
      console.error("Error verifying image:", error);
      alert("Failed to verify image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>{article?.title || "News Article"}</h1>
      
      <div className="article-content" style={{ lineHeight: '1.6', fontSize: '18px' }}>
        {article?.sentences ? (
            article.sentences.map((sent, index) => (
            <span 
                key={index} 
                style={{
                textDecoration: 'underline', 
                textDecorationColor: sent.label === 'fake' || sent.label === 'LABEL_0' ? 'red' : 'green',
                textDecorationThickness: '3px',
                backgroundColor: sent.label === 'fake' || sent.label === 'LABEL_0' ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
                marginRight: '5px'
                }}
                title={`Prediction: ${sent.label} (${Math.round(sent.confidence * 100)}%)`}
            >
                {sent.text}
            </span>
            ))
        ) : (
            <p>No article analysis data available.</p>
        )}
      </div>

      <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <h3>News Camera Verification</h3>
        <p>Take a photo of a newspaper or screen to verify with our database and AI.</p>
        
        <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            onChange={handleCameraCapture}
            style={{ display: 'none' }}
            id="cameraInput"
        />
        <label 
            htmlFor="cameraInput" 
            style={{
                padding: '10px 20px', 
                backgroundColor: '#0070f3', 
                color: 'white', 
                borderRadius: '5px', 
                cursor: 'pointer',
                display: 'inline-block'
            }}
        >
            {loading ? "Verifying..." : "Open Camera / Upload Photo"}
        </label>

        {verificationResult && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <h4>Verification Result:</h4>
                <p><strong>Extracted Text:</strong> {verificationResult.extracted_text}</p>
                <p>
                    <strong>Status: </strong> 
                    <span style={{ 
                        color: verificationResult.overall_prediction === 'REAL' ? 'green' : 'red',
                        fontWeight: 'bold' 
                    }}>
                        {verificationResult.overall_prediction}
                    </span>
                </p>
                {verificationResult.verified_source && (
                    <p style={{color: 'green'}}>✅ Verified against trusted RSS Database match: "{verificationResult.database_match.title}"</p>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default NewsArticle;
