"use client";

import { useEffect, useState } from "react";

interface ModerationStats {
    totalReports: number;
    resolvedThisWeek: number;
    activeModerators: number;
}

export function ModerationOverview() {
    const [stats, setStats] = useState<ModerationStats>({
        totalReports: 0,
        resolvedThisWeek: 0,
        activeModerators: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch("/api/moderation/summary");
            const data = await response.json();
            setStats({
                totalReports: data.totalReports || 0,
                resolvedThisWeek: data.resolvedThisWeek || 0,
                activeModerators: data.activeModerators || 0,
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            icon: "ri-shield-check-line",
            label: "Total Reports",
            value: stats.totalReports.toLocaleString(),
            color: "text-purple-600 bg-purple-50",
        },
        {
            icon: "ri-checkbox-circle-line",
            label: "Resolved This Week",
            value: stats.resolvedThisWeek.toLocaleString(),
            color: "text-green-600 bg-green-50",
        },
        {
            icon: "ri-user-star-line",
            label: "Active Moderators",
            value: stats.activeModerators.toLocaleString(),
            color: "text-blue-600 bg-blue-50",
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card p-6 animate-pulse">
                        <div className="h-12 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Community Moderation Overview</h2>
            <p className="text-gray-600 mb-6">Key metrics on platform moderation activity.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statCards.map((card, index) => (
                    <div key={index} className="card p-6">
                        <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center mb-4`}>
                            <i className={`${card.icon} text-2xl`}></i>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
                        <div className="text-sm text-gray-600">{card.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
