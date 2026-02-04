"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Link from "next/link";
import { useState, useMemo } from "react";

export default function ExploreDataPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");

    const dataCategories = [
        {
            title: "Population & Migration",
            description: "Detailed demographic insights and migration patterns.",
            icon: "ri-team-line",
            link: "/population",
            gradient: "from-blue-500 to-cyan-500",
            lastUpdated: "2026-02-01",
            trending: true,
            saved: false
        },
        {
            title: "Citizen Economy",
            description: "Employment, income distribution, and poverty metrics.",
            icon: "ri-money-dollar-circle-line",
            link: "/economy",
            gradient: "from-green-500 to-emerald-600",
            lastUpdated: "2026-01-28",
            trending: true,
            saved: true
        },
        {
            title: "Media Truth & Verification",
            description: "Tracking news veracity and media ownership trends.",
            icon: "ri-shield-check-line",
            link: "/media",
            gradient: "from-purple-500 to-pink-600",
            lastUpdated: "2026-02-02",
            trending: false,
            saved: true
        },
        {
            title: "Environment & Climate",
            description: "AQI, water scarcity, and climate risk assessments.",
            icon: "ri-leaf-line",
            link: "/environment",
            gradient: "from-green-600 to-teal-500",
            lastUpdated: "2026-02-02",
            trending: true,
            saved: false
        },
        {
            title: "Government & Finance",
            description: "Budget allocation, taxation, and public expenditure analysis.",
            icon: "ri-government-line",
            link: "/government",
            gradient: "from-indigo-500 to-blue-600",
            lastUpdated: "2026-01-25",
            trending: false,
            saved: true
        },
        {
            title: "Export-Import & Industry",
            description: "Trade statistics, industrial output, and economic corridors.",
            icon: "ri-ship-line",
            link: "/export",
            gradient: "from-orange-500 to-red-500",
            lastUpdated: "2026-01-30",
            trending: true,
            saved: false
        },
        {
            title: "Doctors, Salaries & Workers",
            description: "Healthcare workforce, wage trends, and employment data.",
            icon: "ri-stethoscope-line",
            link: "/doctors",
            gradient: "from-pink-500 to-rose-600",
            lastUpdated: "2026-01-20",
            trending: false,
            saved: false
        },
        {
            title: "Live Social & Community",
            description: "Real-time social trends, community discussions, and engagement.",
            icon: "ri-message-3-line",
            link: "/social",
            gradient: "from-violet-500 to-purple-600",
            lastUpdated: "2026-02-02",
            trending: true,
            saved: true
        },
        {
            title: "Disclaimer",
            description: "Terms of use, data sources, and transparency information.",
            icon: "ri-information-line",
            link: "/disclaimer",
            gradient: "from-gray-500 to-slate-600",
            lastUpdated: "2026-01-15",
            trending: false,
            saved: false
        },
    ];

    // Filter and search logic
    const filteredCategories = useMemo(() => {
        let filtered = dataCategories;

        // Apply filter
        if (selectedFilter === "recent") {
            const recentDate = new Date("2026-01-30");
            filtered = filtered.filter(cat => new Date(cat.lastUpdated) >= recentDate);
        } else if (selectedFilter === "trending") {
            filtered = filtered.filter(cat => cat.trending);
        } else if (selectedFilter === "saved") {
            filtered = filtered.filter(cat => cat.saved);
        }

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(cat => 
                cat.title.toLowerCase().includes(query) || 
                cat.description.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [searchQuery, selectedFilter]);

    return (
        <DashboardLayout>
            <div className="container mx-auto px-6 py-8 max-w-7xl">
                {/* Page Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Explore Facts</h1>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
                        <input
                            type="text"
                            placeholder="Search for data, reports, or topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex gap-3 mb-8 flex-wrap">
                    <button 
                        onClick={() => setSelectedFilter("all")}
                        className={`px-4 py-2 rounded-lg transition ${selectedFilter === "all" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        All Categories
                    </button>
                    <button 
                        onClick={() => setSelectedFilter("recent")}
                        className={`px-4 py-2 rounded-lg transition ${selectedFilter === "recent" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Recent Updates
                    </button>
                    <button 
                        onClick={() => setSelectedFilter("trending")}
                        className={`px-4 py-2 rounded-lg transition ${selectedFilter === "trending" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Trending Data
                    </button>
                    <button 
                        onClick={() => setSelectedFilter("saved")}
                        className={`px-4 py-2 rounded-lg transition ${selectedFilter === "saved" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        My Saved Reports
                    </button>
                </div>

                {/* Results Count */}
                {(searchQuery || selectedFilter !== "all") && (
                    <div className="mb-4 text-sm text-gray-600">
                        Showing {filteredCategories.length} of {dataCategories.length} categories
                    </div>
                )}

                {/* Data Category Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((category, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative"
                            >
                                {/* Trending Badge - Absolutely Positioned */}
                                {category.trending && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-full font-semibold shadow-sm">
                                            🔥 Trending
                                        </span>
                                    </div>
                                )}
                                
                                {/* Card Header */}
                                <div className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <i className={`${category.icon} text-2xl text-purple-600`}></i>
                                        </div>
                                        <div className="flex-1 pr-20">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                {category.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">{category.description}</p>
                                        </div>
                                    </div>

                                    {/* Card Image with High Contrast Gradient */}
                                    <div className={`w-full h-40 bg-gradient-to-br ${category.gradient} rounded-lg mb-4 flex items-center justify-center shadow-lg`}>
                                        <i className={`${category.icon} text-7xl text-white opacity-90`}></i>
                                    </div>

                                    {/* View Dashboard Button */}
                                    <Link
                                        href={category.link}
                                        className="block w-full text-center py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <i className="ri-search-line text-6xl text-gray-300 mb-4"></i>
                            <p className="text-gray-600 text-lg">No categories found matching your search.</p>
                            <button 
                                onClick={() => { setSearchQuery(""); setSelectedFilter("all"); }}
                                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom Navigation (Optional) */}
                <div className="mt-12 flex items-center justify-center gap-8 py-6 border-t border-gray-200">
                    <button className="flex flex-col items-center gap-2 text-gray-600 hover:text-purple-600 transition">
                        <i className="ri-bar-chart-line text-2xl"></i>
                        <span className="text-sm">Explore Data</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 text-gray-600 hover:text-purple-600 transition">
                        <i className="ri-discuss-line text-2xl"></i>
                        <span className="text-sm">Debate</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 text-gray-600 hover:text-purple-600 transition">
                        <i className="ri-broadcast-line text-2xl"></i>
                        <span className="text-sm">Polls</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 text-gray-600 hover:text-purple-600 transition">
                        <i className="ri-user-line text-2xl"></i>
                        <span className="text-sm">My Feed</span>
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
