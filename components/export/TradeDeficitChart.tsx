"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from "recharts";

interface TradeData {
    year: string;
    deficit: number;
    exports: number;
    imports: number;
}

export function TradeDeficitChart() {
    const [data, setData] = useState<TradeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>("");

    useEffect(() => {
        fetchData();
        
        // Auto-refresh every 20 minutes
        const refreshInterval = setInterval(() => {
            fetchData();
        }, 20 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:8002/export/trade-balance");
            const result = await response.json();
            if (result.data) {
                setData(result.data);
            }
            if (result.updated) {
                setLastUpdated(new Date(result.updated).toLocaleTimeString());
            }
        } catch (error) {
            console.error("Error fetching trade data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-64 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const deficit = payload[0].value;
            const exports = payload[0].payload.exports;
            const imports = payload[0].payload.imports;

            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-purple-200">
                    <p className="font-bold text-gray-900 mb-2">Year {label}</p>
                    <div className="space-y-1 text-sm">
                        <p className="text-green-600">
                            <span className="font-semibold">Exports:</span> ${exports.toFixed(1)}B
                        </p>
                        <p className="text-red-600">
                            <span className="font-semibold">Imports:</span> ${imports.toFixed(1)}B
                        </p>
                        <div className="border-t pt-1 mt-1">
                            <p className="font-bold text-red-600">
                                Trade Deficit: ${Math.abs(deficit).toFixed(1)}B
                            </p>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Header */}
            <h3 className="text-xl font-black uppercase mb-1">
                Annual Trade Deficit/Surplus (USD Bn)
            </h3>
            <p className="text-sm text-gray-600 mb-6">
                Historical trend showing export-import gap (2020-2026)
            </p>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                        <linearGradient id="deficitGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="year"
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        label={{ 
                            value: 'USD Billion', 
                            angle: -90, 
                            position: 'insideLeft', 
                            style: { fill: '#6b7280', fontWeight: 600 }
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
                    
                    <Area
                        type="monotone"
                        dataKey="deficit"
                        fill="url(#deficitGradient)"
                        stroke="none"
                    />
                    <Line
                        type="monotone"
                        dataKey="deficit"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: "#8b5cf6", r: 5, strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ 
                            r: 8, 
                            fill: "#8b5cf6", 
                            stroke: "#fff",
                            strokeWidth: 3
                        }}
                        animationBegin={0}
                        animationDuration={1500}
                    />
                </ComposedChart>
            </ResponsiveContainer>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4 p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="text-center">
                    <div className="text-sm font-bold text-red-700">
                        ${data.length > 0 ? Math.abs(data[data.length - 1].deficit).toFixed(1) : '0'}B
                    </div>
                    <div className="text-xs text-gray-600">Current Deficit</div>
                </div>
                <div className="text-center">
                    <div className="text-sm font-bold text-gray-700">
                        {data.length > 0 ? ((Math.abs(data[data.length - 1].deficit) / data[data.length - 1].imports) * 100).toFixed(1) : '0'}%
                    </div>
                    <div className="text-xs text-gray-600">% of Imports</div>
                </div>
                <div className="text-center">
                    <div className="text-sm font-bold text-purple-700">
                        {data.length > 1 ? 
                            (((data[data.length - 1].deficit - data[data.length - 2].deficit) / Math.abs(data[data.length - 2].deficit)) * 100).toFixed(1) 
                            : '0'}%
                    </div>
                    <div className="text-xs text-gray-600">YoY Change</div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Data from 2020-2025 • Source: Ministry of Commerce & RBI</span>
                {lastUpdated && (
                    <span className="text-purple-600 font-semibold">Updated: {lastUpdated}</span>
                )}
            </div>
        </div>
    );
}
