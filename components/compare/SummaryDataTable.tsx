"use client";

import { useEffect, useState, useRef } from "react";

interface SummaryData {
    country: string;
    gdp_2026: number;
    gdp_growth_2026: number;
    population_2026: number;
    gdp_per_capita_2026: number;
    unemployment_rate: number;
    inflation_rate: number;
}

export function SummaryDataTable({ countries, indicator, yearRange }: {
    countries: string[];
    indicator: string;
    yearRange: string;
}) {
    const [data, setData] = useState<SummaryData[]>([]);
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
                const response = await fetch('http://localhost:8002/compare/summary', {
                    signal: abortControllerRef.current.signal
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();

            if (!result || !result.countries) {
                console.error('Invalid API response:', result);
                setData([]);
                return;
            }

            const summaryData: SummaryData[] = countries
                .filter(country => result.countries[country])
                .map(country => {
                    const countryData = result.countries[country];
                    return {
                        country,
                        gdp_2026: countryData.gdp_2026 || 0,
                        gdp_growth_2026: countryData.gdp_growth_2026 || 0,
                        population_2026: countryData.population_2026 || 0,
                        gdp_per_capita_2026: countryData.gdp_per_capita_2026 || 0,
                        unemployment_rate: countryData.unemployment_rate || 0,
                        inflation_rate: countryData.inflation_rate || 0
                    };
                });

            setData(summaryData);
            setLastUpdate(new Date().toLocaleString('en-IN', { 
                dateStyle: 'medium', 
                timeStyle: 'short',
                timeZone: 'Asia/Kolkata' 
            }));
        } catch (error: any) {
            // Ignore abort errors
            if (error.name === 'AbortError') return;
            console.error("Error fetching summary data:", error);
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

    if (loading) {
        return (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="animate-pulse">
                    <div className="h-5 sm:h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-32 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg lg:text-xl font-black uppercase mb-1">
                Summary Data Table
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                Comprehensive economic indicators for 2026
            </p>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                                    Country
                                </th>
                                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                                    GDP (T$)
                                </th>
                                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                                    Growth %
                                </th>
                                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap hidden sm:table-cell">
                                    Pop (B)
                                </th>
                                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap hidden md:table-cell">
                                    GDP/Cap
                                </th>
                                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap hidden lg:table-cell">
                                    Unemp %
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr
                                    key={row.country}
                                    className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                                >
                                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 font-medium">
                                        {row.country}
                                    </td>
                                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 text-right font-semibold">
                                        ${row.gdp_2026.toFixed(2)}T
                                    </td>
                                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-right">
                                        <span className="text-green-600 font-semibold">+{row.gdp_growth_2026}%</span>
                                    </td>
                                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 text-right hidden sm:table-cell">
                                        {row.population_2026.toFixed(3)}B
                                    </td>
                                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 text-right hidden md:table-cell">
                                        ${row.gdp_per_capita_2026.toLocaleString()}
                                    </td>
                                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 text-right hidden lg:table-cell">
                                        {row.unemployment_rate}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {data.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-xs sm:text-sm">
                    No data available for selected countries
                </div>
            )}

            <div className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-500">
                Updated: {lastUpdate} • 2026 Projections • IMF, World Bank
            </div>
        </div>
    );
}
