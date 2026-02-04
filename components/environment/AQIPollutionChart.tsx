"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import budgetApi from "@/lib/budget-api";

interface AQIData {
    day: string;
    aqi: number;
}

interface CityAQI {
    city: string;
    state: string;
    aqi: number;
    pm25: number;
    pm10: number;
    category: string;
    color: string;
}

interface AQIPollutionChartProps {
    city?: string;
}

export function AQIPollutionChart({ city = "Delhi" }: AQIPollutionChartProps) {
    const [data, setData] = useState<AQIData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentAQI, setCurrentAQI] = useState(0);
    const [availableCities, setAvailableCities] = useState<CityAQI[]>([]);
    const [lastUpdate, setLastUpdate] = useState("");
    const [pm25, setPm25] = useState(0);
    const [pm10, setPm10] = useState(0);

    const REFRESH_MS = 20 * 60 * 1000; // 20 minutes

    useEffect(() => {
        let isMounted = true;
        let timer: NodeJS.Timeout | undefined;

        const run = async () => {
            await fetchData(isMounted);
            timer = setInterval(() => fetchData(isMounted), REFRESH_MS);
        };

        run();

        return () => {
            isMounted = false;
            if (timer) clearInterval(timer);
        };
    }, [city]); // Refetch when city changes and schedule periodic refresh

    const fetchData = async (isMounted: boolean = true) => {
        try {
            const response = await fetch(budgetApi.environmentAqiPollution());
            const result = await response.json();
            if (!isMounted) return;
            
            // Store available cities
            setAvailableCities(result.cities);
            setLastUpdate(result.updated);
            
            // Find the selected city data (try exact match first, then case-insensitive)
            let cityData = result.cities.find((c: any) => c.city === city);
            if (!cityData) {
                cityData = result.cities.find((c: any) => c.city.toLowerCase() === city.toLowerCase());
            }
            
            // If still not found, try to find by partial match or use first city
            if (!cityData) {
                // Try to find cities that contain the search term
                cityData = result.cities.find((c: any) => 
                    c.city.toLowerCase().includes(city.toLowerCase()) ||
                    city.toLowerCase().includes(c.city.toLowerCase())
                );
            }
            
            // Last resort: use Delhi as default
            if (!cityData) {
                cityData = result.cities.find((c: any) => c.city === "Delhi");
            }
            
            if (cityData) {
                setCurrentAQI(cityData.aqi);
                setPm25(cityData.pm25);
                setPm10(cityData.pm10);
            }
            
            // Use trend data for the chart - try to find matching city name in trend data
            const trendData = result.trend.map((t: any) => {
                // Try to find matching key in trend data
                let aqiValue = t[city] || t[cityData?.city];
                
                // If not found, try case-insensitive match
                if (!aqiValue) {
                    const matchingKey = Object.keys(t).find(key => 
                        key.toLowerCase() === city.toLowerCase() ||
                        key.toLowerCase().includes(city.toLowerCase()) ||
                        city.toLowerCase().includes(key.toLowerCase())
                    );
                    aqiValue = matchingKey ? t[matchingKey] : t.Delhi;
                }
                
                return {
                    day: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    aqi: aqiValue || t.Delhi // fallback to Delhi if city not in trend
                };
            });
            
            setData(trendData);
        } catch (error) {
            console.error("Error fetching AQI data:", error);
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    const getAQIStatus = (aqi: number) => {
        if (aqi <= 50) return { label: "Good", color: "bg-green-500" };
        if (aqi <= 100) return { label: "Moderate", color: "bg-yellow-500" };
        if (aqi <= 200) return { label: "Poor", color: "bg-orange-500" };
        if (aqi <= 300) return { label: "Very Poor", color: "bg-red-500" };
        return { label: "Severe", color: "bg-purple-900" };
    };

    const status = getAQIStatus(currentAQI);
    const borderColor = currentAQI > 100 ? "border-red-500" : "border-green-500";

    if (loading) {
        return (
            <div className={`bg-white rounded-2xl shadow-sm border-2 ${borderColor} p-6`}>
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border-2 ${borderColor} p-4 sm:p-6 relative`}>
            {/* AQI Badge */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <div className={`${status.color} text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-xs sm:text-sm`}>
                    {currentAQI} AQI
                </div>
            </div>

            {/* Header */}
            <h3 className="text-base sm:text-xl font-black uppercase mb-1 pr-20 sm:pr-24">
                AQI Pollution Trends ({city})
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Average Air Quality Index trend over the last 7 days</p>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={250} className="sm:!h-[300px]">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="day"
                        tick={{ fill: "#6b7280", fontSize: 10 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        className="sm:!text-xs"
                    />
                    <YAxis
                        tick={{ fill: "#6b7280", fontSize: 10 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        domain={[0, 400]}
                        className="sm:!text-xs"
                    />
                    <Tooltip
                        formatter={(value: number) => [`${value} AQI`, "Air Quality"]}
                        contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px"
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="aqi"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={{ fill: "#ef4444", r: 5 }}
                        activeDot={{ r: 7 }}
                    />
                </LineChart>
            </ResponsiveContainer>

            {/* Footer */}
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
                <span className="text-[10px] sm:text-xs">Updated: {lastUpdate}</span>
                <span className="italic text-[10px] sm:text-xs">Central Pollution Control Board (CPCB) • Auto-refreshes every 20 minutes</span>
            </div>
        </div>
    );
}
