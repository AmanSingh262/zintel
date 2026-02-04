"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    CartesianGrid,
} from "recharts";

const defaultData = [
    { state: "Maharashtra", income: 228000 },
    { state: "Gujarat", income: 210000 },
    { state: "Uttar Pradesh", income: 155000 },
    { state: "Rajasthan", income: 145000 },
    { state: "Kerala", income: 170000 },
    { state: "Punjab", income: 195000 },
];

interface IncomeBarChartProps {
    data?: any[];
    xAxisKey?: string;
    barKey?: string;
    fillColor?: string;
}

export default function IncomeBarChart({
    data = defaultData,
    xAxisKey = "state",
    barKey = "income",
    fillColor = "#7c3aed"
}: IncomeBarChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                    dataKey={xAxisKey}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(value) =>
                        value >= 1000 ? `${value / 1000}k` : value
                    }
                />
                <Tooltip
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, "Income"]}
                    contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                />
                <Bar dataKey={barKey} fill={fillColor} radius={[4, 4, 0, 0]} animationDuration={1500} />
            </BarChart>
        </ResponsiveContainer>
    );
}
