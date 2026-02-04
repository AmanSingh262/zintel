"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

const fallbackData = [
    { year: "2019", export: 330, import: 480 },
    { year: "2020", export: 313, import: 394 },
    { year: "2021", export: 422, import: 613 },
    { year: "2022", export: 450, import: 714 },
    { year: "2023", export: 437, import: 677 },
    { year: "2024", export: 451, import: 690 }, // Projected/Provisional
];

interface ExportImportChartProps {
    data?: any[];
}

export default function ExportImportChart({ data }: ExportImportChartProps) {
    const chartData = data || fallbackData;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={chartData}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <defs>
                    <linearGradient id="colorExport" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorImport" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickFormatter={(value) => `$${value}B`}
                />
                <Tooltip
                    formatter={(value) => [`$${value} Billion`, undefined]}
                    contentStyle={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    }}
                />
                <Legend iconType="circle" />
                <Area
                    type="monotone"
                    dataKey="export"
                    name="Exports"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExport)"
                />
                <Area
                    type="monotone"
                    dataKey="import"
                    name="Imports"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorImport)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
