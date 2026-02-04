"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface WasteData {
    category: string;
    generated: number;
    recycled: number;
}

export function WasteGenerationChart() {
    const [data, setData] = useState<WasteData[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState("");
    const [totalGenerated, setTotalGenerated] = useState(0);
    const [totalRecycled, setTotalRecycled] = useState(0);

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
            const response = await fetch("http://localhost:8002/environment/waste-generation");
            const result = await response.json();
            if (!isMounted) return;
            
            // Get latest year data
            const latestYear = result.data[result.data.length - 1];
            setTotalGenerated(latestYear.generated);
            setTotalRecycled(latestYear.recycled);
            
            // Transform by_type data for the chart
            const transformedData = Object.entries(result.by_type).map(([category, info]: [string, any]) => ({
                category,
                generated: parseFloat((latestYear.generated * (info.percentage / 100)).toFixed(1)),
                recycled: parseFloat((latestYear.generated * (info.percentage / 100) * (info.recycling_rate / 100)).toFixed(1))
            }));
            
            setData(transformedData);
            setLastUpdate(result.updated);
        } catch (error) {
            console.error("Error fetching waste data:", error);
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border-2 border-green-500 p-4 sm:p-6">
                <div className="animate-pulse">
                    <div className="h-4 sm:h-6 bg-gray-200 rounded w-2/3 mb-3 sm:mb-4"></div>
                    <div className="h-48 sm:h-64 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border-2 border-green-500 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                <h3 className="text-base sm:text-xl font-black uppercase">Waste Generation vs. Recycling (National)</h3>
                <span className="text-xs sm:text-sm text-gray-600 w-fit">Total: {totalGenerated.toFixed(1)} MT</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Comparison of waste generated ({totalGenerated.toFixed(1)} MT) vs recycled ({totalRecycled.toFixed(1)} MT) across key categories. Recycling rate: {((totalRecycled/totalGenerated)*100).toFixed(1)}%
            </p>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={480} className="sm:!h-[520px]">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 25, left: 15, bottom: 65 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        type="category"
                        dataKey="category"
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        className="sm:!text-base"
                    />
                    <YAxis
                        type="number"
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        domain={[0, 'dataMax + 5']}
                        allowDataOverflow={false}
                        className="sm:!text-base"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px"
                        }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: "10px" }}
                        iconType="square"
                        iconSize={14}
                        fontSize={13}
                    />
                    <Bar
                        dataKey="generated"
                        fill="#f97316"
                        name="Waste Generated"
                        radius={[8, 8, 0, 0]}
                        barSize={50}
                    />
                    <Bar
                        dataKey="recycled"
                        fill="#10b981"
                        name="Waste Recycled"
                        radius={[8, 8, 0, 0]}
                        barSize={50}
                    />
                </BarChart>
            </ResponsiveContainer>

            {/* Footer */}
            <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-500">
                Updated: {lastUpdate} • Million Tonnes (MT) • Ministry of Environment, Forest & Climate Change
            </div>
        </div>
    );
}
