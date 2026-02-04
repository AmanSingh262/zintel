"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts";

interface PieChartComponentProps {
    data: any[];
    dataKey: string;
    nameKey: string;
    colors?: string[];
    title?: string;
}

const DEFAULT_COLORS = ["#5B2D8B", "#8E6BBF", "#2ECC71", "#E74C3C", "#F39C12", "#3498DB"];

export function PieChartComponent({
    data,
    dataKey,
    nameKey,
    colors = DEFAULT_COLORS,
    title
}: PieChartComponentProps) {
    return (
        <div className="w-full h-full">
            {title && <h4 className="text-sm font-semibold mb-3">{title}</h4>}
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey={dataKey}
                        nameKey={nameKey}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => `${entry[nameKey]}: ${entry[dataKey]}`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '8px 12px',
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
