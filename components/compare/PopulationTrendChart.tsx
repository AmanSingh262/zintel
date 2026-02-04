"use client";

import { useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PopulationData {
    year: string;
    [country: string]: number | string;
}

export function PopulationTrendChart({ countries }: { countries: string[] }) {
    const [data, setData] = useState<PopulationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState("");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Abort previous request if exists
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
                
                abortControllerRef.current = new AbortController();
                setLoading(true);
                const response = await fetch('http://localhost:8002/compare/population', {
                    signal: abortControllerRef.current.signal
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();

            if (!result || !result.years || !result.countries) {
                console.error('Invalid API response:', result);
                setData([]);
                return;
            }

            // Build chart data
            const chartData: PopulationData[] = result.years.map((year: number, index: number) => {
                const yearData: PopulationData = { year: year.toString() };
                countries.forEach(country => {
                    if (result.countries[country] && result.countries[country][index]) {
                        yearData[country] = result.countries[country][index];
                    }
                });
                return yearData;
            });

            setData(chartData);
            setLastUpdate(new Date().toLocaleString('en-IN', { 
                dateStyle: 'medium', 
                timeStyle: 'short',
                timeZone: 'Asia/Kolkata' 
            }));
        } catch (error: any) {
            // Ignore abort errors
            if (error.name === 'AbortError') return;
            console.error("Error fetching population data:", error);
        } finally {
            setLoading(false);
        }
    };
        
        fetchData();
        
        // Auto-refresh every 20 minutes
        intervalRef.current = setInterval(() => {
            fetchData();
        }, 1200000); // 20 minutes

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [countries]);

    const colors = ["#f97316", "#3b82f6", "#ef4444", "#10b981", "#8b5cf6"];

    if (loading) {
        return (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="animate-pulse">
                    <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-48 sm:h-64 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg lg:text-xl font-black uppercase mb-1">Population Trend (Billion)</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Trend over time for selected entities (2020-2026)</p>

            <ResponsiveContainer width="100%" height={220} className="sm:!h-[250px]">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="year"
                        tick={{ fill: "#6b7280", fontSize: 10 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        className="sm:!text-xs"
                    />
                    <YAxis
                        tick={{ fill: "#6b7280", fontSize: 10 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        domain={[0, 'dataMax + 0.1']}
                        className="sm:!text-xs"
                    />
                    <Tooltip
                        formatter={(value: number) => `${value.toFixed(3)}B`}
                        contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            fontSize: "12px"
                        }}
                    />
                    <Legend iconSize={10} fontSize={11} />
                    {countries.map((country, index) => (
                        <Line
                            key={country}
                            type="monotone"
                            dataKey={country}
                            stroke={colors[index % colors.length]}
                            strokeWidth={2}
                            dot={{ fill: colors[index % colors.length], r: 4 }}
                            className="sm:!strokeWidth-[3]"
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>

            <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500">
                Updated: {lastUpdate} • Billion
            </div>
        </div>
    );
}
