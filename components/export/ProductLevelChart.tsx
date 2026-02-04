"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

interface ProductData {
    category: string;
    imports: number;
    exports: number;
}

export function ProductLevelChart() {
    const [data, setData] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [hoveredBar, setHoveredBar] = useState<string | null>(null);

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
            const response = await fetch("http://localhost:8002/export/product-level");
            const result = await response.json();
            if (result.data) {
                setData(result.data);
            }
            if (result.updated) {
                setLastUpdated(new Date(result.updated).toLocaleTimeString());
            }
        } catch (error) {
            console.error("Error fetching product data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-64 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const imports = payload[0].value;
            const exports = payload[1].value;
            const balance = exports - imports;
            const isPositive = balance > 0;

            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
                    <p className="font-bold text-gray-900 mb-2">{label}</p>
                    <div className="space-y-1 text-sm">
                        <p className="text-red-600">
                            <span className="font-semibold">Imports:</span> ${imports.toFixed(1)}B
                        </p>
                        <p className="text-green-600">
                            <span className="font-semibold">Exports:</span> ${exports.toFixed(1)}B
                        </p>
                        <div className="border-t pt-1 mt-1">
                            <p className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {isPositive ? 'Surplus' : 'Deficit'}: ${Math.abs(balance).toFixed(1)}B
                            </p>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Header */}
            <h3 className="text-xl font-black uppercase mb-1">
                Product-Level Import vs. Export (USD Bn)
            </h3>
            <p className="text-sm text-gray-600 mb-6">
                Breakdown of key product categories with trade balance
            </p>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={320}>
                <BarChart 
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="category"
                        tick={{ fill: "#6b7280", fontSize: 10 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        label={{ 
                            value: 'USD Billion', 
                            angle: -90, 
                            position: 'insideLeft', 
                            style: { fill: '#6b7280', fontWeight: 600 }
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
                    <Legend
                        wrapperStyle={{ paddingTop: "10px" }}
                        iconType="square"
                    />
                    <Bar
                        dataKey="imports"
                        fill="#ef4444"
                        name="Imports (USD Bn)"
                        radius={[4, 4, 0, 0]}
                        animationBegin={0}
                        animationDuration={1000}
                        onMouseEnter={() => setHoveredBar('imports')}
                        onMouseLeave={() => setHoveredBar(null)}
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={`import-${index}`}
                                fill={hoveredBar === 'imports' ? '#dc2626' : '#ef4444'}
                            />
                        ))}
                    </Bar>
                    <Bar
                        dataKey="exports"
                        fill="#10b981"
                        name="Exports (USD Bn)"
                        radius={[4, 4, 0, 0]}
                        animationBegin={200}
                        animationDuration={1000}
                        onMouseEnter={() => setHoveredBar('exports')}
                        onMouseLeave={() => setHoveredBar(null)}
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={`export-${index}`}
                                fill={hoveredBar === 'exports' ? '#059669' : '#10b981'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Data from 2024-25 • Source: DGCIS</span>
                {lastUpdated && (
                    <span className="text-purple-600 font-semibold">Updated: {lastUpdated}</span>
                )}
            </div>
        </div>
    );
}
