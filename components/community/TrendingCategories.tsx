"use client";

import { useEffect, useState } from "react";

interface TrendingCategory {
    category: string;
    count: number;
}

export function TrendingCategories() {
    const [categories, setCategories] = useState<TrendingCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/moderation/summary");
            const data = await response.json();
            setCategories(data.trendingCategories || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryName = (type: string) => {
        const names: { [key: string]: string } = {
            FAKE_NEWS: "Political Disinformation",
            MISLEADING_IMAGE: "Misleading Health Claims",
            ABUSIVE_CONTENT: "Abusive Language",
        };
        return names[type] || type.replace(/_/g, " ");
    };

    if (loading) {
        return (
            <div className="card p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card p-6">
            <h2 className="text-2xl font-bold mb-2">Trending Reported Categories</h2>
            <p className="text-gray-600 mb-6">Top issues reported by the community recently.</p>

            {categories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <i className="ri-bar-chart-line text-4xl mb-2 block"></i>
                    <p>No trending data available yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>
                                <span className="font-medium text-gray-900">{getCategoryName(category.category)}</span>
                            </div>
                            <span className="text-sm font-semibold text-purple-600">{category.count} reports</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
