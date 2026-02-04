"use client";

import { useEffect, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell, LabelList } from "recharts";

interface FundingData {
    category: string;
    count: number;
    amount: number;
    color: string;
}

interface FundingStats {
    total_funding: string;
    total_deals: string;
    avg_deal_size: string;
}

export function StartupFundingChart() {
    const [data, setData] = useState<FundingData[]>([]);
    const [stats, setStats] = useState<FundingStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detect mobile on mount
        setIsMobile(window.innerWidth < 768);
        
        // Add resize listener
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        
        fetchData();
        
        // Auto-refresh every 20 minutes
        const refreshInterval = setInterval(() => {
            fetchData();
        }, 20 * 60 * 1000);

        return () => {
            clearInterval(refreshInterval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:8002/export/startup-funding");
            const result = await response.json();
            if (result.data) {
                setData(result.data);
            }
            if (result.stats) {
                setStats(result.stats);
            }
            if (result.updated) {
                setLastUpdated(new Date(result.updated).toLocaleTimeString());
            }
        } catch (error) {
            console.error("Error fetching startup funding data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-64 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-bold text-gray-900 mb-2">{data.category}</p>
                    <div className="space-y-1 text-sm">
                        <p className="text-gray-700">
                            <span className="font-semibold">Deals:</span> {data.count}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-semibold">Amount:</span> ₹{data.amount.toLocaleString()} Cr
                        </p>
                        <p className="text-gray-700">
                            <span className="font-semibold">Avg:</span> ₹{Math.round(data.amount / data.count)} Cr
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            {/* Header */}
            <h3 className="text-lg md:text-xl font-black uppercase mb-1">
                Startup Funding Distribution by Category
            </h3>
            <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
                Funding landscape across Indian startups (2024 data)
            </p>

            {/* Stats Banner */}
            <div className="mb-4 grid grid-cols-3 gap-2 md:gap-3 p-2 md:p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <div className="text-center">
                    <div className="text-sm md:text-lg font-bold text-purple-600">{stats?.total_funding || "₹62,810 Cr"}</div>
                    <div className="text-[10px] md:text-xs text-gray-600">Total Funding</div>
                </div>
                <div className="text-center">
                    <div className="text-sm md:text-lg font-bold text-blue-600">{stats?.total_deals || "1,176"}</div>
                    <div className="text-[10px] md:text-xs text-gray-600">Total Deals</div>
                </div>
                <div className="text-center">
                    <div className="text-sm md:text-lg font-bold text-teal-600">{stats?.avg_deal_size || "₹53.4 Cr"}</div>
                    <div className="text-[10px] md:text-xs text-gray-600">Avg Deal</div>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full">
                <ResponsiveContainer width="100%" height={isMobile ? 280 : 360}>
                    <ScatterChart margin={{ top: 20, right: 10, bottom: 50, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            type="number"
                            dataKey="count"
                            name="Number of Deals"
                            tick={{ fill: "#6b7280", fontSize: isMobile ? 9 : 11 }}
                            axisLine={{ stroke: "#e5e7eb" }}
                            label={{ 
                                value: 'Number of Deals', 
                                position: 'insideBottom', 
                                offset: -20, 
                                style: { fill: '#6b7280', fontWeight: 600, fontSize: isMobile ? 10 : 12 }
                            }}
                        />
                        <YAxis
                            type="number"
                            dataKey="amount"
                            name="Funding Amount"
                            tick={{ fill: "#6b7280", fontSize: isMobile ? 9 : 11 }}
                            axisLine={{ stroke: "#e5e7eb" }}
                            label={{ 
                                value: 'Amount (₹ Cr)', 
                                angle: -90, 
                                position: 'insideLeft',
                                style: { fill: '#6b7280', fontWeight: 600, fontSize: isMobile ? 10 : 12 }
                            }}
                        />
                        <ZAxis range={isMobile ? [200, 600] : [400, 1000]} />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter
                            name="Startups"
                            data={data}
                            animationBegin={0}
                            animationDuration={1000}
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.color}
                                    className="cursor-pointer hover:opacity-70 transition-opacity"
                                />
                            ))}
                            <LabelList 
                                dataKey="category" 
                                position="top"
                                style={{ fontSize: isMobile ? 8 : 10, fill: '#374151', fontWeight: 600 }}
                            />
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            {/* Footer */}
            <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-gray-500">
                <span className="text-[10px] md:text-xs">Data from 2024 • Source: VCCEdge & Tracxn</span>
                {lastUpdated && (
                    <span className="text-[10px] md:text-xs text-purple-600 font-semibold">Updated: {lastUpdated}</span>
                )}
            </div>
        </div>
    );
}
