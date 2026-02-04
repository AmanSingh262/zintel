"use client";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from "recharts";

const fallbackData = [
    { name: "Maharashtra", value: 18, color: "#2e008b" },
    { name: "Karnataka", value: 15, color: "#10b981" },
    { name: "Delhi NCR", value: 13, color: "#f97316" },
    { name: "Tamil Nadu", value: 8, color: "#ef4444" },
    { name: "Gujarat", value: 7, color: "#eab308" },
    { name: "Others", value: 39, color: "#9ca3af" },
];

interface StartupChartProps {
    data?: any[];
}

export function StartupDistributionChart({ data }: StartupChartProps) {
    const chartData = (data && data.length > 0) 
        ? data.map((item, idx) => ({
            ...item,
            // Ensure color if missing
            color: item.color || fallbackData[idx % fallbackData.length].color
        }))
        : fallbackData;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Startup Ecosystem by State
                </h3>
                <p className="text-sm text-gray-600">
                    Percentage distribution of recognized startups (DPIIT, 2023)
                </p>
            </div>

            <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => [`${value}%`, "Share"]}
                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #f3f4f6",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                            }}
                        />
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            iconType="circle"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
