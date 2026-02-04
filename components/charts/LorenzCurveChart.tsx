"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    CartesianGrid,
    Legend,
} from "recharts";

const lorenzData = [
    { percentile: "0%", actual: 0, equality: 0 },
    { percentile: "20%", actual: 4, equality: 20 },
    { percentile: "40%", actual: 15, equality: 40 },
    { percentile: "60%", actual: 35, equality: 60 },
    { percentile: "80%", actual: 65, equality: 80 },
    { percentile: "100%", actual: 100, equality: 100 },
];

export default function LorenzCurveChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lorenzData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                    dataKey="percentile"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                    contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                <Line
                    type="monotone"
                    dataKey="actual"
                    name="Actual Distribution"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ fill: "#0ea5e9", strokeWidth: 2, r: 4 }}
                />
                <Line
                    type="monotone"
                    dataKey="equality"
                    name="Line of Equality"
                    stroke="#64748b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
