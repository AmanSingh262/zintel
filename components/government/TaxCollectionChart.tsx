"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";import budgetApi from "@/lib/budget-api";
const FALLBACK_DATA = [
    { state: "Maharashtra", value: 545, color: "#8b5cf6" },
    { state: "Uttar Pradesh", value: 325, color: "#3b82f6" },
    { state: "Tamil Nadu", value: 285, color: "#10b981" },
    { state: "Karnataka", value: 268, color: "#f59e0b" },
    { state: "Gujarat", value: 245, color: "#ef4444" },
    { state: "West Bengal", value: 185, color: "#ec4899" },
    { state: "Rajasthan", value: 165, color: "#06b6d4" },
    { state: "Madhya Pradesh", value: 145, color: "#84cc16" },
];

export function TaxCollectionChart() {
    const [data, setData] = useState(FALLBACK_DATA);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const formatStateName = (value: string) => {
        if (!isMobile) return value;
        const stateMap: {[key: string]: string} = {
            "Andhra Pradesh": "AP",
            "Arunachal Pradesh": "AR",
            "Uttar Pradesh": "UP",
            "Madhya Pradesh": "MP",
            "Himachal Pradesh": "HP",
            "Tamil Nadu": "TN",
            "West Bengal": "WB",
            "Maharashtra": "Mah",
            "Karnataka": "KA",
            "Rajasthan": "RJ",
            "Gujarat": "Gujarat",
            "Telangana": "TS",
            "Kerala": "Kerala",
            "Odisha": "Odisha",
            "Punjab": "Punjab",
            "Haryana": "Haryana",
            "Bihar": "Bihar",
            "Jharkhand": "Jharkhand",
            "Chhattisgarh": "CG",
            "Assam": "Assam",
        };
        return stateMap[value] || value.substring(0, 8) + "..";
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(budgetApi.revenueStateGst());
                if (!response.ok) throw new Error("Failed to fetch tax data");
                const result = await response.json();
                if (result.data && Array.isArray(result.data)) {
                    setData(result.data);
                }
            } catch (error) {
                console.error("Error fetching tax data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="mb-4">
                <h3 className="text-xl font-black text-gray-900 mb-1">
                    State-wise GST Collection (2025-26)
                </h3>
                <p className="text-sm text-gray-600">
                    Annual GST and tax revenue collected by major Indian states
                </p>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                {loading ? (
                    <div className="flex h-full items-center justify-center text-gray-500">Loading tax data...</div>
                ) : (
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: isMobile ? 5 : 30, left: isMobile ? -20 : 100, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            type="number"
                            domain={[0, 650]}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            axisLine={{ stroke: "#e5e7eb" }}
                            label={{ value: '₹ Thousand Crores', position: 'insideBottom', offset: -5, style: { fontSize: 11, fill: '#6b7280' } }}
                        />
                        <YAxis
                            type="category"
                            dataKey="state"
                            tick={{ fill: "#374151", fontSize: isMobile ? 10 : 12, fontWeight: 500 }}
                            axisLine={{ stroke: "#e5e7eb" }}
                            width={isMobile ? 55 : 110}
                            interval={0}
                            tickFormatter={formatStateName}
                        />
                        <Tooltip
                            cursor={{ fill: '#f3f4f6' }}
                            formatter={(value: number) => [`₹${value} Thousand Cr`, "Tax Revenue"]}
                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                            itemStyle={{ color: '#374151', fontWeight: 600 }}
                            labelStyle={{ color: '#111827', fontWeight: 700 }}
                        />
                        <Bar 
                            dataKey="value" 
                            radius={[0, 6, 6, 0]} 
                            animationDuration={800}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color || "#8b5cf6"} />
                            ))}
                        </Bar>
                    </BarChart>
                )}
            </ResponsiveContainer>
            
            <div className="mt-4 p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                <p className="text-xs text-gray-700">
                    <span className="font-semibold">📊 Note:</span> Data includes GST collection, state taxes, and other state revenues for FY 2025-26
                </p>
            </div>
        </div>
    );
}
