"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ZINTEL_COLORS } from '@/lib/constants/colors';
import { getStateMetadata, StateMetadata } from '@/lib/data/state-metadata';
import { formatNumberToCrores, formatPercentage } from '@/lib/utils/formatters';

interface StateSnapshotProps {
    state: StateMetadata;
    position: { x: number; y: number };
}

/**
 * Snapshot card that appears on hover
 */
function StateSnapshot({ state, position }: StateSnapshotProps) {
    return (
        <div
            className="absolute bg-white rounded-xl shadow-2xl p-4 border-2 z-50 pointer-events-none"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -120%)',
                minWidth: '250px',
                borderColor: ZINTEL_COLORS.primary.green
            }}
        >
            <h3 className="font-bold text-lg text-gray-900 mb-2">{state.name}</h3>
            <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">GDP:</span>
                    <span className="font-semibold" style={{ color: ZINTEL_COLORS.primary.purple }}>
                        ₹{formatNumberToCrores(state.gdp)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Population:</span>
                    <span className="font-semibold text-gray-900">
                        {formatNumberToCrores(state.population)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Literacy:</span>
                    <span className="font-semibold" style={{ color: ZINTEL_COLORS.primary.green }}>
                        {formatPercentage(state.literacy)}
                    </span>
                </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                Click to view detailed insights
            </div>
        </div>
    );
}

/**
 * Simplified Interactive India Map Component
 * Uses a grid-based representation of Indian states
 */
interface IndiaInteractiveMapProps {
    layer?: 'default' | 'poverty' | 'climate';
}

