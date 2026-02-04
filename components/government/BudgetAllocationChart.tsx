"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const defaultUnionData = [
    { name: "Transfers to States", value: 35.8, realValue: "22.8", color: "#f97316" },
    { name: "Interest Payments", value: 18.5, realValue: "11.8", color: "#6b7280" },
    { name: "Subsidies", value: 6.6, realValue: "4.2", color: "#eab308" },
    { name: "Defence", value: 10.2, realValue: "6.5", color: "#ef4444" },
    { name: "Infrastructure", value: 8.8, realValue: "5.6", color: "#14b8a6" },
    { name: "Pension", value: 3.8, realValue: "2.45", color: "#1e1b4b" },
    { name: "Others", value: 16.3, realValue: "10.4", color: "#8b5cf6" },
];

interface BudgetAllocationChartProps {
    year?: string;
    data?: any[];
}

export function BudgetAllocationChart({ year = "2026", data }: BudgetAllocationChartProps) {
    // Use provided data or fallback to default
    const chartData = (data && data.length > 0) ? data : defaultUnionData;
    
    // Calculate total for percentage display
    const total = chartData.reduce((sum, item) => sum + (typeof item.value === 'number' ? item.value : parseFloat(item.value) || 0), 0);
    
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
                <h3 className="text-xl font-black text-gray-900 mb-1">
                    Budget Allocation ({year})
                </h3>
                <p className="text-sm text-gray-600">
                    Distribution of funds across key sectors
                </p>
            </div>

            <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="45%"
                            innerRadius={70}
                            outerRadius={110}
                            paddingAngle={3}
                            dataKey="value"
                            label={({ name, value }) => {
                                const percent = total > 0 ? ((value / total) * 100).toFixed(1) : value;
                                return `${percent}%`;
                            }}
                            labelLine={true}
                        >
                            {chartData.map((entry: any, index: number) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.color || `hsl(${index * 45}, 70%, 50%)`}
                                    stroke="#fff"
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number, name: string, props: any) => {
                                const percent = total > 0 ? ((value / total) * 100).toFixed(1) : value;
                                const amount = props.payload.realValue || props.payload.amount || `₹${(value / 100000).toFixed(2)} Lakh Cr`;
                                return [
                                    <span key="val" className="font-semibold text-gray-900">
                                        {percent}% <span className="text-gray-500 font-normal">
                                            ({amount})
                                        </span>
                                    </span>,
                                    name
                                ];
                            }}
                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                            itemStyle={{ color: '#374151' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Color-coded legend */}
                <div className="flex flex-wrap gap-3 mt-4 justify-center max-w-2xl">
                    {chartData.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color || `hsl(${idx * 45}, 70%, 50%)` }}
                            ></div>
                            <span className="text-xs text-gray-700 font-medium">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
