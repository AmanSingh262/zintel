"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";import budgetApi from "@/lib/budget-api";
const FALLBACK_DATA = [
    { name: "Food Security", allocated: 205, spent: 195, color: "#10b981" },
    { name: "Fertilizer Subsidy", allocated: 164, spent: 175, color: "#f59e0b" },
    { name: "Rural Dev (MGNREGA)", allocated: 86, spent: 105, color: "#3b82f6" },
    { name: "PM Awas Yojana", allocated: 54, spent: 48, color: "#8b5cf6" }, 
    { name: "Health (Ayushman)", allocated: 86, spent: 72, color: "#ef4444" },
    { name: "Jal Jeevan Mission", allocated: 70, spent: 65, color: "#06b6d4" },
];

export function WelfareSpendingChart() {
    const [data, setData] = useState(FALLBACK_DATA);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const formatYAxis = (value: string) => {
        if (!isMobile) return value;
        if (value.includes("Food")) return "Food Sec";
        if (value.includes("Fertilizer")) return "Fertilizer";
        if (value.includes("Rural")) return "Rural Dev";
        if (value.includes("Awas")) return "PM Awas";
        if (value.includes("Health")) return "Health";
        if (value.includes("Jal")) return "Jal Jeevan";
        return value;
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(budgetApi.budgetWelfare());
                if (!response.ok) throw new Error("Failed to fetch welfare data");
                const result = await response.json();
                
                if (result.data) {
                    const d = result.data;
                    // Transform API object to Chart array format
                    const transformedData = [
                        { 
                            name: "Food Security", 
                            allocated: d.foodSubsidies?.allocated || 205, 
                            spent: d.foodSubsidies?.spent || 195,
                            color: "#10b981" 
                        },
                        { 
                            name: "Fertilizer Subsidy", 
                            allocated: d.fertilizerSubsidies?.allocated || 164, 
                            spent: d.fertilizerSubsidies?.spent || 175,
                            color: "#f59e0b" 
                        },
                        { 
                            name: "Rural Dev", 
                            allocated: d.ruralDevelopment?.allocated || 86, 
                            spent: d.ruralDevelopment?.spent || 105,
                            color: "#3b82f6" 
                        },
                        { 
                            name: "PM Awas Yojana", 
                            allocated: d.pmAwas?.allocated || 54, 
                            spent: d.pmAwas?.spent || 48,
                            color: "#8b5cf6" 
                        },
                        { 
                            name: "Health (Ayushman)", 
                            allocated: d.health?.allocated || 86, 
                            spent: d.health?.spent || 72,
                            color: "#ef4444" 
                        },
                        { 
                            name: "Jal Jeevan", 
                            allocated: d.jalJeevan?.allocated || 70, 
                            spent: d.jalJeevan?.spent || 65,
                            color: "#06b6d4" 
                        },
                    ];
                    setData(transformedData);
                }
            } catch (error) {
                console.error("Error fetching welfare data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 mb-1">
                            Welfare Spending Breakdown
                        </h3>
                        <p className="text-sm text-gray-600">
                            Budget Allocation vs Actual Expenditure (2024-25)
                        </p>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                {loading ? (
                    <div className="flex h-full items-center justify-center text-gray-500">Loading welfare data...</div>
                ) : (
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: isMobile ? 5 : 30, left: isMobile ? -20 : 100, bottom: 5 }}
                        barGap={isMobile ? 0 : 2}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#f0f0f0" />
                        <XAxis 
                            type="number" 
                            tick={{ fontSize: 11, fill: '#6b7280' }} 
                            axisLine={{ stroke: '#e5e7eb' }}
                            label={{ value: '₹ Thousand Crores', position: 'insideBottom', offset: -5, style: { fontSize: 11, fill: '#6b7280' } }}
                        />
                        <YAxis 
                            type="category" 
                            dataKey="name" 
                            width={isMobile ? 70 : 110} 
                            tick={{ fontSize: isMobile ? 10 : 11, fontWeight: 500, fill: '#4b5563' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            interval={0}
                            tickFormatter={formatYAxis}
                        />
                        <Tooltip 
                            cursor={{fill: '#f9fafb'}}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            formatter={(value: number) => [`₹${value}k Cr`, "Amount"]}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px', fontSize: isMobile ? '11px' : '14px' }} />
                        <Bar 
                            dataKey="allocated" 
                            name="Budget Allocated" 
                            fill="#94a3b8" 
                            radius={[0, 4, 4, 0]} 
                            barSize={isMobile ? 10 : 12}
                        />
                        <Bar 
                            dataKey="spent" 
                            name="Actual Spent" 
                            radius={[0, 4, 4, 0]} 
                            barSize={isMobile ? 10 : 12}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                            ))}
                        </Bar>
                    </BarChart>
                )}
            </ResponsiveContainer> 

            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <p className="text-xs text-red-600 font-semibold mb-1">Overspending Alert</p>
                    <p className="text-sm font-bold text-gray-800">Rural Dev & Fertilizer</p>
                    <p className="text-[10px] text-gray-500">Exceeded budget due to high demand</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <p className="text-xs text-green-600 font-semibold mb-1">Efficiency Target</p>
                    <p className="text-sm font-bold text-gray-800">~95% Utilization</p>
                    <p className="text-[10px] text-gray-500">Across major welfare schemes</p>
                </div>
            </div>
        </div>
    );
}
