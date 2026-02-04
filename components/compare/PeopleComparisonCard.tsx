"use client";

import { useEffect, useState } from "react";

interface EquivalenceData {
    countryA: string;
    countryB: string;
    ratio: number;
    perCapitaA: number;
    perCapitaB: number;
    mode: "nominal" | "ppp";
}

export function PeopleComparisonCard({ countries }: { countries: string[] }) {
    const [data, setData] = useState<EquivalenceData | null>(null);
    const [mode, setMode] = useState<"nominal" | "ppp">("nominal");
    const [loading, setLoading] = useState(true);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        if (countries.length >= 2) {
            fetchEquivalence();
        }
    }, [countries, mode]);

    const fetchEquivalence = async () => {
        try {
            const response = await fetch(
                `/api/v1/people-equivalence?countryA=${countries[0]}&countryB=${countries[1]}&mode=${mode}`
            );
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching equivalence:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !data) {
        return (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border-2 border-green-500 p-4 sm:p-6">
                <div className="animate-pulse">
                    <div className="h-4 sm:h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-32 sm:h-48 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    const renderPictograms = () => {
        const maxIcons = 20;
        const displayRatio = Math.min(Math.round(data.ratio), maxIcons);

        return (
            <div className="flex items-center justify-center gap-4 sm:gap-8 lg:gap-12 my-4 sm:my-6 lg:my-8 flex-wrap">
                {/* Country A - Single Large Icon */}
                <div className="text-center">
                    <div className="relative">
                        <i className="ri-user-fill text-5xl sm:text-7xl lg:text-9xl text-blue-600"></i>
                        <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-blue-600 text-white rounded-full w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center text-[10px] sm:text-xs lg:text-sm font-bold">
                            1
                        </div>
                    </div>
                    <p className="mt-2 sm:mt-3 lg:mt-4 font-bold text-sm sm:text-base lg:text-lg text-gray-900">{data.countryA}</p>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">
                        ${(data.perCapitaA / 1000).toFixed(1)}K per capita
                    </p>
                </div>

                {/* Equals Sign */}
                <div className="text-3xl sm:text-5xl lg:text-6xl font-bold text-purple-600">=</div>

                {/* Country B - Multiple Small Icons */}
                <div className="text-center">
                    <div className="relative flex flex-wrap gap-0.5 sm:gap-1 lg:gap-2 justify-center max-w-[160px] sm:max-w-xs lg:max-w-md">
                        {Array.from({ length: displayRatio }).map((_, index) => (
                            <i
                                key={index}
                                className="ri-user-fill text-xl sm:text-3xl lg:text-4xl text-orange-500 animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            ></i>
                        ))}
                        {data.ratio > maxIcons && (
                            <div className="text-orange-500 text-xl sm:text-3xl lg:text-4xl font-bold">
                                +{Math.round(data.ratio - maxIcons)}
                            </div>
                        )}
                    </div>
                    <p className="mt-2 sm:mt-3 lg:mt-4 font-bold text-sm sm:text-base lg:text-lg text-gray-900">{data.countryB}</p>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">
                        ${(data.perCapitaB / 1000).toFixed(1)}K per capita
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border-2 border-green-500 p-3 sm:p-4 lg:p-6">
            {/* Header with Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
                <div>
                    <h3 className="text-sm sm:text-base lg:text-xl font-black uppercase text-gray-900 mb-1">
                        💡 Individual Impact Equivalence
                    </h3>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">
                        People-to-People GDP Comparison
                    </p>
                </div>

                {/* Nominal vs PPP Toggle */}
                <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 rounded-lg p-0.5 sm:p-1 w-fit">
                    <button
                        onClick={() => setMode("nominal")}
                        className={`px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-md text-[10px] sm:text-xs lg:text-sm font-semibold transition ${mode === "nominal"
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Nominal GDP
                    </button>
                    <button
                        onClick={() => setMode("ppp")}
                        className={`px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-md text-[10px] sm:text-xs lg:text-sm font-semibold transition ${mode === "ppp"
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        PPP
                    </button>
                </div>
            </div>

            {/* Verified Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-green-50 text-green-700 px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] lg:text-xs font-semibold mb-3 sm:mb-4 lg:mb-6">
                <i className="ri-shield-check-line text-xs sm:text-sm"></i>
                Verified Data • Truth-First
            </div>

            {/* PROMINENT RATIO DISPLAY */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 mb-3 sm:mb-4 lg:mb-6">
                <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-6 flex-wrap">
                    <div className="text-center">
                        <div className="text-4xl sm:text-6xl lg:text-7xl font-black text-blue-600 mb-1 sm:mb-2">1</div>
                        <div className="text-xs sm:text-sm lg:text-base font-bold text-gray-800">{data.countryA}</div>
                        <div className="text-[9px] sm:text-[10px] lg:text-xs text-gray-600">Citizen</div>
                    </div>

                    <div className="text-3xl sm:text-5xl lg:text-6xl font-black text-purple-600">=</div>

                    <div className="text-center">
                        <div className="text-4xl sm:text-6xl lg:text-7xl font-black text-orange-600 mb-1 sm:mb-2">
                            {Math.round(data.ratio)}
                        </div>
                        <div className="text-xs sm:text-sm lg:text-base font-bold text-gray-800">{data.countryB}</div>
                        <div className="text-[9px] sm:text-[10px] lg:text-xs text-gray-600">Citizens</div>
                    </div>
                </div>
                <div className="text-center mt-2 sm:mt-3 lg:mt-4 text-[10px] sm:text-xs lg:text-sm text-gray-700 px-2">
                    in economic contribution (GDP per capita)
                </div>
            </div>

            {/* Pictogram Visualization */}
            {renderPictograms()}

            {/* Insight Text */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 text-center">
                <p className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 mb-1 sm:mb-2">
                    1 Citizen of <span className="text-blue-600">{data.countryA}</span> contributes
                    as much to the Global Economy as{" "}
                    <span className="text-orange-600">~{Math.round(data.ratio)} Citizens</span> of{" "}
                    <span className="text-orange-600">{data.countryB}</span>
                </p>
                <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">
                    {mode === "ppp"
                        ? "Based on Purchasing Power Parity (adjusted for local costs)"
                        : "Based on Nominal GDP"}
                </p>
            </div>

            {/* Hinglish Tooltip */}
            <div className="mt-3 sm:mt-4 relative">
                <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowTooltip(!showTooltip)}
                    className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs lg:text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                    <i className="ri-information-line text-sm sm:text-base lg:text-lg"></i>
                    Ye kaise calculate hota hai?
                </button>

                {showTooltip && (
                    <div className="absolute bottom-full left-0 mb-2 w-[calc(100vw-2rem)] max-w-xs sm:max-w-sm lg:max-w-md bg-gray-900 text-white text-[9px] sm:text-[10px] lg:text-xs rounded-lg p-2 sm:p-3 shadow-lg z-10">
                        <p className="font-semibold mb-1">💡 Calculation Logic:</p>
                        <p>
                            Ye calculation dikhata hai ki ek average citizen kitna wealth produce kar raha hai.
                            GDP ko population se divide karke per capita income nikaalte hain, phir dono countries
                            ka ratio compare karte hain.
                        </p>
                        <div className="absolute bottom-0 left-2 sm:left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                    </div>
                )}
            </div>

            {/* Data Attribution */}
            <div className="mt-3 sm:mt-4 lg:mt-6 text-[9px] sm:text-[10px] lg:text-xs text-gray-500 text-center">
                Data from World Bank • Updated 2024
            </div>
        </div>
    );
}
