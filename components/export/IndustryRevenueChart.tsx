"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface IndustryData {
    year: string;
    itSector: number;
    manufacturing: number;
    services: number;
}

export function IndustryRevenueChart() {
    const [data, setData] = useState<IndustryData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("/api/export/industry-revenue");
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching industry data:", error);
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

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Header */}
            <h3 className="text-xl font-black uppercase mb-1">
                Major Industry Revenue Growth (USD Bn)
            </h3>
            <p className="text-sm text-gray-600 mb-6">
                Comparative growth across core sectors
            </p>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorIT" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorMfg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#64748b" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#64748b" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorSvc" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#f87171" stopOpacity={0.1} />
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
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px"
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "10px" }} />
                    <Area
                        type="monotone"
                        dataKey="itSector"
                        stackId="1"
                        stroke="#14b8a6"
                        fillOpacity={1}
                        fill="url(#colorIT)"
                        name="IT Sector (USD Bn)"
                    />
                    <Area
                        type="monotone"
                        dataKey="manufacturing"
                        stackId="1"
                        stroke="#64748b"
                        fillOpacity={1}
                        fill="url(#colorMfg)"
                        name="Manufacturing (USD Bn)"
                    />
                    <Area
                        type="monotone"
                        dataKey="services"
                        stackId="1"
                        stroke="#f87171"
                        fillOpacity={1}
                        fill="url(#colorSvc)"
                        name="Services (USD Bn)"
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Footer */}
            <div className="mt-4 text-xs text-gray-500">
                2019-2024 • Stacked Revenue View
            </div>
        </div>
    );
}
