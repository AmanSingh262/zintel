"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useEffect, useState, useMemo, ChangeEvent } from 'react';

interface Sentence {
  text: string;
  label: string;
  confidence: number;
}

interface Article {
  title: string;
  link: string;
  summary: string;
  published: string;
  source: string;
  image_url: string | null;
  sentences?: Sentence[];
  overall_label?: string;
}

interface VerificationResult {
  extracted_text: string;
  overall_prediction: string;
  verified_source: boolean;
  database_match?: { title: string };
}

// Mock news data
const mockArticles: Article[] = [
  {
    title: "India's GDP Growth Surges to 8.2% in Q4 2025",
    link: "#",
    summary: "Economic expansion driven by manufacturing sector and digital transformation initiatives. Exports reach all-time high with significant growth in tech and pharma sectors.",
    published: "2 hours ago",
    source: "Economic Times",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    overall_label: "REAL"
  },
  {
    title: "New Education Policy Shows 95% School Enrollment",
    link: "#",
    summary: "Digital learning platforms and infrastructure improvements lead to historic enrollment rates across rural India. Government's flagship program reaches 45 million students.",
    published: "5 hours ago",
    source: "The Hindu",
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop",
    overall_label: "REAL"
  },
  {
    title: "Renewable Energy Capacity Reaches 200 GW Milestone",
    link: "#",
    summary: "India achieves ambitious clean energy targets ahead of schedule. Solar and wind power lead the growth, reducing carbon emissions by 35%.",
    published: "8 hours ago",
    source: "Times of India",
    image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop",
    overall_label: "REAL"
  },
  {
    title: "Healthcare Infrastructure Expansion in Rural Areas",
    link: "#",
    summary: "Government launches 10,000 new primary health centers. Telemedicine services reach remote villages, improving access to healthcare for 150 million people.",
    published: "12 hours ago",
    source: "Indian Express",
    image_url: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=250&fit=crop",
    overall_label: "REAL"
  },
  {
    title: "India Becomes Third Largest Economy in the World",
    link: "#",
    summary: "Breaking economic forecasts, India surpasses Japan and Germany to become the world's third-largest economy with a GDP of $5.5 trillion.",
    published: "1 day ago",
    source: "Reuters India",
    image_url: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=250&fit=crop",
    overall_label: "REAL"
  },
  {
    title: "Fake News Alert: Moon Landing Conspiracy Resurfaces",
    link: "#",
    summary: "Debunked conspiracy theories about India's lunar mission resurface on social media. Space agency confirms all missions are authentic with verified data.",
    published: "2 days ago",
    source: "Fact Check India",
    image_url: null,
    overall_label: "FAKE"
  }
];

