"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const FALLBACK_DATA = [
    { year: "2022", revenue: 41.87, expenditure: 44.5 },
    { year: "2023", revenue: 45.03, expenditure: 48.0 },
    { year: "2024", revenue: 47.66, expenditure: 50.5 },
    { year: "2025", revenue: 47.66, expenditure: 51.0 },
    { year: "2026", revenue: 53.48, expenditure: 55.0 },
];

export function RevenueExpenditureChart() {
    const [data, setData] = useState(FALLBACK_DATA);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTrendData() {
            try {
                const response = await fetch("http://localhost:8002/budget/trend");
                if (!response.ok) throw new Error("Failed to fetch trend");
                const result = await response.json();
                
                if (result.trend && Array.isArray(result.trend)) {
                    setData(result.trend);
                }
            } catch (error) {
                console.error("Error fetching trend data:", error);
                // Keep fallback data on error
            } finally {
                setLoading(false);
            }
        }

        fetchTrendData();
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="mb-4">
                <h3 className="text-xl font-black text-gray-900 mb-1">
                    Revenue vs. Expenditure Trend
                </h3>
                <p className="text-sm text-gray-600">
                    Historical trend of government revenue against its expenditure over the years.
                </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                {loading ? (
                     <div className="flex h-full items-center justify-center text-gray-500">Loading trend...</div>
                ) : (
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="year"
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            axisLine={{ stroke: "#e5e7eb" }}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            axisLine={{ stroke: "#e5e7eb" }}
                            label={{ value: 'Lakh Crores ₹', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 11 } }}
                        />
                        <Tooltip
                            formatter={(value: number) => `₹${value} Lakh Cr`}
                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="line"
                        />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#f97316"
                            strokeWidth={3}
                            dot={{ fill: "#f97316", r: 4 }}
                            name="Revenue Receipts"
                            animationDuration={1500}
                        />
                        <Line
                            type="monotone"
                            dataKey="expenditure"
                            stroke="#14b8a6"
                            strokeWidth={3}
                            dot={{ fill: "#14b8a6", r: 4 }}
                            name="Total Expenditure"
                            animationDuration={1500}
                        />
                    </LineChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}
