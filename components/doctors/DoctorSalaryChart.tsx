"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import budgetApi from "@/lib/budget-api";

interface SalaryData {
    state: string;
    Healthcare: number;
    "IT & Tech": number;
    Manufacturing: number;
    Education: number;
    Agriculture: number;
    Finance: number;
    Retail: number;
    Construction: number;
}

interface Stats {
    highest_paying_sector: string;
    avg_national_salary: string;
    top_state: string;
    fastest_growing: string;
}

const SECTOR_COLORS: { [key: string]: string } = {
    "Healthcare": "#ef4444",
    "IT & Tech": "#8b5cf6",
    "Manufacturing": "#3b82f6",
    "Education": "#f59e0b",
    "Agriculture": "#10b981",
    "Finance": "#ec4899",
    "Retail": "#06b6d4",
    "Construction": "#f97316"
};

export function DoctorSalaryChart() {
    const [data, setData] = useState<SalaryData[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [selectedSector, setSelectedSector] = useState<string>("Healthcare");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Set initial mobile state
        setIsMobile(window.innerWidth < 768);
        
        // Handle window resize
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        
        fetchData();
        // Auto-refresh every 20 minutes
        const interval = setInterval(fetchData, 1200000);
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(budgetApi.salarySectorWiseByState());
            if (!response.ok) throw new Error("Failed to fetch data");
            const result = await response.json();
            console.log("API Response:", result);
            console.log("Data length:", result.data?.length);
            console.log("First item:", result.data?.[0]);
            
            if (result.data && result.data.length > 0) {
                setData(result.data);
                setStats(result.stats);
                setLastUpdated(result.updated);
            } else {
                throw new Error("No data received from API");
            }
        } catch (err) {
            console.error("Error fetching salary data:", err);
            setError(err instanceof Error ? err.message : "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const getTopStates = () => {
        const sorted = [...data].sort((a, b) => {
            const sectorKey = selectedSector as keyof SalaryData;
            return (b[sectorKey] as number) - (a[sectorKey] as number);
        });
        return sorted.slice(0, 10);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-bold text-gray-900 mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-gray-700">{entry.name}:</span>
                            <span className="font-bold" style={{ color: entry.color }}>
                                ₹{entry.value.toFixed(1)} Lakhs
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-black uppercase mb-6">Sector-wise Average Salary Across States</h3>
                <div className="h-[300px] md:h-[400px] flex items-center justify-center">
                    <div className="animate-pulse text-gray-400">Loading real-time salary data...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-black uppercase mb-6">Sector-wise Average Salary Across States</h3>
                <div className="h-[300px] md:h-[400px] flex items-center justify-center text-red-500">
                    Error: {error}
                </div>
            </div>
        );
    }

    const topStates = getTopStates();
    const allSectors = Object.keys(SECTOR_COLORS);
    
    console.log("Selected Sector:", selectedSector);
    console.log("Top States Data:", topStates);
    console.log("All Sectors Array:", allSectors);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-lg md:text-2xl font-black uppercase mb-1">
                    Sector-wise Average Salary Across States
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                    Compare salaries in Lakhs (₹) across major employment sectors
                </p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg">
                        <div className="text-[10px] md:text-xs text-purple-700 font-semibold">Highest Paying</div>
                        <div className="text-xs md:text-sm font-black text-purple-900">{stats.highest_paying_sector}</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
                        <div className="text-[10px] md:text-xs text-blue-700 font-semibold">National Avg</div>
                        <div className="text-xs md:text-sm font-black text-blue-900">{stats.avg_national_salary}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
                        <div className="text-[10px] md:text-xs text-green-700 font-semibold">Top State</div>
                        <div className="text-xs md:text-sm font-black text-green-900">{stats.top_state}</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg">
                        <div className="text-[10px] md:text-xs text-orange-700 font-semibold">Fastest Growth</div>
                        <div className="text-xs md:text-sm font-black text-orange-900">{stats.fastest_growing}</div>
                    </div>
                </div>
            )}

            {/* Sector Filter Buttons */}
            <div className="mb-4 flex flex-wrap gap-2">
                {allSectors.map((sector) => (
                    <button
                        key={sector}
                        onClick={() => setSelectedSector(sector)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            selectedSector === sector
                                ? "text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        style={{
                            backgroundColor: selectedSector === sector ? SECTOR_COLORS[sector] : undefined
                        }}
                    >
                        {sector}
                    </button>
                ))}
            </div>

            {/* Chart */}
            <div className="w-full">
                <ResponsiveContainer width="100%" height={isMobile ? 300 : 500}>
                    <BarChart 
                        data={topStates} 
                        margin={{ top: 15, right: 5, bottom: isMobile ? 28 : 100, left: isMobile ? 20 : 50 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="state"
                            angle={-45}
                            textAnchor="end"
                            tick={{ fill: "#6b7280", fontSize: isMobile ? 7 : 11 }}
                            axisLine={{ stroke: "#e5e7eb" }}
                            height={isMobile ? 28 : 100}
                            interval={0}
                        />
                        <YAxis
                            tick={{ fill: "#6b7280", fontSize: isMobile ? 9 : 11 }}
                            axisLine={{ stroke: "#e5e7eb" }}
                            domain={[0, 'auto']}
                            label={{
                                value: "Salary (₹ Lakhs)",
                                angle: -90,
                                position: "insideLeft",
                                style: { fill: "#6b7280", fontWeight: 600, fontSize: isMobile ? 10 : 12 }
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey={selectedSector}
                            fill={SECTOR_COLORS[selectedSector]}
                            radius={[8, 8, 0, 0]}
                        >
                            {topStates.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={SECTOR_COLORS[selectedSector]}
                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Footer */}
            <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-gray-500">
                <span className="text-[10px] md:text-xs">Source: Ministry of Labour & Employment 2024-25</span>
                {lastUpdated && (
                    <span className="text-[10px] md:text-xs text-purple-600 font-semibold">Updated: {lastUpdated}</span>
                )}
            </div>
        </div>
    );
}