export default function EngagementPage() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Top Stories");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedAnalysis, setExpandedAnalysis] = useState<Set<number>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      if (!res.ok) {
        // Silently fail and use mock data
        setLoading(false);
        return;
      }
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setArticles(data);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (err) {
      // Silently fail and use mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const filteredArticles = useMemo(() => {
    let filtered = articles;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(a =>
        (a.title && a.title.toLowerCase().includes(lowerSearch)) ||
        (a.summary && a.summary.toLowerCase().includes(lowerSearch))
      );
    }

    if (selectedCategory !== "Top Stories") {
      if (selectedCategory === "Market") {
        const marketKeywords = ['market', 'sensex', 'nifty', 'economy', 'bank', 'stock', 'trade', 'finance', 'business'];
        filtered = filtered.filter(a => marketKeywords.some(k => a.title.toLowerCase().includes(k) || a.summary.toLowerCase().includes(k)));
      }
      else if (selectedCategory === "World") {
        filtered = filtered.filter(a => a.source.includes('BBC') || a.title.toLowerCase().includes('global') || a.title.toLowerCase().includes('us '));
      }
      else if (selectedCategory === "GenZ News") {
        const trendKeywords = ['viral', 'trend', 'instagram', 'youtube', 'social media', 'video', 'influencer', 'crypto', 'technology', 'ai'];
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

  const handleAnalyze = async (article: Article) => {
    setSelectedArticle(article);
    setVerifyLoading(true);
    const textToAnalyze = article.summary || article.title || "";

    if (!textToAnalyze) return;

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze })
      });
      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      const updatedArticle = { ...article, sentences: data };
      setSelectedArticle(updatedArticle);

      const updatedArticles = articles.map(a =>
        a.title === article.title ? updatedArticle : a
      );
      setArticles(updatedArticles);
      
      // Auto-expand the analysis for this article only if there are many results
      const articleIndex = filteredArticles.findIndex(a => a.title === article.title);
      if (articleIndex !== -1 && data.length > 1) {
        const newExpanded = new Set(expandedAnalysis);
        newExpanded.add(articleIndex);
        setExpandedAnalysis(newExpanded);
      }
    } catch (e) {
      console.error("Analysis failed", e);
      alert("Analysis failed. Check if backend is running.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleImageVerify = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVerifyLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8001/verify-ocr', {
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
      alert("Failed to verify image. Ensure backend is running on port 8080.");
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8 gap-3">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-4xl">🛡️</span>
              NEWS<span className="text-red-600">CHECKER</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">AI-Powered News Verification</p>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs sm:text-sm text-gray-600">
              {mounted && lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
            </div>
            <button
              onClick={fetchNews}
              className="text-purple-600 hover:text-purple-700 text-xs sm:text-sm font-semibold mt-1"
            >
              <i className="ri-refresh-line"></i> Refresh
            </button>
          </div>
        </div>

        {/* AI Info Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-8 border border-purple-100">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <div className="text-2xl sm:text-4xl flex-shrink-0">🤖</div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-1">AI-Powered Fact Check</h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Our system scans 1,000+ sources to flag misinformation.
                <span className="text-green-600 font-bold"> Green</span> = verified.
                <span className="text-red-600 font-bold"> Red</span> = suspicious.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Upload */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 relative">
            <i className="ri-search-line absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl"></i>
            <input
              type="text"
              placeholder="Search news articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <label className="px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap">
            <i className="ri-camera-line text-lg sm:text-xl"></i>
            <span className="hidden sm:inline">Upload Image</span>
            <span className="sm:hidden">Upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageVerify}
              className="hidden"
            />
          </label>
        </div>

        {/* Image Verification Result */}
        {verificationResult && (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold mb-3 flex items-center gap-2">
              <i className="ri-image-line"></i>
              Image Verification Result
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <p><strong>Extracted Text:</strong> {verificationResult.extracted_text}</p>
              <p><strong>Prediction:</strong>
                <span className={verificationResult.overall_prediction === 'FAKE' ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                  {' '}{verificationResult.overall_prediction}
                </span>
              </p>
              <p><strong>Verified Source:</strong> {verificationResult.verified_source ? '✓ Yes' : '✗ No'}</p>
              {verificationResult.database_match && (
                <p className="text-green-600">✓ Matched: {verificationResult.database_match.title}</p>
              )}
            </div>
            <button
              onClick={() => setVerificationResult(null)}
              className="mt-4 text-purple-600 hover:text-purple-700 text-sm font-semibold"
            >
              Clear Result
            </button>
          </div>
        )}

        {/* Categories */}
        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-8 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition ${selectedCategory === cat
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Articles */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🗞️</div>
            <p className="text-gray-600">Fetching latest headlines...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
            <p className="font-semibold mb-2">⚠️ Service Disconnected</p>
            <p className="text-sm">{error || "The AI backend service is not reachable."}</p>
            <div className="mt-4">
              <button onClick={fetchNews} className="bg-red-100 px-4 py-2 rounded text-sm font-semibold hover:bg-red-200">
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition relative flex flex-col h-full">

                  {/* Credibility Badge */}
                  {article.overall_label && (
                    <div className="absolute top-0 right-0 z-10">
                      {article.overall_label === 'FAKE' ? (
                        <img src="/images/fake.webp" alt="Fake News" className="h-16 sm:h-20 md:h-24 w-auto rounded shadow-sm transform -rotate-12" />
                      ) : (
                        <img src="/images/Real.png" alt="Real News" className="h-16 sm:h-20 md:h-24 w-auto rounded shadow-sm transform -rotate-12" />
                      )}
                    </div>
                  )}

                  {/* Image */}
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-40 sm:h-48 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}

                  {/* Content */}
                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {article.link ? (
                        <a href={article.link} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600">
                          {article.title}
                        </a>
                      ) : article.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.summary}</p>

                    {/* Sentence Analysis */}
                    {article.sentences && article.sentences.length > 0 && (
                      <div className="bg-gray-50 p-2.5 sm:p-3 rounded-lg text-[10px] sm:text-xs mb-4">
                        <strong className="block mb-2 text-xs sm:text-sm">AI Analysis:</strong>
                        <div className="space-y-1">
                          {(expandedAnalysis.has(index) ? article.sentences : article.sentences.slice(0, 1)).map((sent, idx) => (
                            <div
                              key={idx}
                              className={`${sent.label === 'fake' || sent.label.includes('LABEL_0') ? 'text-red-600' : 'text-green-600'
                                }`}
                            >
                              • {sent.text}
                            </div>
                          ))}
                          {article.sentences.length > 1 && (
                            <button
                              onClick={() => {
                                const newExpanded = new Set(expandedAnalysis);
                                if (expandedAnalysis.has(index)) {
                                  newExpanded.delete(index);
                                } else {
                                  newExpanded.add(index);
                                }
                                setExpandedAnalysis(newExpanded);
                              }}
                              className="text-purple-600 hover:text-purple-700 font-semibold mt-2 flex items-center gap-1"
                            >
                              {expandedAnalysis.has(index) ? (
                                <>
                                  <i className="ri-arrow-up-s-line"></i>
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <i className="ri-arrow-down-s-line"></i>
                                  Show More ({article.sentences.length - 1} more)
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions - Pushed to bottom */}
                    <div className="mt-auto">
                      <button
                        onClick={() => handleAnalyze(article)}
                        disabled={verifyLoading}
                        className="w-full py-2 sm:py-2.5 text-sm sm:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                      >
                        {verifyLoading && selectedArticle?.title === article.title ? (
                          <>
                            <i className="ri-loader-4-line animate-spin"></i>
                            <span className="text-xs sm:text-sm">Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <i className="ri-shield-check-line"></i>
                            <span className="text-xs sm:text-sm">Verify with AI</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p className="mb-2">No articles found for "{selectedCategory}"</p>
                <button
                  onClick={() => setSelectedCategory("Top Stories")}
                  className="text-purple-600 hover:underline"
                >
                  View Top Stories
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
