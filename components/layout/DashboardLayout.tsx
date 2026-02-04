"use client";

import Link from "next/link";
import { Sidebar } from "./Sidebar";
import { MobileNavigation } from "./MobileNavigation";
import { PostModal } from "./PostModal";
import { UserMenu } from "./UserMenu";
import { useState, useEffect, useRef } from "react";
import { Plus, AlertTriangle, MoreVertical } from "lucide-react";
import { ReportModal } from "@/components/ui/ReportModal";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [newsArticles, setNewsArticles] = useState<any[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);

    // Fetch news articles for search
    useEffect(() => {
        const abortController = new AbortController();
        
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/news', {
                    signal: abortController.signal
                });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setNewsArticles(data);
                    }
                }
            } catch (error) {
                // Ignore abort errors
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error("Failed to fetch news for search");
                }
            }
        };
        fetchNews();
        
        // Cleanup: abort fetch if component unmounts
        return () => {
            abortController.abort();
        };
    }, []);

    // Sample data for search - in production, this would come from APIs
    const searchData = {
        categories: [
            { title: "Population & Migration", link: "/population", type: "category" },
            { title: "Citizen Economy", link: "/economy", type: "category" },
            { title: "Environment & Climate", link: "/environment", type: "category" },
            { title: "Government & Finance", link: "/government", type: "category" },
            { title: "Export-Import & Industry", link: "/export", type: "category" },
            { title: "Doctors, Salaries & Workers", link: "/doctors", type: "category" },
            { title: "Media Truth & Verification", link: "/media", type: "category" },
            { title: "Live Social & Community", link: "/social", type: "category" },
        ],
        users: [
            { name: "John Doe", username: "@johndoe", link: "/profile/john-doe", type: "user" },
            { name: "Jane Smith", username: "@janesmith", link: "/profile/jane-smith", type: "user" },
            { name: "Alex Kumar", username: "@alexk", link: "/profile/alex-kumar", type: "user" },
            { name: "Priya Singh", username: "@priyasingh", link: "/profile/priya-singh", type: "user" },
            { name: "Rahul Sharma", username: "@rahul_s", link: "/profile/rahul-sharma", type: "user" },
        ]
    };

    // Search handler
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const results: any[] = [];

        // Search users FIRST (prioritize)
        searchData.users.forEach(user => {
            const matchName = user.name.toLowerCase().includes(query);
            const matchUsername = user.username.toLowerCase().includes(query);
            
            if (matchName || matchUsername) {
                results.push(user);
            }
        });

        // Search categories
        searchData.categories.forEach(cat => {
            if (cat.title.toLowerCase().includes(query)) {
                results.push(cat);
            }
        });

        // Search news articles from News Checker
        newsArticles.forEach(news => {
            const matchTitle = news.title?.toLowerCase().includes(query);
            const matchSummary = news.summary?.toLowerCase().includes(query);
            const matchSource = news.source?.toLowerCase().includes(query);
            
            if (matchTitle || matchSummary || matchSource) {
                results.push({
                    title: news.title,
                    source: news.source || "Unknown",
                    link: "/engagement",
                    type: "news"
                });
            }
        });

        console.log("Search query:", query);
        console.log("Search results:", results);
        
        setSearchResults(results.slice(0, 15)); // Increased to 15 results
        setShowResults(true);
    }, [searchQuery, newsArticles]);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="app-container flex">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="main-content">
                {/* Header */}
                <header className="header flex items-center justify-between">
                    <div className="header-left flex items-center gap-4">
                        {/* Three-dot menu button for sidebar */}
                        <button
                            className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Open menu"
                        >
                            <MoreVertical className="w-6 h-6 text-gray-700" />
                        </button>
                        
                        {/* Z Logo */}
                        <Link href="/" className="flex items-center justify-center hover:opacity-80 transition-opacity">
                            <img src="/Zintal%20logo%20Z%20without%20Background.png" alt="Zintel Logo" className="h-8 w-auto object-contain" />
                        </Link>
                        
                        {/* Desktop Navigation */}
                        <div className="top-nav hidden lg:flex items-center gap-4 text-sm text-muted">
                            <Link href="/explore">Explore Facts</Link>
                            <Link href="/engagement">News Checker</Link>
                            <Link href="/podcasts">Podcasts</Link>
                            <Link href="/compare">Data Compare</Link>
                            <Link href="/community">Community</Link>
                        </div>
                    </div>

                    <div className="header-right flex items-center gap-4">
                        <div className="search-bar relative" ref={searchRef}>
                            <i className="ri-search-line"></i>
                            <input 
                                type="text" 
                                placeholder="Search news, facts, users..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery && setShowResults(true)}
                            />
                            
                            {/* Search Results Dropdown */}
                            {showResults && searchResults.length > 0 && (
                                <div className="absolute top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                                    {searchResults.map((result, index) => (
                                        <Link
                                            key={index}
                                            href={result.link}
                                            onClick={() => { setShowResults(false); setSearchQuery(""); }}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                        >
                                            {result.type === "category" && (
                                                <>
                                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <i className="ri-folder-line text-purple-600"></i>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-gray-900">{result.title}</p>
                                                        <p className="text-xs text-gray-500">Data Category</p>
                                                    </div>
                                                </>
                                            )}
                                            {result.type === "news" && (
                                                <>
                                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                                        <i className="ri-newspaper-line text-red-600"></i>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-gray-900">{result.title}</p>
                                                        <p className="text-xs text-gray-500">News • {result.source}</p>
                                                    </div>
                                                </>
                                            )}
                                            {result.type === "user" && (
                                                <>
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <i className="ri-user-line text-blue-600"></i>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-gray-900">{result.name}</p>
                                                        <p className="text-xs text-gray-500">{result.username}</p>
                                                    </div>
                                                </>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}
                            
                            {/* No Results */}
                            {showResults && searchQuery && searchResults.length === 0 && (
                                <div className="absolute top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 p-6 z-50 text-center">
                                    <i className="ri-search-line text-4xl text-gray-300 mb-2"></i>
                                    <p className="text-gray-600 text-sm">No results found for "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                        <button className="btn-icon">
                            <i className="ri-notification-3-line"></i>
                        </button>

                        {/* Post Button */}
                        <button
                            onClick={() => setIsPostModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-zintel-purple-dark text-white rounded-lg font-medium hover:bg-purple-800 transition-colors"
                            style={{ backgroundColor: '#2e008b' }}
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden sm:inline">Post</span>
                        </button>

                        {/* User Menu - Dynamic Auth State */}
                        <UserMenu />
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="dashboard-content container px-4 md:px-6">
                    {children}
                </div>

                <footer className="footer mt-6 text-center text-muted text-sm pb-4 flex flex-col items-center gap-2">
                    <p>© 2025 Zintel. All rights reserved.</p>
                    <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-600 transition-colors"
                    >
                        <AlertTriangle className="w-3 h-3" />
                        Report Content / Respectful Language Policy
                    </button>
                </footer>
            </main>

            {/* Mobile Navigation */}
            <MobileNavigation />

            {/* Post Modal */}
            <PostModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onPostCreated={() => {
                    // Optionally refresh feed or show success message
                    console.log("Post created successfully!");
                }}
            />

            {/* Global Report Modal */}
            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
            />
        </div>
    );
}
