"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface StateRegion {
    id: string;
    name: string;
    coords: string; // Coordinates for map area
    shape: 'poly' | 'circle' | 'rect';
}

interface IndiaMapSVGProps {
    layer?: 'default' | 'poverty' | 'climate';
}

const stateNames: Record<string, string> = {
    'JK': 'Jammu & Kashmir',
    'HP': 'Himachal Pradesh',
    'PB': 'Punjab',
    'HR': 'Haryana',
    'DL': 'Delhi',
    'UK': 'Uttarakhand',
    'RJ': 'Rajasthan',
    'GJ': 'Gujarat',
    'UP': 'Uttar Pradesh',
    'BR': 'Bihar',
    'JH': 'Jharkhand',
    'WB': 'West Bengal',
    'SK': 'Sikkim',
    'AR': 'Arunachal Pradesh',
    'AS': 'Assam',
    'NL': 'Nagaland',
    'MN': 'Manipur',
    'MZ': 'Mizoram',
    'TR': 'Tripura',
    'ML': 'Meghalaya',
    'OR': 'Odisha',
    'CT': 'Chhattisgarh',
    'MP': 'Madhya Pradesh',
    'MH': 'Maharashtra',
    'GA': 'Goa',
    'KA': 'Karnataka',
    'TG': 'Telangana',
    'AP': 'Andhra Pradesh',
    'TN': 'Tamil Nadu',
    'KL': 'Kerala',
};

// State boundaries overlay positions (percentage based on image)
const stateOverlays: Record<string, { top: string; left: string; width: string; height: string }> = {
    'JK': { top: '2%', left: '15%', width: '12%', height: '15%' },
    'HP': { top: '15%', left: '18%', width: '8%', height: '8%' },
    'PB': { top: '16%', left: '16%', width: '7%', height: '8%' },
    'UK': { top: '17%', left: '26%', width: '7%', height: '7%' },
    'HR': { top: '21%', left: '20%', width: '7%', height: '7%' },
    'DL': { top: '23%', left: '23%', width: '3%', height: '3%' },
    'RJ': { top: '25%', left: '10%', width: '16%', height: '22%' },
    'UP': { top: '24%', left: '26%', width: '20%', height: '16%' },
    'GJ': { top: '38%', left: '5%', width: '14%', height: '18%' },
    'MP': { top: '38%', left: '19%', width: '18%', height: '14%' },
    'CT': { top: '44%', left: '37%', width: '11%', height: '12%' },
    'BR': { top: '32%', left: '46%', width: '12%', height: '10%' },
    'JH': { top: '42%', left: '46%', width: '10%', height: '11%' },
    'WB': { top: '38%', left: '56%', width: '10%', height: '18%' },
    'SK': { top: '32%', left: '60%', width: '4%', height: '4%' },
    'AS': { top: '35%', left: '64%', width: '12%', height: '8%' },
    'AR': { top: '27%', left: '68%', width: '10%', height: '10%' },
    'NL': { top: '37%', left: '73%', width: '5%', height: '6%' },
    'MN': { top: '42%', left: '73%', width: '5%', height: '5%' },
    'MZ': { top: '46%', left: '73%', width: '4%', height: '6%' },
    'TR': { top: '44%', left: '68%', width: '5%', height: '5%' },
    'ML': { top: '40%', left: '65%', width: '6%', height: '5%' },
    'MH': { top: '52%', left: '12%', width: '20%', height: '18%' },
    'OR': { top: '52%', left: '48%', width: '12%', height: '16%' },
    'TG': { top: '58%', left: '37%', width: '9%', height: '8%' },
    'AP': { top: '64%', left: '38%', width: '12%', height: '14%' },
    'KA': { top: '68%', left: '20%', width: '16%', height: '16%' },
    'GA': { top: '70%', left: '17%', width: '4%', height: '4%' },
    'KL': { top: '78%', left: '19%', width: '7%', height: '14%' },
    'TN': { top: '78%', left: '26%', width: '14%', height: '14%' },
};

// Poverty data (MPI scores)
const povertyData: Record<string, number> = {
    'BR': 0.26, 'JH': 0.23, 'UP': 0.18, 'MP': 0.15, 'RJ': 0.12,
    'CT': 0.14, 'OR': 0.13, 'AS': 0.12, 'MH': 0.06, 'TN': 0.02, 'KL': 0.005
};

// Climate risk data
const climateData: Record<string, number> = {
    'OR': 95, 'WB': 92, 'AS': 88, 'RJ': 85, 'MH': 75, 'KL': 72, 'GJ': 70, 'UP': 65, 'KA': 40
};

