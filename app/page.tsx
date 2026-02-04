"use client";

import { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { InteractiveIndiaMap } from "@/components/maps/InteractiveIndiaMap";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type QuickStat = {
    title: string;
    value: string;
    delta: string;
    updated: string;
    color: string;
    badge: string;
    bars: number[];
};

const defaultQuickStats: QuickStat[] = [
    {
        title: "Total Population",
        value: "1.42B",
        delta: "+0.8%",
        updated: "Updated 20 min ago",
        color: "text-emerald-600",
        badge: "Up",
        bars: [45, 55, 50, 65, 70],
    },
    {
        title: "State-wise Population",
        value: "Uttar Pradesh",
        delta: "+1.2%",
        updated: "Updated 20 min ago",
        color: "text-emerald-600",
        badge: "Top",
        bars: [30, 38, 40, 50, 58],
    },
    {
        title: "Unemployed Population",
        value: "25M",
        delta: "-0.5%",
        updated: "Updated 20 min ago",
        color: "text-red-600",
        badge: "Down",
        bars: [60, 55, 52, 50, 48],
    },
    {
        title: "Youth Unemployment",
        value: "15.3%",
        delta: "-0.2%",
        updated: "Updated 20 min ago",
        color: "text-red-600",
        badge: "Down",
        bars: [58, 52, 50, 48, 46],
    },
];

const mockHeroNews = [
    {
        title: "India's GDP Growth Surges to 8.2% in Q4 2025",
        summary: "Economic expansion driven by manufacturing sector and digital transformation initiatives. Exports reach all-time high.",
        source: "Economic Survey 2026",
        overall_label: "REAL",
        published: "2 hours ago",
        image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop"
    },
    {
        title: "New Education Policy Shows 95% School Enrollment",
        summary: "Digital learning platforms and infrastructure improvements lead to historic enrollment rates across rural India.",
        source: "Ministry of Education",
        overall_label: "REAL",
        published: "5 hours ago",
        image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop"
    },
    {
        title: "Renewable Energy Capacity Reaches 200 GW Milestone",
        summary: "India achieves ambitious clean energy targets ahead of schedule. Solar and wind power lead the growth.",
        source: "Ministry of Power",
        overall_label: "REAL",
        published: "8 hours ago",
        image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=600&fit=crop"
    },
    {
        title: "Healthcare Infrastructure Expansion in Rural Areas",
        summary: "Government launches 10,000 new primary health centers. Telemedicine services reach remote villages.",
        source: "Health Ministry",
        overall_label: "REAL",
        published: "12 hours ago",
        image_url: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&h=600&fit=crop"
    }
];

const mockTrendingNews = [
    {
        title: "India's GDP Growth Surges to 8.2% in Q4 2025",
        summary: "Economic expansion driven by manufacturing sector and digital transformation initiatives. Exports reach all-time high.",
        source: "Economic Survey 2026",
        overall_label: "REAL",
        published: "2 hours ago"
    },
    {
        title: "New Education Policy Shows 95% School Enrollment",
        summary: "Digital learning platforms and infrastructure improvements lead to historic enrollment rates across rural India.",
        source: "Ministry of Education",
        overall_label: "REAL",
        published: "5 hours ago"
    }
];

// Helper function to parse population strings like "1.42B" to numbers
function parsePopulationString(popStr: string): number {
    const multipliers: Record<string, number> = {
        'B': 1000000000,
        'M': 1000000,
        'K': 1000
    };
    
    const match = popStr.match(/^([\d.]+)([BMK]?)$/i);
    if (!match) return 1420000000; // fallback
    
    const value = parseFloat(match[1]);
    const suffix = match[2].toUpperCase();
    return value * (multipliers[suffix] || 1);
}

// Helper function to format population number to display string
function formatPopulation(num: number): string {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2) + 'B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    }
    return num.toLocaleString('en-IN');
}

