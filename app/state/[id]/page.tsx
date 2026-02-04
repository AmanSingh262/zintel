'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getStateMetadata } from '@/lib/data/state-metadata';
import { formatNumberToCrores, formatPercentage, formatIndianCurrency } from '@/lib/utils/formatters';
import { ZINTEL_COLORS } from '@/lib/constants/colors';

interface StateData {
    success: boolean;
    state: string;
    data: Record<string, any[]>;
    source: string;
    lastUpdated: string;
    count: number;
    categories: string[];
}

/**
 * State Deep-Dive Page
 * Shows detailed insights for a specific state with live API data
 */
export default function StatePage() {
    const params = useParams();
    const id = params?.id as string;
    const stateId = id?.toUpperCase();
    const state = getStateMetadata(stateId);
    
    const [apiData, setApiData] = useState<StateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!state) return;

        const fetchStateData = async () => {
            try {
                setLoading(true);
                const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
                const res = await fetch(`/api/data/state/${stateSlug}`);
                const data = await res.json();
                
                console.log('State API Response:', data);
                
                if (data.success) {
                    setApiData(data);
                } else {
                    setError(data.message || 'Failed to fetch state data');
                }
            } catch (err) {
                console.error('Error fetching state data:', err);
                setError('Failed to load state data');
            } finally {
                setLoading(false);
            }
        };

        fetchStateData();
    }, [state]);

    // Helper function to extract indicator value from API data
    const getIndicatorValue = (indicatorName: string, category?: string): string | number => {
        if (!apiData?.data) return 'N/A';
        
        for (const cat in apiData.data) {
            if (category && cat !== category) continue;
            
            const indicators = apiData.data[cat];
            const found = indicators.find((ind: any) => 
                ind.indicator.toLowerCase().includes(indicatorName.toLowerCase())
            );
            
            if (found) {
                return found.value;
            }
        }
        
        return 'N/A';
    };

    // Get population - use static metadata (API data will be used when available)
    const getPopulation = () => {
        if (loading) return state?.population || 0;
        
        const apiPop = getIndicatorValue('population');
        if (apiPop !== 'N/A' && typeof apiPop === 'number' && apiPop > 0) {
            return apiPop / 10000000; // Convert to crores
        }
        return state?.population || 0; // Use static metadata
    };

    // Get literacy - use static metadata (API data will be used when available)
    const getLiteracy = () => {
        if (loading) return state?.literacy || 0;
        
        const apiLit = getIndicatorValue('literacy');
        if (apiLit !== 'N/A' && typeof apiLit === 'number' && apiLit > 0) {
            return apiLit;
        }
        return state?.literacy || 0; // Use static metadata
    };

    if (!state) {
        return (
            <DashboardLayout>
                <div className="container mx-auto px-6 py-8">
                    <h1 className="text-2xl font-bold">State not found</h1>
                    <Link href="/" className="text-blue-600 hover:underline">
                        ← Back to Map
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-6 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            ← Back to Map
                        </Link>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">
                        {state?.name || 'Unknown'}
                    </h1>
                    <p className="text-lg text-gray-600">
                        Capital: {state?.capital || 'Unknown'}
                    </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* GDP Card */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border-2 hover:shadow-xl transition-shadow"
                        style={{ borderColor: ZINTEL_COLORS.primary.purple }}>
                        <div className="text-sm text-gray-600 mb-2">Gross Domestic Product</div>
                        <div className="text-3xl font-bold mb-1" style={{ color: ZINTEL_COLORS.primary.purple }}>
                            ₹{(state?.gdp || 0).toLocaleString('en-IN')} Cr
                        </div>
                        <div className="text-xs text-gray-500">Annual GDP</div>
                    </div>

                    {/* Population Card */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border-2 hover:shadow-xl transition-shadow"
                        style={{ borderColor: ZINTEL_COLORS.primary.green }}>
                        <div className="text-sm text-gray-600 mb-2">Total Population</div>
                        <div className="text-3xl font-bold mb-1" style={{ color: ZINTEL_COLORS.primary.green }}>
                            {getPopulation().toFixed(2)} Cr
                        </div>
                        <div className="text-xs text-gray-500">Census 2021</div>
                    </div>

                    {/* Literacy Card */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-500 hover:shadow-xl transition-shadow">
                        <div className="text-sm text-gray-600 mb-2">Literacy Rate</div>
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                            {getLiteracy().toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">Census 2021</div>
                    </div>

                    {/* Area Card */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-500 hover:shadow-xl transition-shadow">
                        <div className="text-sm text-gray-600 mb-2">Total Area</div>
                        <div className="text-3xl font-bold text-orange-600 mb-1">
                            {(state?.area || 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-gray-500">Square Kilometers</div>
                    </div>
                </div>

                {/* Detailed Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Economic Overview */}
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Economic Overview</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                <span className="text-gray-700">GDP (Crores)</span>
                                <span className="font-bold text-gray-900">₹{(state?.gdp || 0).toLocaleString('en-IN')} Cr</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                <span className="text-gray-700">Per Capita Income</span>
                                <span className="font-bold text-gray-900">
                                    {formatIndianCurrency(((state?.gdp || 0) * 10000000) / ((state?.population || 1) * 10000000))}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Economic Rank</span>
                                <span className="font-bold text-gray-900">Coming Soon</span>
                            </div>
                        </div>
                    </div>

                    {/* Demographics */}
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Demographics</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                <span className="text-gray-700">Population</span>
                                <span className="font-bold text-gray-900">
                                    {getPopulation().toFixed(2)} Cr
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                <span className="text-gray-700">Literacy Rate</span>
                                <span className="font-bold text-gray-900">
                                    {getLiteracy().toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Population Density</span>
                                <span className="font-bold text-gray-900">
                                    {Math.round((getPopulation() * 10000000) / (state?.area || 1)).toLocaleString('en-IN')} /km²
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coming Soon Section */}
                <div className="mt-8 bg-gradient-to-r from-purple-50 to-green-50 rounded-xl p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Live Data from data.gov.in</h3>
                    <p className="text-gray-600 mb-4">
                        {loading ? 'Loading live data...' : error ? error : `${apiData?.count || 0} indicators available`}
                    </p>
                    
                    {apiData && !loading && apiData.categories && apiData.categories.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-lg font-bold text-gray-900 mb-4">Available Categories</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {apiData.categories.map((category, idx) => (
                                    <div key={idx} className="bg-white rounded-lg p-4 shadow-md">
                                        <div className="font-semibold text-sm text-gray-900">{category}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {apiData.data[category]?.length || 0} indicators
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-6 text-sm text-gray-600">
                                <span className="font-semibold">Last Updated:</span>{' '}
                                {new Date(apiData.lastUpdated).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                Source: {apiData.source}
                            </div>
                        </div>
                    )}
                    
                    <div className="flex gap-4 justify-center flex-wrap mt-6">
                        <span className="px-4 py-2 bg-white rounded-lg shadow text-sm font-semibold text-gray-700">
                            📊 Sector Analysis
                        </span>
                        <span className="px-4 py-2 bg-white rounded-lg shadow text-sm font-semibold text-gray-700">
                            📈 Growth Trends
                        </span>
                        <span className="px-4 py-2 bg-white rounded-lg shadow text-sm font-semibold text-gray-700">
                            🏭 Industry Data
                        </span>
                        <span className="px-4 py-2 bg-white rounded-lg shadow text-sm font-semibold text-gray-700">
                            🌾 Agriculture Stats
                        </span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