export function IndiaMapSVG({ layer = 'default' }: IndiaMapSVGProps) {
    const router = useRouter();
    const [hoveredState, setHoveredState] = useState<string | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const getStateColor = (stateId: string): string => {
        if (layer === 'poverty') {
            const score = povertyData[stateId];
            if (!score) return 'rgba(229, 231, 235, 0.7)';
            if (score > 0.20) return 'rgba(239, 68, 68, 0.7)';
            if (score > 0.15) return 'rgba(249, 115, 22, 0.7)';
            if (score > 0.10) return 'rgba(234, 179, 8, 0.7)';
            if (score > 0.05) return 'rgba(16, 185, 129, 0.7)';
            return 'rgba(5, 150, 105, 0.7)';
        }
        
        if (layer === 'climate') {
            const score = climateData[stateId];
            if (!score) return 'rgba(229, 231, 235, 0.7)';
            if (score > 90) return 'rgba(185, 28, 28, 0.7)';
            if (score > 80) return 'rgba(239, 68, 68, 0.7)';
            if (score > 70) return 'rgba(249, 115, 22, 0.7)';
            if (score > 60) return 'rgba(234, 179, 8, 0.7)';
            return 'rgba(16, 185, 129, 0.7)';
        }

        return hoveredState === stateId ? 'rgba(99, 102, 241, 0.6)' : 'rgba(99, 102, 241, 0.3)';
    };

    const handleStateHover = (stateId: string) => (e: React.MouseEvent) => {
        setHoveredState(stateId);
        setTooltipPos({ x: e.clientX, y: e.clientY });
    };

    const handleStateLeave = () => {
        setHoveredState(null);
    };

    const handleStateClick = (stateId: string) => () => {
        router.push(`/state/${stateId}`);
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
            {/* Base India Map Image */}
            <div className="relative w-full h-full">
                <img
                    src="/India%20Map/India-map-en.jpg"
                    alt="India Map"
                    className="w-full h-full object-contain"
                />
                
                {/* SVG Overlay for Interactive Regions */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 1400 1600"
                    style={{ pointerEvents: 'none' }}
                >
                    {/* Jammu & Kashmir */}
                    <polygon
                        points="550,70 620,60 650,90 670,130 660,180 630,200 580,205 540,190 520,150 515,100"
                        fill="transparent"
                        stroke="transparent"
                        strokeWidth="2"
                        style={{ pointerEvents: 'all', cursor: 'pointer' }}
                        onClick={handleStateClick('JK')}
                        onMouseMove={handleStateHover('JK')}
                        onMouseLeave={handleStateLeave}
                        className="hover:fill-indigo-500/20 transition-all"
                    />
                    
                    {/* Himachal Pradesh */}
                    <polygon
                        points="580,205 620,200 640,220 635,250 600,270 570,260"
                        fill="transparent"
                        stroke="transparent"
                        strokeWidth="2"
                        style={{ pointerEvents: 'all', cursor: 'pointer' }}
                        onClick={handleStateClick('HP')}
                        onMouseMove={handleStateHover('HP')}
                        onMouseLeave={handleStateLeave}
                        className="hover:fill-indigo-500/20 transition-all"
                    />
                    
                    {/* Punjab */}
                    <polygon
                        points="540,200 570,205 570,260 550,280 520,270"
                        fill="transparent"
                        stroke="transparent"
                        strokeWidth="2"
                        style={{ pointerEvents: 'all', cursor: 'pointer' }}
                        onClick={handleStateClick('PB')}
                        onMouseMove={handleStateHover('PB')}
                        onMouseLeave={handleStateLeave}
                        className="hover:fill-indigo-500/20 transition-all"
                    />
                    
                    {/* Haryana */}
                    <polygon
                        points="550,280 570,260 600,270 615,300 595,330 565,335 540,320"
                        fill="transparent"
                        stroke="transparent"
                        strokeWidth="2"
                        style={{ pointerEvents: 'all', cursor: 'pointer' }}
                        onClick={handleStateClick('HR')}
                        onMouseMove={handleStateHover('HR')}
                        onMouseLeave={handleStateLeave}
                        className="hover:fill-indigo-500/20 transition-all"
                    />
                    
                    {/* Delhi */}
                    <circle
                        cx="585"
                        cy="305"
                        r="15"
                        fill="transparent"
                        stroke="transparent"
                        strokeWidth="2"
                        style={{ pointerEvents: 'all', cursor: 'pointer' }}
                        onClick={handleStateClick('DL')}
                        onMouseMove={handleStateHover('DL')}
                        onMouseLeave={handleStateLeave}
                        className="hover:fill-indigo-500/20 transition-all"
                    />
                    
                    {/* Uttarakhand */}
                    <polygon
                        points="635,250 660,240 695,260 710,290 690,320 615,300"
                        fill="transparent"
                        stroke="transparent"
                        strokeWidth="2"
                        style={{ pointerEvents: 'all', cursor: 'pointer' }}
                        onClick={handleStateClick('UK')}
                        onMouseMove={handleStateHover('UK')}
                        onMouseLeave={handleStateLeave}
                        className="hover:fill-indigo-500/20 transition-all"
                    />
                    
                    {/* Rajasthan */}
                    <polygon
                        points="380,280 520,270 550,280 540,320 565,385 580,470 570,560 520,620 440,610 360,570 300,510 270,430 285,350"
                        fill="transparent"
                        stroke="transparent"
                        strokeWidth="2"
                        style={{ pointerEvents: 'all', cursor: 'pointer' }}
                        onClick={handleStateClick('RJ')}
                        onMouseMove={handleStateHover('RJ')}
                        onMouseLeave={handleStateLeave}
                        className="hover:fill-indigo-500/20 transition-all"
                    />
                    
                    {/* Gujarat */}
                    <polygon
                        points="220,490 300,510 360,570 380,660 370,740 320,800 240,785 180,740 140,680 150,610 170,550"
                        fill="transparent"
                        stroke="transparent"
                        strokeWidth="2"
                        style={{ pointerEvents: 'all', cursor: 'pointer' }}
                        onClick={handleStateClick('GJ')}
                        onMouseMove={handleStateHover('GJ')}
                        onMouseLeave={handleStateLeave}
                        className="hover:fill-indigo-500/20 transition-all"
                    />
                    
                    {/* Uttar Pradesh */}
                    <polygon
                        points="565,335 690,320 800,350 900,390 960,440 970,500 940,550 870,570 780,580 700,565 620,525 570,470 550,425 540,385"
                        fill="transparent"
                        stroke="transparent"
                        strokeWidth="2"
                        style={{ pointerEvents: 'all', cursor: 'pointer' }}
                        onClick={handleStateClick('UP')}
                        onMouseMove={handleStateHover('UP')}
                        onMouseLeave={handleStateLeave}
                        className="hover:fill-indigo-500/20 transition-all"
                    />
                    
                    {/* Bihar */}
                    <polygon
                        points="940,550 1030,540 1090,560 1120,600 1110,650 1070,680 1010,690 950,665 920,615"
                        fill="transparent"
                        stroke="transparent"
                        strokeWidth="2"
                        style={{ pointerEvents: 'all', cursor: 'pointer' }}
                        onClick={handleStateClick('BR')}
                        onMouseMove={handleStateHover('BR')}
                        onMouseLeave={handleStateLeave}
                        className="hover:fill-indigo-500/20 transition-all"
                    />
                </svg>
            </div>

            {/* Tooltip */}
            {hoveredState && (
                <div
                    className="fixed bg-white rounded-lg shadow-2xl p-4 border-2 border-indigo-500 z-50 pointer-events-none"
                    style={{
                        left: `${tooltipPos.x + 15}px`,
                        top: `${tooltipPos.y - 80}px`,
                        minWidth: '220px',
                    }}
                >
                    <h3 className="font-bold text-base text-gray-900 mb-2">
                        {stateNames[hoveredState] || hoveredState}
                    </h3>
                    
                    {layer === 'poverty' && povertyData[hoveredState] && (
                        <div className="text-sm text-gray-600 mb-2">
                            <p>Poverty Index: <span className="font-semibold text-red-600">{(povertyData[hoveredState] * 100).toFixed(1)}%</span></p>
                        </div>
                    )}
                    
                    {layer === 'climate' && climateData[hoveredState] && (
                        <div className="text-sm text-gray-600 mb-2">
                            <p>Climate Risk: <span className="font-semibold text-orange-600">{climateData[hoveredState]}/100</span></p>
                        </div>
                    )}
                    
                    <p className="text-xs text-indigo-600 mt-2 pt-2 border-t border-gray-200">
                        🔍 Click to explore detailed insights
                    </p>
                </div>
            )}

            {/* Hover text instruction */}
            <div className="absolute bottom-4 left-4 bg-white/95 rounded-lg shadow-lg p-3 text-sm text-gray-700 backdrop-blur-sm">
                <p className="font-semibold flex items-center gap-2">
                    <span className="text-lg">🗺️</span> Interactive India Map
                </p>
                <p className="text-xs text-gray-600 mt-1">Hover over states • Click to explore data</p>
            </div>

            {/* Legend */}
            {layer !== 'default' && (
                <div className="absolute bottom-4 right-4 bg-white/95 rounded-lg shadow-lg p-3 text-xs backdrop-blur-sm">
                    <h4 className="font-bold mb-2 text-gray-800">
                        {layer === 'poverty' ? '📊 Poverty Level' : '🌡️ Climate Risk'}
                    </h4>
                    <div className="space-y-1">
                        {layer === 'poverty' ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                                    <span>High (&gt;20%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                    <span>Medium (10-20%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <span>Low (&lt;10%)</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-900 rounded"></div>
                                    <span>Critical (&gt;90)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                                    <span>High (70-90)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                    <span>Medium (60-70)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <span>Low (&lt;60)</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
