"use client";

import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend
} from "recharts";

interface WaterSource {
    source: string;
    volume: number;
    unit: string;
    color: string;
}

export function WaterSourceChart() {
    const [waterData, setWaterData] = useState<WaterSource[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState("");

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
    }, []);

    const fetchData = async (isMounted: boolean = true) => {
        try {
            const response = await fetch("http://localhost:8002/environment/water-usage");
            const result = await response.json();
            if (!isMounted) return;
            
            // Get latest year data
            const latestData = result.data[result.data.length - 1];
            
            const transformedData: WaterSource[] = [
                { source: "Surface Water", volume: latestData["Surface Water"], unit: "BCM", color: "#3b82f6" },
                { source: "Groundwater", volume: latestData["Groundwater"], unit: "BCM", color: "#f97316" },
                { source: "Rainwater", volume: latestData["Rainwater"], unit: "BCM", color: "#10b981" },
                { source: "Recycled", volume: latestData["Recycled"], unit: "BCM", color: "#8b5cf6" }
            ];
            
            setWaterData(transformedData);
            setLastUpdate(result.updated);
        } catch (error) {
            console.error("Error fetching water usage data:", error);
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-64 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Annual Water Usage by Source (2025)
                </h3>
                <p className="text-sm text-gray-600">
                    Estimated extraction in Billion Cubic Meters (BCM) - Central Water Commission
                </p>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={waterData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis
                            dataKey="source"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#4b5563", fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#4b5563", fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: '#eff6ff' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-white p-3 border border-blue-100 rounded-lg shadow-lg">
                                            <p className="font-bold text-gray-900">{data.source}</p>
                                            <p className="text-blue-600 font-semibold">{data.volume} {data.unit}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="volume" radius={[4, 4, 0, 0]} barSize={50}>
                            {waterData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-xs text-right text-gray-500 italic">
                Updated: {lastUpdate} • Central Water Commission Annual Report 2024-25
            </div>
        </div>
    );
}
