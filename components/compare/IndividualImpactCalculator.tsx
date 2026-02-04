"use client";

import { useEffect, useState } from "react";

interface ImpactRatioData {
    countryA: string;
    countryB: string;
    ratio: number;
    perCapitaA: number;
    perCapitaB: number;
    gdpA: number;
    gdpB: number;
    populationA: number;
    populationB: number;
    year: number;
}

export function IndividualImpactCalculator({ countries }: { countries: string[] }) {
    const [data, setData] = useState<ImpactRatioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showTooltip, setShowTooltip] = useState(false);
    const [animateIcons, setAnimateIcons] = useState(false);

    useEffect(() => {
        if (countries.length >= 2) {
            fetchImpactRatio();
        }
    }, [countries]);

    const fetchImpactRatio = async () => {
        try {
            const response = await fetch(
                `/api/v1/economics/impact-ratio?countryA=${countries[0]}&countryB=${countries[1]}`
            );
            const result = await response.json();
            setData(result);

            // Trigger icon animation after data loads
            setTimeout(() => setAnimateIcons(true), 300);
        } catch (error) {
            console.error("Error fetching impact ratio:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !data) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border-2 border-green-500 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-64 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    const maxIcons = 15;
    const displayRatio = Math.min(Math.round(data.ratio), maxIcons);

    return (
        <div className="bg-gradient-to-br from-white to-green-50 rounded-xl sm:rounded-2xl shadow-lg border-2 border-green-500 p-3 sm:p-4 lg:p-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                <div>
                    <h3 className="text-sm sm:text-base lg:text-xl font-black uppercase text-gray-900 mb-1 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                        <span className="text-lg sm:text-2xl lg:text-3xl">💡</span>
                        <span className="leading-tight">Individual Impact Equivalence</span>
                    </h3>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">
                        People-to-People GDP Comparison
                    </p>
                </div>

                {/* Verified Badge */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-green-600 text-white px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-md animate-bounce-subtle w-fit">
                    <i className="ri-shield-check-fill text-xs sm:text-sm"></i>
                    <span className="hidden xs:inline">Verified Data</span>
                    <span className="xs:hidden">✓</span>
                    <span className="hidden sm:inline">• Truth-First</span>
                </div>
            </div>

            {/* PROMINENT RATIO DISPLAY */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 shadow-xl animate-scale-in">
                <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-6 flex-wrap">
                    <div className="text-center animate-slide-in-left">
                        <div className="text-3xl sm:text-5xl lg:text-7xl font-black mb-1 sm:mb-2">1</div>
                        <div className="text-xs sm:text-base lg:text-lg font-bold">{data.countryA}</div>
                        <div className="text-[9px] sm:text-xs lg:text-sm opacity-90">Citizen</div>
                    </div>

                    <div className="text-2xl sm:text-4xl lg:text-6xl font-black animate-rotate-in">
                        =
                    </div>

                    <div className="text-center animate-slide-in-right">
                        <div className="text-3xl sm:text-5xl lg:text-7xl font-black mb-1 sm:mb-2 text-yellow-300">
                            {Math.round(data.ratio)}
                        </div>
                        <div className="text-xs sm:text-base lg:text-lg font-bold">{data.countryB}</div>
                        <div className="text-[9px] sm:text-xs lg:text-sm opacity-90">Citizens</div>
                    </div>
                </div>
                <div className="text-center mt-2 sm:mt-3 lg:mt-4 text-[9px] sm:text-xs lg:text-sm opacity-95 px-2">
                    in economic contribution (GDP per capita)
                </div>
            </div>

            {/* DYNAMIC PICTOGRAM VISUALIZATION */}
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 shadow-inner">
                <h4 className="text-center text-xs sm:text-sm lg:text-base font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6">
                    Visual Representation
                </h4>

                <div className="flex items-center justify-center gap-3 sm:gap-6 lg:gap-12 flex-wrap">
                    {/* Country A - Single Icon */}
                    <div className="text-center">
                        <div className="animate-bounce-gentle">
                            <i className="ri-user-fill text-4xl sm:text-6xl lg:text-8xl text-blue-600"></i>
                        </div>
                        <div className="mt-2 sm:mt-3">
                            <p className="font-bold text-xs sm:text-sm lg:text-base text-gray-900">{data.countryA}</p>
                            <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-600">
                                ${(data.perCapitaA / 1000).toFixed(1)}K per capita
                            </p>
                        </div>
                    </div>

                    {/* Equals */}
                    <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-purple-600 animate-pulse-subtle">
                        =
                    </div>

                    {/* Country B - Multiple Icons with Sequential Animation */}
                    <div className="text-center">
                        <div className="flex flex-wrap gap-0.5 sm:gap-1 lg:gap-2 justify-center max-w-[140px] sm:max-w-[200px] lg:max-w-sm mb-2 sm:mb-3">
                            {animateIcons && Array.from({ length: displayRatio }).map((_, index) => (
                                <i
                                    key={index}
                                    className="ri-user-fill text-lg sm:text-2xl lg:text-3xl text-orange-500 animate-pop-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                ></i>
                            ))}
                            {data.ratio > maxIcons && (
                                <div className="text-orange-500 text-lg sm:text-2xl lg:text-3xl font-bold flex items-center animate-fade-in">
                                    +{Math.round(data.ratio - maxIcons)}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-xs sm:text-sm lg:text-base text-gray-900">{data.countryB}</p>
                            <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-600">
                                ${(data.perCapitaB / 1000).toFixed(1)}K per capita
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
                <div className="bg-blue-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-blue-200 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                    <div className="text-[9px] sm:text-[10px] lg:text-xs text-blue-600 font-semibold mb-0.5 sm:mb-1">{data.countryA}</div>
                    <div className="text-base sm:text-xl lg:text-2xl font-black text-blue-800">${(data.gdpA / 1000).toFixed(2)}T</div>
                    <div className="text-[8px] sm:text-[9px] lg:text-[10px] text-gray-600">GDP • {data.populationA}M people</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-orange-200 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                    <div className="text-[9px] sm:text-[10px] lg:text-xs text-orange-600 font-semibold mb-0.5 sm:mb-1">{data.countryB}</div>
                    <div className="text-base sm:text-xl lg:text-2xl font-black text-orange-800">${(data.gdpB / 1000).toFixed(2)}T</div>
                    <div className="text-[8px] sm:text-[9px] lg:text-[10px] text-gray-600">GDP • {data.populationB}M people</div>
                </div>
            </div>

            {/* Hinglish Tooltip */}
            <div className="relative mb-2 sm:mb-3">
                <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowTooltip(!showTooltip)}
                    className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-purple-700 hover:text-purple-900 font-semibold transition transform hover:scale-105"
                >
                    <i className="ri-information-line text-sm sm:text-base lg:text-lg"></i>
                    <span className="hidden sm:inline">Yeh ratio dikhata hai ki per person productivity kitni alag hai</span>
                    <span className="sm:hidden">How it works</span>
                </button>

                {showTooltip && (
                    <div className="absolute bottom-full left-0 mb-2 w-[calc(100vw-2rem)] max-w-xs sm:max-w-sm bg-gray-900 text-white text-[9px] sm:text-[10px] lg:text-xs rounded-lg p-2.5 sm:p-3 lg:p-4 shadow-2xl z-20 animate-fade-in">
                        <p className="font-semibold mb-1.5 sm:mb-2">💡 कैसे काम करता है:</p>
                        <p className="mb-1.5 sm:mb-2">
                            हर देश की total GDP को उसकी population से divide करते हैं।
                            इससे पता चलता है कि average एक व्यक्ति कितना wealth generate करता है।
                        </p>
                        <p className="text-[8px] sm:text-[9px] opacity-80">
                            Formula: GDP ÷ Population = Per Capita GDP
                        </p>
                        <div className="absolute bottom-0 left-3 sm:left-4 lg:left-8 transform translate-y-1/2 rotate-45 w-2 h-2 sm:w-3 sm:h-3 bg-gray-900"></div>
                    </div>
                )}
            </div>

            {/* Data Attribution */}
            <div className="text-center text-[8px] sm:text-[9px] lg:text-[10px] text-gray-500 border-t border-gray-200 pt-2 sm:pt-3 leading-tight">
                Source: IMF/World Bank {data.year} • Verified Data • Truth-First
            </div>
        </div>
    );
}