export default function HomePage() {
    const [mapLayer, setMapLayer] = useState<'default' | 'poverty' | 'climate'>('default');
    const [quickStats, setQuickStats] = useState<QuickStat[]>(defaultQuickStats);
    const [heroNews, setHeroNews] = useState<any[]>(mockHeroNews);
    const [trendingNews, setTrendingNews] = useState<any[]>(mockTrendingNews);
    const [socialPosts, setSocialPosts] = useState<any[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
    const [livePopulation, setLivePopulation] = useState<number>(1420000000); // 1.42 billion initial

    // Fetch news from News Checker API
    useEffect(() => {
        const fetchHeroNews = async () => {
            try {
                const res = await fetch("/api/news");
                if (!res.ok) {
                    // Silently fail and use mock data
                    return;
                }
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setHeroNews(data.slice(0, 5)); // Limit to 5 news items for carousel
                    setTrendingNews(data.slice(0, 2)); // First 2 for trending section
                }
            } catch (err) {
                // Silently fail and use mock data - backend not running
            }
        };

        // Initial fetch
        fetchHeroNews();

        // Auto-refresh every 20 minutes (same as News Checker)
        const refreshInterval = setInterval(fetchHeroNews, 20 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, []);

    // Fetch social posts
    useEffect(() => {
        const fetchSocialPosts = async () => {
            try {
                const res = await fetch("/api/posts?limit=2");
                if (!res.ok) return;
                const data = await res.json();
                if (data?.posts && Array.isArray(data.posts)) {
                    setSocialPosts(data.posts.slice(0, 2));
                }
            } catch (err) {
                // Silently fail - posts already seeded
            }
        };

        // Initial fetch
        fetchSocialPosts();

        // Auto-refresh every 20 minutes
        const refreshInterval = setInterval(fetchSocialPosts, 20 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, []);

    // Auto-play carousel
    useEffect(() => {
        if (!isAutoPlaying || heroNews.length === 0) return;

        const totalSlides = Math.min(heroNews.length, 4) + 1; // Max 5 slides (1 intro + 4 news)
        autoPlayRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 5000); // Change slide every 5 seconds

        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [isAutoPlaying, heroNews.length]);

    const nextSlide = () => {
        const totalSlides = Math.min(heroNews.length, 4) + 1; // Max 5 slides (1 intro + 4 news)
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        const totalSlides = Math.min(heroNews.length, 4) + 1; // Max 5 slides (1 intro + 4 news)
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
        setIsAutoPlaying(false);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await fetch("/api/quick-stats");
                if (!res.ok) return;
                const data = await res.json();
                if (!data?.stats) return;

                setQuickStats((prev) => {
                    const mapped = [...prev];
                    if (data.stats.totalPopulation) {
                        mapped[0] = {
                            ...mapped[0],
                            value: data.stats.totalPopulation.value,
                            delta: data.stats.totalPopulation.delta ?? mapped[0].delta,
                            updated: data.stats.updatedAt,
                        };
                    }
                    if (data.stats.stateLeader) {
                        mapped[1] = {
                            ...mapped[1],
                            value: data.stats.stateLeader.state ?? mapped[1].value,
                            delta: data.stats.stateLeader.delta ?? mapped[1].delta,
                            updated: data.stats.updatedAt,
                        };
                    }
                    if (data.stats.unemployment) {
                        mapped[2] = {
                            ...mapped[2],
                            value: data.stats.unemployment.value,
                            delta: data.stats.unemployment.delta ?? mapped[2].delta,
                            updated: data.stats.updatedAt,
                        };
                    }
                    if (data.stats.youthUnemployment) {
                        mapped[3] = {
                            ...mapped[3],
                            value: data.stats.youthUnemployment.value,
                            delta: data.stats.youthUnemployment.delta ?? mapped[3].delta,
                            updated: data.stats.updatedAt,
                        };
                    }
                    return mapped;
                });
            } catch (err) {
                console.error("quick stats fetch error", err);
            }
        };

        loadStats();
        
        // Auto-refresh Quick Stats every 5 minutes
        const statsInterval = setInterval(() => {
            loadStats();
        }, 5 * 60 * 1000);

        return () => clearInterval(statsInterval);
    }, []);

    // Population Clock - Real-time ticking counter
    useEffect(() => {
        const initPopulationClock = async () => {
            try {
                // Fetch initial population and growth rate from API
                const res = await fetch("/api/quick-stats");
                if (!res.ok) return;
                const data = await res.json();
                
                // Extract base population (e.g., "1.42B" → 1420000000)
                const popValue = data?.stats?.totalPopulation?.value || "1.42B";
                const basePopulation = parsePopulationString(popValue);
                
                // Extract annual growth rate (e.g., "+0.8%" → 0.008)
                const deltaValue = data?.stats?.totalPopulation?.delta || "+0.8%";
                const growthRate = parseFloat(deltaValue.replace(/[+%]/g, '')) / 100;
                
                // Calculate increase per millisecond
                // Annual growth: basePopulation * growthRate
                // Per millisecond: (annual growth) / (365.25 days * 24 hours * 60 min * 60 sec * 1000 ms)
                const annualIncrease = basePopulation * growthRate;
                const increasePerMs = annualIncrease / (365.25 * 24 * 60 * 60 * 1000);
                
                // Sync with current time (assuming data is from start of year)
                const now = new Date();
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                const msElapsed = now.getTime() - startOfYear.getTime();
                const currentPopulation = basePopulation + (increasePerMs * msElapsed);
                
                setLivePopulation(currentPopulation);
                
                // Update counter every 100ms
                const clockInterval = setInterval(() => {
                    setLivePopulation(prev => prev + (increasePerMs * 100));
                }, 100);
                
                return () => clearInterval(clockInterval);
            } catch (err) {
                console.error("Population clock error:", err);
            }
        };
        
        const cleanup = initPopulationClock();
        return () => {
            cleanup.then(fn => fn && fn());
        };
    }, []);

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">

                {/* Hero Carousel - Fixed Static Size */}
                <div className="card p-0 bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-900 border-none text-white shadow-xl relative overflow-hidden h-[420px] sm:h-[380px] md:h-[340px] lg:h-[360px]">
                    {/* Background Image with Higher Visibility */}
                    {currentSlide > 0 && heroNews.length > 0 && heroNews[currentSlide - 1]?.image_url && (
                        <>
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                                style={{ 
                                    backgroundImage: `url(${heroNews[currentSlide - 1].image_url})`,
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/75 via-purple-800/70 to-indigo-900/75" />
                        </>
                    )}
                    
                    <div className="relative z-10 h-full flex flex-col">
                        {/* Content Area */}
                        <div className="flex-1 flex items-center px-4 sm:px-6 md:px-8 lg:px-10 pt-5 pb-3">
                            <div className="w-full max-w-full">
                                {/* First Slide - Welcome/Intro */}
                                <div
                                    className={`transition-all duration-700 ${
                                        currentSlide === 0
                                            ? "opacity-100 translate-x-0"
                                            : "opacity-0 absolute inset-0 pointer-events-none"
                                    }`}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-5">
                                        {/* Left Content */}
                                        <div className="flex-1 space-y-2 md:space-y-3">
                                            <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-tight drop-shadow-2xl">
                                                ZINTEL - The Nation in Live Data
                                            </h1>
                                            <p className="text-sm sm:text-base md:text-base lg:text-lg text-purple-100 font-bold drop-shadow-lg">
                                                Gen-Z's Unfiltered News & Facts
                                            </p>
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                <Link href="/explore">
                                                    <button className="btn bg-white text-purple-800 font-bold shadow-lg hover:shadow-xl px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base transition-all hover:scale-105">
                                                        Explore Live Data
                                                    </button>
                                                </Link>
                                                <Link href="/podcasts">
                                                    <button className="btn bg-purple-50 text-purple-900 font-bold shadow-lg hover:shadow-xl px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base transition-all hover:scale-105">
                                                        Listen to Today's Facts
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                        
                                        {/* Right Card - Welcome Message */}
                                        <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-3 md:p-4 lg:p-5 max-w-full lg:max-w-sm border-2 border-purple-200">
                                            <h3 className="text-base sm:text-lg md:text-xl font-black text-gray-900 mb-1.5">
                                                Welcome to Zintel! 👋
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                                Your trusted source for real-time data insights and AI-verified news.
                                            </p>
                                            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                                                <span className="text-xs font-bold text-purple-600">
                                                    🚀 Live Data Platform
                                                </span>
                                                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-blue-500 text-white shadow-md">
                                                    Live
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* News Slides 2-5 */}
                                {heroNews.slice(0, 4).map((news, index) => (
                                    <div
                                        key={index}
                                        className={`transition-all duration-700 ${
                                            currentSlide === index + 1
                                                ? "opacity-100 translate-x-0"
                                                : "opacity-0 absolute inset-0 pointer-events-none"
                                        }`}
                                    >
                                        <Link href="/engagement" className="block">
                                            <div className="flex flex-col justify-center">
                                                <div className="space-y-2 md:space-y-3 max-w-5xl">
                                                    {/* Verification Badge */}
                                                    <div className="inline-block">
                                                        <span className={`text-xs sm:text-sm font-black px-3 py-1 rounded-full shadow-lg ${
                                                            news.overall_label === "REAL"
                                                                ? "bg-green-500 text-white"
                                                                : news.overall_label === "FAKE"
                                                                ? "bg-red-500 text-white"
                                                                : "bg-gray-500 text-white"
                                                        }`}>
                                                            {news.overall_label || "VERIFIED"}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* News Headline */}
                                                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-black text-white leading-tight drop-shadow-2xl hover:text-purple-200 transition-colors line-clamp-2">
                                                        {news.title}
                                                    </h2>
                                                    
                                                    {/* News Summary */}
                                                    <p className="text-xs sm:text-sm md:text-base text-purple-50 font-semibold drop-shadow-lg line-clamp-2 leading-relaxed">
                                                        {news.summary || "Stay informed with real-time insights from verified sources."}
                                                    </p>
                                                    
                                                    {/* Source & Action */}
                                                    <div className="flex items-center gap-2 sm:gap-3 pt-1 flex-wrap">
                                                        <span className="text-xs sm:text-sm text-white font-bold bg-purple-600/80 px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                                                            📰 {news.source || "News Checker"}
                                                        </span>
                                                        <button className="btn bg-white text-purple-800 font-bold shadow-lg hover:shadow-xl px-3 sm:px-4 py-1 text-xs sm:text-sm transition-all hover:scale-105">
                                                            Read Full Story →
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Controls - Fixed Bottom */}
                        <div className="px-4 sm:px-6 md:px-8 lg:px-10 pb-4">
                            <div className="flex items-center justify-between border-t border-white/10 pt-3">
                                {/* Prev/Next Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={prevSlide}
                                        className="p-2 rounded-full bg-white/90 hover:bg-white text-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-110"
                                        aria-label="Previous slide"
                                    >
                                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="p-2 rounded-full bg-white/90 hover:bg-white text-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-110"
                                        aria-label="Next slide"
                                    >
                                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>

                                {/* Dots Indicator */}
                                <div className="flex gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                                    {[0, ...heroNews.slice(0, 4).map((_, i) => i + 1)].map((index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToSlide(index)}
                                            className={`h-2 rounded-full transition-all ${
                                                index === currentSlide
                                                    ? "bg-white w-6 shadow-lg"
                                                    : "bg-white/50 hover:bg-white/70 w-2"
                                            }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="card bg-white border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Live Quick Stats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        {quickStats.slice(0, 4).map((stat, index) => (
                            <QuickStatCard 
                                key={stat.title} 
                                stat={stat} 
                                liveValue={index === 0 ? livePopulation : undefined}
                            />
                        ))}
                    </div>
                </div>

                {/* Map + Trending Split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    {/* Map Area */}
                    <div className="map-section card relative h-full min-h-[560px]">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                            <div>
                                <h2 className="section-title mb-0">Interactive India Data Map</h2>
                                <p className="text-sm text-gray-500">Explore comprehensive state-level metrics</p>
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-lg self-start md:self-auto">
                                <button
                                    onClick={() => setMapLayer('default')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${mapLayer === 'default'
                                        ? 'bg-white text-green-700 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    Standard
                                </button>
                                <button
                                    onClick={() => setMapLayer('poverty')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${mapLayer === 'poverty'
                                        ? 'bg-red-50 text-red-600 shadow-sm border border-red-100'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    Poverty Heat Map
                                </button>
                                <button
                                    onClick={() => setMapLayer('climate')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${mapLayer === 'climate'
                                        ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    Climate Risk
                                </button>
                            </div>
                        </div>

                        <div className="h-[420px] md:h-[620px] w-full">
                            <InteractiveIndiaMap layer={mapLayer} />
                        </div>
                    </div>

                    {/* Trending + Premium */}
                    <div className="flex flex-col gap-4 h-full">
                        <div className="card flex-1 bg-gradient-to-br from-purple-50 via-white to-blue-50 border-2 border-purple-100">
                            <div className="flex justify-between items-center mb-5">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></div>
                                    <h3 className="font-bold text-xl text-gray-900">Trending Insights</h3>
                                    <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">Live</span>
                                </div>
                                <Link href="/engagement">
                                    <button className="px-3 py-1.5 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all">View All</button>
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {trendingNews.length > 0 ? (
                                    trendingNews.map((news, i) => (
                                        <Link key={i} href="/engagement">
                                            <div className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer group overflow-hidden ${
                                                news.overall_label === "REAL" 
                                                ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-400 hover:shadow-lg" 
                                                : news.overall_label === "FAKE" 
                                                ? "bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:border-red-400 hover:shadow-lg" 
                                                : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200 hover:border-purple-300 hover:shadow-lg"
                                            }`}>
                                                {/* Animated background accent */}
                                                <div className={`absolute top-0 left-0 w-1 h-full transition-all group-hover:w-2 ${
                                                    news.overall_label === "REAL" ? "bg-gradient-to-b from-green-500 to-emerald-600" : 
                                                    news.overall_label === "FAKE" ? "bg-gradient-to-b from-red-500 to-rose-600" : 
                                                    "bg-gradient-to-b from-purple-500 to-blue-600"
                                                }`}></div>
                                                
                                                <div className="ml-3">
                                                    {/* Verification Badge */}
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-bold shadow-sm ${
                                                            news.overall_label === "REAL" ? "bg-green-500 text-white" : 
                                                            news.overall_label === "FAKE" ? "bg-red-500 text-white" : 
                                                            "bg-purple-500 text-white"
                                                        }`}>
                                                            {news.overall_label === "REAL" ? "✓" : news.overall_label === "FAKE" ? "✕" : "●"}
                                                            {news.overall_label || "News"}
                                                        </span>
                                                        <span className="text-xs text-gray-500 font-medium">{news.source || "News Checker"}</span>
                                                    </div>
                                                    
                                                    {/* Headline */}
                                                    <h4 className="font-bold text-base text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-2 leading-tight mb-2">
                                                        {news.title}
                                                    </h4>
                                                    
                                                    {/* Summary */}
                                                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                                                        {news.summary || "Stay informed with real-time insights from verified sources."}
                                                    </p>
                                                    
                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-400 font-medium">{news.published || "Just now"}</span>
                                                        <span className="text-xs font-semibold text-purple-600 group-hover:text-purple-700 flex items-center gap-1">
                                                            Read More
                                                            <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    // Fallback content while loading
                                    [1, 2].map((i) => (
                                        <div key={i} className="relative p-4 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50 animate-pulse">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-300 to-blue-300"></div>
                                            <div className="ml-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                                                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                                </div>
                                                <div className="h-5 bg-gray-200 rounded mb-2 w-full"></div>
                                                <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Social Posts Section */}
                        <div className="card bg-gradient-to-br from-blue-50 via-white to-cyan-50 border-2 border-blue-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-7 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                                    <h3 className="font-bold text-lg text-gray-900">Social Feed</h3>
                                    <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">Live</span>
                                </div>
                                <Link href="/social">
                                    <button className="px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-md hover:scale-105 transition-all">View All</button>
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {socialPosts.length > 0 ? (
                                    socialPosts.map((post, index) => (
                                        <Link key={post.id || index} href="/social">
                                            <div className="p-3 rounded-xl border-2 border-blue-100 bg-white hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                                                        {post.author?.name?.charAt(0) || "U"}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-bold text-sm text-gray-900 truncate">
                                                                {post.author?.name || "User"}
                                                            </h4>
                                                            {post.author?.truthIdVerified && (
                                                                <span className="text-blue-500 text-xs" title="Verified">✓</span>
                                                            )}
                                                            <span className="text-xs text-gray-400">•</span>
                                                            <span className="text-xs text-gray-400">{post.postType || "Social"}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-700 line-clamp-2 mb-2 leading-relaxed">
                                                            {post.content}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs">
                                                            <span className="flex items-center gap-1 text-blue-600 font-medium">
                                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                                                </svg>
                                                                {post._count?.likes || 0}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-gray-600 font-medium">
                                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                                                </svg>
                                                                {post._count?.comments || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    // Loading state or no posts
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 mb-3">
                                            <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-600 font-semibold mb-1">No posts yet</p>
                                        <p className="text-sm text-gray-400">Social posts will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function QuickStatCard({ stat, liveValue }: { stat: QuickStat; liveValue?: number }) {
    const isPositive = stat.delta.startsWith("+");
    const displayValue = liveValue !== undefined ? formatPopulation(liveValue) : stat.value;
    
    return (
        <div className="card h-full">
            <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
            <div className="mt-2 flex items-start gap-3">
                <p className="text-3xl font-bold text-gray-900">{displayValue}</p>
                <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                >
                    {stat.delta}
                </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{stat.updated}</p>
            <div className="mt-3">
                <Sparkline bars={stat.bars} color={isPositive ? '#10b981' : '#ef4444'} />
            </div>
        </div>
    );
}

function Sparkline({ bars, color }: { bars: number[]; color: string }) {
    return (
        <div className="flex items-end gap-1 h-16">
            {bars.map((h, idx) => (
                <div
                    key={idx}
                    className="w-6 rounded-sm"
                    style={{
                        height: `${h}%`,
                        maxHeight: "64px",
                        background: `linear-gradient(180deg, ${color} 0%, ${color}CC 60%, ${color}99 100%)`,
                    }}
                />
            ))}
        </div>
    );
}
