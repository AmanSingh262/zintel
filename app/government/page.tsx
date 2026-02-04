"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BudgetAllocationChart } from "@/components/government/BudgetAllocationChart";
import { TaxCollectionChart } from "@/components/government/TaxCollectionChart";
import { RevenueExpenditureChart } from "@/components/government/RevenueExpenditureChart";
import { WelfareSpendingChart } from "@/components/government/WelfareSpendingChart";
import { CentralStateToggle } from "@/components/ui/CentralStateToggle";
import budgetApi from "@/lib/budget-api";

// All Indian States and Union Territories
const ALL_STATES = [
    "All States",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
];

export default function GovernmentPage() {
    const [selectedYear, setSelectedYear] = useState("2024");
    const [selectedState, setSelectedState] = useState("All States");
    const [viewMode, setViewMode] = useState<"central" | "state">("central");
    const [budgetData, setBudgetData] = useState<any>(null);
    const [stateBudgets, setStateBudgets] = useState<any>({});
    const [sectorAllocation, setSectorAllocation] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState<string>("loading");

    // Central Data: Union Budget with Ministry-wise Allocations (in Crore ₹)
    const unionBudgetMinistries = budgetData?.ministries || [];
    
    const totalUnionBudget = budgetData?.totalBudget || 0;

    // Top 7 for chart visualization
    const unionBudgetData = unionBudgetMinistries.length > 0 
        ? unionBudgetMinistries.slice(0, 7).map((m: any) => ({
            name: m.ministry.replace('Ministry of ', ''),
            value: m.allocation,
            color: m.color,
            realValue: `₹${(m.allocation / 100000).toFixed(2)} Lakh Cr`,
            amount: `₹${(m.allocation / 100000).toFixed(2)} Lakh Cr`
        }))
        : [];

    // State Data: Aggregate State Budgets (in Thousand Crore ₹)
    const getStateBudgetData = () => {
        if (selectedState === "All States") {
            // Return Sector Allocation for "All States" view (Creative Visualization)
            return sectorAllocation.length > 0 ? sectorAllocation : (budgetData?.states?.aggregate || []);
        } else {
            // Individual state budget from API
            return stateBudgets[selectedState] || [];
        }
    };

    const currentBudgetData = viewMode === "central" ? unionBudgetData : getStateBudgetData();

    // Fetch budget data from API
    useEffect(() => {
        const fetchBudgetData = async () => {
            setIsLoading(true);
            try {
                const year = parseInt(selectedYear);
                // Fetch from Python Government & Finance server with year parameter
                const [budgetOverview, ministries, revenue, states, economicIndicators, sectors] = await Promise.all([
                    fetch(budgetApi.budgetOverview(year)).then(r => r.json()),
                    fetch(budgetApi.budgetMinistries(year)).then(r => r.json()),
                    fetch(budgetApi.revenueSummary(year)).then(r => r.json()),
                    fetch(budgetApi.statesBudgets(year)).then(r => r.json()),
                    fetch(budgetApi.economyIndicators()).then(r => r.json()),
                    fetch(budgetApi.budgetStatesSectors()).then(r => r.json().catch(() => ({ data: [] })))
                ]);

                if (sectors && sectors.data) {
                    setSectorAllocation(sectors.data);
                }

                // Transform data for charts
                const totalBudget = budgetOverview.total_budget;
                
                const transformedData = {
                    totalBudget: totalBudget,
                    totalSpent: budgetOverview.total_spent,
                    utilization: budgetOverview.utilization_percentage,
                    ministries: ministries.ministries.map((m: any, idx: number) => {
                        const percentage = ((m.allocation / totalBudget) * 100).toFixed(1);
                        return {
                            ministry: m.ministry,
                            allocation: m.allocation,
                            spent: m.spent,
                            utilization: m.utilization_percentage,
                            category: m.category,
                            percentage: percentage,
                            color: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#a855f7', '#14b8a6', '#6366f1', '#eab308', '#f43f5e'][idx % 14]
                        };
                    }),
                    revenue: revenue,
                    states: {
                        aggregate: states.states.slice(0, 10).map((s: any) => ({
                            name: s.state.substring(0, 15) + (s.state.length > 15 ? '...' : ''),
                            value: s.budget / 1000, // Convert to thousands of crores for display
                            fullName: s.state,
                            perCapita: s.per_capita_budget,
                            population: s.population_crore,
                            gdpGrowth: s.gdp_growth_rate
                        })),
                        byState: {} as Record<string, any[]>
                    },
                    economicIndicators: economicIndicators.indicators
                };

                // Fetch individual state data if a specific state is selected
                if (selectedState !== "All States") {
                    try {
                        const year = parseInt(selectedYear);
                        const stateData = await fetch(budgetApi.stateData(selectedState, year)).then(r => r.json());
                        
                        // Use sector allocation if available (Creative Feature), else fallback to total
                        if (stateData.sector_allocation && stateData.sector_allocation.length > 0) {
                            transformedData.states.byState[selectedState] = stateData.sector_allocation;
                        } else {
                            transformedData.states.byState[selectedState] = [{
                                name: 'Total Budget',
                                value: stateData.total_budget / 1000,
                                fullName: stateData.state,
                                perCapita: stateData.per_capita_budget,
                                population: stateData.population_crore,
                                gdpGrowth: stateData.gdp_growth_rate
                            }];
                        }
                    } catch (err) {
                        console.log('Could not fetch state-specific data:', err);
                    }
                }

                setBudgetData(transformedData);
                setStateBudgets(transformedData.states.byState);
                setDataSource("live-api");
            } catch (err) {
                console.error("Failed to fetch budget data from Python server:", err);
                setDataSource("error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBudgetData();

        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchBudgetData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [selectedYear, viewMode, selectedState]);

    return (
        <DashboardLayout>
            <div className="container mx-auto px-6 py-8 max-w-7xl">
                {/* Hero Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2">
                            Government & Finance
                        </h1>
                        <p className="text-gray-600 max-w-2xl">
                            {viewMode === 'central'
                                ? "Analysis of Union Budget, Central Revenues & National Expenditure"
                                : "Insights into State Budgets, Local Expenditures & Fiscal Health"}
                        </p>
                    </div>
                </div>

                {/* Controls Row */}
                <div className="flex flex-col md:flex-row gap-6 mb-8 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <CentralStateToggle
                        viewMode={viewMode}
                        onToggle={setViewMode}
                    />

                    <div className="h-8 w-px bg-gray-300 hidden md:block"></div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm w-full md:w-auto"
                        >
                            <option>2026</option>
                            <option>2025</option>
                            <option>2024</option>
                            <option>2023</option>
                            <option>2022</option>
                        </select>

                        {viewMode === 'state' && (
                            <select
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm w-full md:w-auto animate-fade-in"
                            >
                                {ALL_STATES.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                {/* Data Source Notice */}
                {!isLoading && (
                    <div className={`mb-6 p-4 rounded-lg border ${
                        dataSource === 'live-api' ? 'bg-green-50 border-green-200' :
                        dataSource === 'fallback' ? 'bg-yellow-50 border-yellow-200' :
                        dataSource === 'error' ? 'bg-red-50 border-red-200' :
                        'bg-blue-50 border-blue-200'
                    }`}>
                        <div className="flex items-center gap-3">
                            {dataSource === 'live-api' && <span className="text-2xl">🇮🇳</span>}
                            {dataSource === 'fallback' && <span className="text-2xl">⚠️</span>}
                            {dataSource === 'error' && <span className="text-2xl">❌</span>}
                            <div>
                                {dataSource === 'live-api' && (
                                    <>
                                        <p className="font-semibold text-green-800">Official Union Budget Data - Ministry of Finance, GOI</p>
                                        <p className="text-sm text-green-700">
                                            Showing authentic Union Budget {selectedYear}-{parseInt(selectedYear)+1} with {budgetData?.ministries?.length || 0} major ministries and {budgetData?.states?.aggregate?.length || 0} states/UTs based on official government allocations
                                        </p>
                                    </>
                                )}
                                {dataSource === 'fallback' && (
                                    <>
                                        <p className="font-semibold text-yellow-800">Using Reference Data</p>
                                        <p className="text-sm text-yellow-700">API unavailable. Showing official Union Budget 2024-25 figures as reference</p>
                                    </>
                                )}
                                {dataSource === 'error' && (
                                    <>
                                        <p className="font-semibold text-red-800">Server Connection Error</p>
                                        <p className="text-sm text-red-700">Unable to connect to budget data server (port 8002). Please ensure the Python server is running.</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="mb-6 card">
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                            <span className="ml-4 text-gray-600">Loading budget data...</span>
                        </div>
                    </div>
                )}

                {/* Total Budget Display */}
                {viewMode === 'state' && selectedState !== "All States" && (
                    <>
                        <div className="mb-6 card bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedState} State Budget {selectedYear}-{parseInt(selectedYear) + 1}</h3>
                                    <p className="text-sm text-gray-600">Total State Budget Allocation</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-bold text-purple-600">
                                        ₹{(currentBudgetData.reduce((sum: number, item: any) => sum + item.value, 0) / 100).toFixed(2)} Lakh Cr
                                    </p>
                                    <p className="text-xs text-gray-500">Total Expenditure (Revenue + Capital)</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-purple-200">
                                <div>
                                    <p className="text-xs text-gray-600">Revenue Budget</p>
                                    <p className="text-lg font-bold text-gray-900">₹{((currentBudgetData.reduce((sum: number, item: any) => sum + item.value, 0) * 0.7) / 100).toFixed(2)} L Cr</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Capital Budget</p>
                                    <p className="text-lg font-bold text-gray-900">₹{((currentBudgetData.reduce((sum: number, item: any) => sum + item.value, 0) * 0.3) / 100).toFixed(2)} L Cr</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Top Sector</p>
                                    <p className="text-lg font-bold text-green-600">Social Welfare</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Central Share</p>
                                    <p className="text-lg font-bold text-orange-600">45%</p>
                                </div>
                            </div>
                        </div>

                        {/* State Department-wise Table */}
                        <div className="mb-6 card">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">💰 {selectedState} Department-wise Allocations {selectedYear}-{parseInt(selectedYear) + 1}</h3>
                            <p className="text-sm text-gray-600 mb-4">Sector-wise budget allocation showing spending priorities of {selectedState}</p>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Sector/Department</th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-700">Allocation (Crore ₹)</th>
                                            <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentBudgetData.map((item: any, index: number) => (
                                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-3 px-4 font-semibold text-gray-600">{index + 1}</td>
                                                <td className="py-3 px-4">
                                                    <span className="font-medium text-gray-900">{item.name}</span>
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono text-sm text-gray-700">
                                                    ₹{item.value.toLocaleString('en-IN')}
                                                </td>
                                                <td className="py-3 px-4 text-right font-bold text-purple-600">
                                                    {item.amount}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-gray-300 bg-gray-50">
                                            <td colSpan={2} className="py-3 px-4 font-bold text-gray-900">Total Budget</td>
                                            <td className="py-3 px-4 text-right font-mono text-sm font-bold text-gray-900">
                                                ₹{currentBudgetData.reduce((sum: number, item: any) => sum + item.value, 0).toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-3 px-4 text-right font-bold text-purple-600 text-lg">
                                                ₹{(currentBudgetData.reduce((sum: number, item: any) => sum + item.value, 0) / 100).toFixed(2)} Lakh Cr
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div className="mt-4 p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">👉 Note:</span> Data sourced from data.gov.in API. State budget figures include both revenue and capital expenditure across all departments and welfare schemes.
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {viewMode === 'central' && (
                    <div className="mb-6 card bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">Union Budget {selectedYear}-{parseInt(selectedYear) + 1}</h3>
                                <p className="text-sm text-gray-600">Presented by Finance Minister Nirmala Sitharaman</p>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-bold text-indigo-600">
                                    ₹{(totalUnionBudget / 100000).toFixed(2)} Lakh Cr
                                </p>
                                <p className="text-xs text-gray-500">Total Expenditure (Revenue + Capital)</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-indigo-200">
                            <div>
                                <p className="text-xs text-gray-600">Total Ministries</p>
                                <p className="text-lg font-bold text-gray-900">90+</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Top 3 Allocation</p>
                                <p className="text-lg font-bold text-gray-900">56.2%</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Defence Budget</p>
                                <p className="text-lg font-bold text-orange-600">₹6.22 Lakh Cr</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">State Transfers</p>
                                <p className="text-lg font-bold text-green-600">₹18.58 Lakh Cr</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ministry-wise Allocation Table - Central View */}
                {viewMode === 'central' && !isLoading && (
                    <>
                        {unionBudgetMinistries.length === 0 ? (
                            <div className="mb-6 card">
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg mb-2">No budget data available</p>
                                    <p className="text-gray-400 text-sm">Waiting for data.gov.in API response</p>
                                </div>
                            </div>
                        ) : (
                    <div className="mb-6 card">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">💰 Major Ministry Allocations {selectedYear}-{parseInt(selectedYear) + 1}</h3>
                        <p className="text-sm text-gray-600 mb-4">Top ministry allocations showing how the Union Budget is distributed across government departments</p>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Ministry</th>
                                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Allocation (Crore ₹)</th>
                                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                                        <th className="text-right py-3 px-4 font-semibold text-gray-700">% of Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unionBudgetMinistries.map((ministry: any, index: number) => (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 font-semibold text-gray-600">{index + 1}</td>
                                            <td className="py-3 px-4">
                                                <span className="font-medium text-gray-900">{ministry.ministry}</span>
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono text-sm text-gray-700">
                                                ₹{ministry.allocation.toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-3 px-4 text-right font-bold text-indigo-600">
                                                ₹{(ministry.allocation / 100000).toFixed(2)} Lakh Cr
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                                                    {ministry.percentage}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-gray-300 bg-gray-50">
                                        <td colSpan={2} className="py-3 px-4 font-bold text-gray-900">Total Budget</td>
                                        <td className="py-3 px-4 text-right font-mono text-sm font-bold text-gray-900">
                                            ₹{totalUnionBudget.toLocaleString('en-IN')}
                                        </td>
                                        <td className="py-3 px-4 text-right font-bold text-indigo-600 text-lg">
                                            ₹{(totalUnionBudget / 100000).toFixed(2)} Lakh Cr
                                        </td>
                                        <td className="py-3 px-4 text-right font-bold text-gray-900">100%</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold">👉 Note:</span> These figures show how the total expenditure of the Union Budget {selectedYear}-{parseInt(selectedYear) + 1} 
                                is spread across major government ministries and reflect the scale of allocations for different areas of governance and development.
                            </p>
                        </div>
                    </div>
                        )}
                    </>
                )}

                {/* 2x2 Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Budget Allocation - Dynamic */}
                    <div className="relative">
                        <BudgetAllocationChart
                            key={viewMode}
                            year={selectedYear}
                            data={currentBudgetData}
                        />
                        <span className={`absolute top-6 right-6 px-2 py-1 text-xs font-bold rounded ${viewMode === 'central' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                            {viewMode === 'central' ? "UNION BUDGET" : "STATE BUDGET"}
                        </span>
                    </div>

                    {/* State-wise Tax Collection - Only show if relevant or keep as static/example for now */}
                    <TaxCollectionChart />

                    {/* Revenue vs. Expenditure */}
                    <RevenueExpenditureChart />

                    {/* Welfare Spending */}
                    <WelfareSpendingChart />
                </div>
            </div>
        </DashboardLayout>
    );
}