export function IndiaInteractiveMap({ layer = 'default' }: IndiaInteractiveMapProps) {
    const router = useRouter();
    const [hoveredState, setHoveredState] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Major states for simplified grid layout
    const majorStates = [
        { id: 'JK', name: 'J&K', row: 1, col: 2 },
        { id: 'HP', name: 'HP', row: 2, col: 2 },
        { id: 'PB', name: 'Punjab', row: 2, col: 3 },
        { id: 'HR', name: 'Haryana', row: 3, col: 3 },
        { id: 'DL', name: 'Delhi', row: 3, col: 4 },
        { id: 'UT', name: 'Uttarakhand', row: 2, col: 4 },
        { id: 'RJ', name: 'Rajasthan', row: 4, col: 2 },
        { id: 'UP', name: 'Uttar Pradesh', row: 4, col: 4 },
        { id: 'GJ', name: 'Gujarat', row: 5, col: 1 },
        { id: 'MP', name: 'Madhya Pradesh', row: 5, col: 3 },
        { id: 'BR', name: 'Bihar', row: 4, col: 6 },
        { id: 'WB', name: 'West Bengal', row: 5, col: 6 },
        { id: 'JH', name: 'Jharkhand', row: 5, col: 5 },
        { id: 'OR', name: 'Odisha', row: 6, col: 5 },
        { id: 'CT', name: 'Chhattisgarh', row: 6, col: 4 },
        { id: 'MH', name: 'Maharashtra', row: 6, col: 2 },
        { id: 'TG', name: 'Telangana', row: 7, col: 3 },
        { id: 'AP', name: 'Andhra Pradesh', row: 7, col: 4 },
        { id: 'KA', name: 'Karnataka', row: 7, col: 2 },
        { id: 'GA', name: 'Goa', row: 7, col: 1 },
        { id: 'KL', name: 'Kerala', row: 8, col: 2 },
        { id: 'TN', name: 'Tamil Nadu', row: 8, col: 3 },
        { id: 'AS', name: 'Assam', row: 3, col: 7 },
        { id: 'AR', name: 'Arunachal', row: 2, col: 8 },
        { id: 'MN', name: 'Manipur', row: 4, col: 8 },
        { id: 'ML', name: 'Meghalaya', row: 4, col: 7 },
        { id: 'MZ', name: 'Mizoram', row: 5, col: 8 },
        { id: 'NL', name: 'Nagaland', row: 3, col: 8 },
        { id: 'SK', name: 'Sikkim', row: 3, col: 6 },
        { id: 'TR', name: 'Tripura', row: 5, col: 7 },
    ];

    // MPI Data (Multidimensional Poverty Index) - Lower is better
    const MPI_DATA: Record<string, { score: number; color: string }> = {
        'BR': { score: 0.26, color: '#ef4444' }, // Bihar - High (Red)
        'JH': { score: 0.23, color: '#ef4444' }, // Jharkhand - High
        'UP': { score: 0.18, color: '#f97316' }, // UP - Med-High (Orange)
        'MP': { score: 0.15, color: '#f97316' },
        'RJ': { score: 0.12, color: '#eab308' }, // Rajasthan - Medium (Yellow)
        'MH': { score: 0.06, color: '#10b981' },
        'TN': { score: 0.02, color: '#10b981' },
        'KL': { score: 0.005, color: '#059669' }, // Kerala - Low (Dark Green)
        'DL': { score: 0.03, color: '#10b981' },
    };

    // CRI Data (Climate Risk Index) - Higher is worse (Red)
    const CRI_DATA: Record<string, { score: number; color: string }> = {
        'OR': { score: 95, color: '#b91c1c' }, // Odisha (Cyclones) - Critical
        'WB': { score: 92, color: '#b91c1c' }, // West Bengal - Critical
        'AS': { score: 88, color: '#ef4444' }, // Assam (Floods) - High
        'RJ': { score: 85, color: '#ef4444' }, // Rajasthan (Heat) - High
        'MH': { score: 75, color: '#f97316' }, // Maharashtra - Medium
        'KL': { score: 72, color: '#f97316' }, // Kerala - Medium
        'GJ': { score: 70, color: '#f97316' },
        'UP': { score: 65, color: '#eab308' },
        'KA': { score: 40, color: '#10b981' }, // Low Risk relative
    };

    const getLayerColor = (stateId: string, isHovered: boolean) => {
        if (layer === 'poverty') {
            const data = MPI_DATA[stateId];
            if (data) return data.color;
            return '#e5e7eb';
        }
        if (layer === 'climate') {
            const data = CRI_DATA[stateId];
            if (data) return data.color;
            return '#e5e7eb';
        }
        // Default View
        return isHovered ? ZINTEL_COLORS.primary.green : '#e5e7eb';
    };

    const handleMouseEnter = (stateId: string, event: React.MouseEvent) => {
        setHoveredState(stateId);
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (hoveredState) {
            setMousePosition({ x: event.clientX, y: event.clientY });
        }
    };

    const handleMouseLeave = () => {
        setHoveredState(null);
    };

    const handleClick = (stateId: string) => {
        const stateMetadata = getStateMetadata(stateId);
        if (stateMetadata) {
            router.push(`/state/${stateMetadata.id.toLowerCase()}`);
        }
    };

    const hoveredStateData = hoveredState ? getStateMetadata(hoveredState) : null;

    return (
        <div
            className="relative w-full h-full min-h-[600px] bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl overflow-hidden p-6"
            onMouseMove={handleMouseMove}
        >
            {/* Map Title */}
            <div className="mb-6">
                <h2 className="text-3xl font-black text-gray-900 mb-1">
                    Explore India
                </h2>
                <p className="text-sm text-gray-600">
                    Hover over states to see key metrics • Click to explore in detail
                </p>
            </div>

            {/* Grid-based Map */}
            <div className="relative" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gridTemplateRows: 'repeat(8, 1fr)',
                gap: '8px',
                height: '500px',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                {majorStates.map((state) => {
                    const isHovered = hoveredState === state.id;
                    const stateData = getStateMetadata(state.id);

                    return (
                        <div
                            key={state.id}
                            className="rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center text-xs font-semibold shadow-md hover:shadow-xl"
                            style={{
                                gridRow: state.row,
                                gridColumn: state.col,
                                backgroundColor: getLayerColor(state.id, isHovered),
                                color: (isHovered || (layer === 'poverty' && MPI_DATA[state.id]) || (layer === 'climate' && CRI_DATA[state.id])) ? 'white' : '#374151',
                                border: `2px solid ${isHovered ? '#000000' : '#d1d5db'}`,
                                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                            }}
                            onMouseEnter={(e) => handleMouseEnter(state.id, e)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleClick(state.id)}
                        >
                            {state.name}
                        </div>
                    );
                })}
            </div>

            {/* Snapshot Card */}
            {hoveredStateData && (
                <StateSnapshot
                    state={hoveredStateData}
                    position={mousePosition}
                />
            )}

            {/* Legend */}
            <div className="absolute bottom-6 right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                <h4 className="font-bold text-sm text-gray-900 mb-2">Map Legend</h4>
                <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: ZINTEL_COLORS.primary.green }}
                        />
                        <span className="text-gray-700">Highlighted State</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gray-300" />
                        <span className="text-gray-700">Other States</span>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    <p className="font-semibold mb-1">30 Major States Shown</p>
                    <p>Click any state for detailed data</p>
                </div>
            </div>
        </div>
    );
}
