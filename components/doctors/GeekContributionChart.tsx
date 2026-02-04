"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ContributionData {
    category: string;
    value: number;
    growth: string;
    color: string;
}

interface Stats {
    total_gdp_contribution: string;
    total_employment: string;
    avg_salary: string;
    yoy_growth: string;
    export_revenue: string;
}

interface TopHub {
    city: string;
    percentage: number;
    workers: string;
}

export function GeekContributionChart() {
    const [data, setData] = useState<ContributionData[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [topHubs, setTopHubs] = useState<TopHub[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Set initial mobile state
        setIsMobile(window.innerWidth < 768);
        
        // Handle window resize
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        
        fetchData();
        // Auto-refresh every 20 minutes
        const interval = setInterval(fetchData, 1200000);
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:8002/salary/geek-worker-contribution");
            if (!response.ok) throw new Error("Failed to fetch data");
            const result = await response.json();
            setData(result.data);
            setStats(result.stats);
            setTopHubs(result.top_hubs);
            setLastUpdated(result.updated);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-bold text-gray-900 mb-1">{data.category}</p>
                    <p className="text-sm text-gray-700">Contribution: <span className="font-bold">{data.value}%</span></p>
                    <p className="text-xs text-green-600 font-semibold">Growth: {data.growth}</p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-black uppercase mb-6">Geek Worker Contribution to Economy</h3>
                <div className="h-[300px] md:h-[400px] flex items-center justify-center">
                    <div className="animate-pulse text-gray-400">Loading contribution data...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-black uppercase mb-6">Geek Worker Contribution to Economy</h3>
                <div className="h-[300px] md:h-[400px] flex items-center justify-center text-red-500">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-lg md:text-xl font-black uppercase mb-1">
                    Geek Worker Contribution to Economy
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                    Tech sector GDP contribution breakdown
                </p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-2.5 rounded-lg">
                        <div className="text-[9px] md:text-[10px] text-purple-700 font-semibold">GDP Contribution</div>
                        <div className="text-xs md:text-sm font-black text-purple-900">{stats.total_gdp_contribution}</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2.5 rounded-lg">
                        <div className="text-[9px] md:text-[10px] text-blue-700 font-semibold">Employment</div>
                        <div className="text-xs md:text-sm font-black text-blue-900">{stats.total_employment}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-2.5 rounded-lg">
                        <div className="text-[9px] md:text-[10px] text-green-700 font-semibold">YoY Growth</div>
                        <div className="text-xs md:text-sm font-black text-green-900">{stats.yoy_growth}</div>
                    </div>
                </div>
            )}

            {/* Chart */}
            <div className="w-full">
                <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}%`}
                            outerRadius={isMobile ? 70 : 95}
                            paddingAngle={3}
                            dataKey="value"
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(-1)}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    className="cursor-pointer transition-opacity"
                                    style={{ opacity: activeIndex === -1 || activeIndex === index ? 1 : 0.6 }}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Top Tech Hubs */}
            <div className="mt-4">
                <h4 className="text-xs font-bold text-gray-700 mb-2">Top Tech Hubs</h4>
                <div className="grid grid-cols-2 gap-2">
                    {topHubs.slice(0, 6).map((hub, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div>
                                <div className="text-[10px] md:text-xs font-bold text-gray-900">{hub.city}</div>
                                <div className="text-[9px] text-gray-600">{hub.workers}</div>
                            </div>
                            <div className="text-xs font-bold text-purple-600">{hub.percentage}%</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-gray-500">
                <span className="text-[10px] md:text-xs">Source: NASSCOM Tech Report 2024-25</span>
                {lastUpdated && (
                    <span className="text-[10px] md:text-xs text-purple-600 font-semibold">Updated: {lastUpdated}</span>
                )}
            </div>
        </div>
    );
}
