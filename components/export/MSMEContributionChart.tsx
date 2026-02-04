"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from "recharts";
import budgetApi from "@/lib/budget-api";

interface MSMEData {
    name: string;
    value: number;
    count: string;
    color: string;
}

interface MSMEStats {
    total_msmes: string;
    employment_created: string;
    gdp_contribution: string;
    exports_share: string;
}

export function MSMEContributionChart() {
    const [data, setData] = useState<MSMEData[]>([]);
    const [stats, setStats] = useState<MSMEStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
    const [lastUpdated, setLastUpdated] = useState<string>("");

    useEffect(() => {
        fetchData();
        
        // Auto-refresh every 20 minutes
        const refreshInterval = setInterval(() => {
            fetchData();
        }, 20 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(budgetApi.exportMsmeContribution());
            const result = await response.json();
            if (result.distribution) {
                setData(result.distribution);
            }
            if (result.stats) {
                setStats(result.stats);
            }
            if (result.updated) {
                setLastUpdated(new Date(result.updated).toLocaleTimeString());
            }
        } catch (error) {
            console.error("Error fetching MSME data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-64 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Header */}
            <h3 className="text-xl font-black uppercase mb-1">
                MSME Sector Contribution
            </h3>
            <p className="text-sm text-gray-600 mb-6">
                Distribution of micro, small, and medium enterprises
            </p>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(undefined)}
                        animationBegin={0}
                        animationDuration={800}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={true}
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color}
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number, name: string, props: any) => [
                            `${value}% (${props.payload.count})`,
                            props.payload.name
                        ]}
                        contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Stats Grid */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4">
                <div className="text-center">
                    <div className="text-lg font-bold text-teal-600">{stats?.total_msmes || "63M"}</div>
                    <div className="text-xs text-gray-500">Total MSMEs</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{stats?.employment_created || "110M"}</div>
                    <div className="text-xs text-gray-500">Employment</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{stats?.gdp_contribution || "30%"}</div>
                    <div className="text-xs text-gray-500">GDP Share</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{stats?.exports_share || "48%"}</div>
                    <div className="text-xs text-gray-500">Exports</div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Data from 2024-25 • Source: MSME Ministry</span>
                {lastUpdated && (
                    <span className="text-purple-600 font-semibold">Updated: {lastUpdated}</span>
                )}
            </div>
        </div>
    );
}

// Active shape renderer for interactive hover effect
const renderActiveShape = (props: any) => {
    const { cx, cy, outerRadius, startAngle, endAngle, fill } = props;

    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                outerRadius={outerRadius + 8}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}
            />
        </g>
    );
};
