"use client";

import { useEffect, useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface GDPComparisonData {
    year: string;
    [country: string]: number | string;
}

export function MainComparisonChart({
    countries,
    indicator,
    yearRange
}: {
    countries: string[];
    indicator: string;
    yearRange: string;
}) {
    const [data, setData] = useState<GDPComparisonData[]>([]);
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
                
                // Fetch from backend API
                const response = await fetch(`http://localhost:8002/compare/gdp`, {
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

            // Parse year range
            const [startYear, endYear] = yearRange.split("-").map(y => parseInt(y));

            // Filter years and build chart data
            const chartData: GDPComparisonData[] = [];
            result.years.forEach((year: number, index: number) => {
                if (year >= startYear && year <= endYear) {
                    const yearData: GDPComparisonData = { year: year.toString() };
                    
                    countries.forEach(country => {
                        if (result.countries[country] && result.countries[country][index]) {
                            yearData[country] = result.countries[country][index];
                        }
                    });
                    
                    chartData.push(yearData);
                }
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
            console.error("Error fetching comparison data:", error);
            setData([]);
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
    }, [countries, indicator, yearRange]);

    const colors = ["#f97316", "#3b82f6", "#ef4444", "#10b981", "#8b5cf6"];

    if (loading) {
        return (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-96 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                <h3 className="text-base sm:text-lg lg:text-xl font-black uppercase">
                    Comparison of {indicator} ({yearRange})
                </h3>
                <div className="flex items-center gap-2">
                    <i className="ri-line-chart-line text-purple-600 text-xl sm:text-2xl"></i>
                </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                Comparison of selected indicator across countries
            </p>

            <ResponsiveContainer width="100%" height={350} className="sm:!h-[400px]">
                <BarChart data={data}>
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
                        label={{
                            value: 'Trillion USD',
                            angle: -90,
                            position: 'insideLeft',
                            fill: '#6b7280',
                            fontSize: 10
                        }}
                        className="sm:!text-xs"
                    />
                    <Tooltip
                        formatter={(value: number) => `$${value.toFixed(2)}T`}
                        contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            fontSize: "12px"
                        }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: "15px" }}
                        iconType="square"
                        iconSize={10}
                        fontSize={11}
                    />
                    {countries.map((country, index) => (
                        <Bar
                            key={country}
                            dataKey={country}
                            fill={colors[index % colors.length]}
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>

            <div className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-500">
                Updated: {lastUpdate} • Data from {yearRange} • Trillion USD
            </div>
        </div>
    );
}
