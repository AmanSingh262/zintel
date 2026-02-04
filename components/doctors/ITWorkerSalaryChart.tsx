"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SalaryIndexData {
    year: string;
    index: number;
}

export function ITWorkerSalaryChart() {
    const [data, setData] = useState<SalaryIndexData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("/api/doctors/it-salary");
            if (!response.ok) throw new Error("Failed to fetch data");
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-black uppercase mb-1">IT & Data Worker Salary Index</h3>
                <p className="text-sm text-gray-600 mb-6">Average annual salary index (base: 100 in 2018)</p>
                <div className="h-[300px] flex items-center justify-center">
                    <div className="animate-pulse text-gray-400">Loading data...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-black uppercase mb-1">IT & Data Worker Salary Index</h3>
                <p className="text-sm text-gray-600 mb-6">Average annual salary index (base: 100 in 2018)</p>
                <div className="h-[300px] flex items-center justify-center text-red-500">
                    Error: {error}
                </div>
            </div>
        );
    }
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-black uppercase mb-1">IT & Data Worker Salary Index</h3>
            <p className="text-sm text-gray-600 mb-6">Average annual salary index (base: 100 in 2018)</p>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="year"
                        tick={{ fill: "#6b7280" }}
                        axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                        tick={{ fill: "#6b7280" }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        domain={[100, 160]}
                        ticks={[100, 115, 130, 145, 160]}
                    />
                    <Tooltip
                        formatter={(value: number) => [value, "Index"]}
                        contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px"
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="index"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: "#10b981", r: 5 }}
                        activeDot={{ r: 7 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
