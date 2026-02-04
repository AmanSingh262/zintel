"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

interface BarChartComponentProps {
    data: any[];
    dataKeys: string[];
    xAxisKey: string;
    colors?: string[];
    title?: string;
}

export function BarChartComponent({
    data,
    dataKeys,
    xAxisKey,
    colors = ["#5B2D8B", "#2ECC71", "#E74C3C"],
    title
}: BarChartComponentProps) {
    return (
        <div className="w-full h-full">
            {title && <h4 className="text-sm font-semibold mb-3">{title}</h4>}
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey={xAxisKey}
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '8px 12px',
                        }}
                    />
                    <Legend />
                    {dataKeys.map((key, index) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            fill={colors[index % colors.length]}
                            radius={[4, 4, 0, 0]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
