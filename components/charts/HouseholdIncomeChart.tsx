"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

const fallbackData = [
    { bracket: "Lower Income (<₹3L)", percentage: 45, count: "135M", color: "#ef4444" },
    { bracket: "Lower Middle (₹3-8L)", percentage: 30, count: "90M", color: "#f97316" },
    { bracket: "Middle (₹8-20L)", percentage: 15, count: "45M", color: "#eab308" },
    { bracket: "Upper Middle (₹20-50L)", percentage: 7, count: "21M", color: "#10b981" },
    { bracket: "High Income (>₹50L)", percentage: 3, count: "9M", color: "#2e008b" },
];

interface HouseholdIncomeChartProps {
    data?: any[];
}

export default function HouseholdIncomeChart({ data }: HouseholdIncomeChartProps) {
    const chartData = data || fallbackData;
    
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis
                    dataKey="bracket"
                    type="category"
                    width={150}
                    tick={{ fontSize: 11, fill: "#4b5563" }}
                />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                    <p className="font-bold text-gray-900">{data.bracket}</p>
                                    <p className="text-sm text-gray-600">
                                        Households: <span className="font-semibold text-gray-900">{data.count}</span> ({data.percentage}%)
                                    </p>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={32}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
