"use client";

import { useEffect, useState, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import budgetApi from "@/lib/budget-api";

interface GDPData {
    sector: string;
    value: number;
    color: string;
}

export function GDPCompositionChart({ countries }: { countries: string[] }) {
    const [data, setData] = useState<GDPData[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (countries.length > 0) {
            setSelectedCountry(countries[0]);
        }
    }, [countries]);

    useEffect(() => {
        if (selectedCountry) {
            const fetchData = async () => {
                try {
                    // Abort previous request if exists
                    if (abortControllerRef.current) {
                        abortControllerRef.current.abort();
                    }
                    
                    abortControllerRef.current = new AbortController();
                    setLoading(true);
                    const response = await fetch(budgetApi.compareGdpComposition(), {
                        signal: abortControllerRef.current.signal
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const result = await response.json();

            if (!result) {
                console.error('Invalid API response:', result);
                setData([]);
                return;
            }

            if (result[selectedCountry]) {
                const countryData = result[selectedCountry];
                const compositionData = [
                    { sector: "Services", value: countryData.services || 0, color: "#8b5cf6" },
                    { sector: "Industry", value: countryData.industry || 0, color: "#3b82f6" },
                    { sector: "Agriculture", value: countryData.agriculture || 0, color: "#10b981" },
                ];
                setData(compositionData);
            } else {
                setData([]);
            }

            setLastUpdate(new Date().toLocaleString('en-IN', { 
                dateStyle: 'medium', 
                timeStyle: 'short',
                timeZone: 'Asia/Kolkata' 
            }));
        } catch (error: any) {
            // Ignore abort errors
            if (error.name === 'AbortError') return;
            console.error("Error fetching GDP composition:", error);
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
        }
    }, [selectedCountry]);

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                <h3 className="text-base sm:text-lg lg:text-xl font-black uppercase">GDP Composition</h3>
                <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-fit"
                >
                    {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                    ))}
                </select>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Sector-wise breakdown • 2025</p>

            <ResponsiveContainer width="100%" height={220} className="sm:!h-[250px]">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        className="sm:!innerRadius-[60] sm:!outerRadius-[100]"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value: number) => `${value}%`}
                        contentStyle={{
                            fontSize: "12px",
                            borderRadius: "8px"
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        iconSize={10}
                        fontSize={11}
                    />
                </PieChart>
            </ResponsiveContainer>

            <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500">
                Updated: {lastUpdate} • Percentage of GDP
            </div>
        </div>
    );
}
