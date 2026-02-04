import { NextResponse } from "next/server";

// 2026 Projected Data
const economicData2026: Record<string, any> = {
    "India": {
        gdp: 4.51, // Trillion USD (2026 projection)
        population: 1430, // Million
    },
    "USA": {
        gdp: 28.78,
        population: 342,
    },
    "China": {
        gdp: 19.37,
        population: 1425,
    },
    "Japan": {
        gdp: 4.46,
        population: 124,
    },
    "Germany": {
        gdp: 4.73,
        population: 84,
    },
    "UK": {
        gdp: 3.68,
        population: 68,
    },
    "France": {
        gdp: 3.18,
        population: 66,
    },
    "Brazil": {
        gdp: 2.35,
        population: 217,
    },
    "Russia": {
        gdp: 2.01,
        population: 144,
    },
    "Canada": {
        gdp: 2.24,
        population: 39,
    },
};

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const countryA = searchParams.get("countryA") || "USA";
        const countryB = searchParams.get("countryB") || "India";

        console.log(`Calculating impact ratio: ${countryA} vs ${countryB} (2026 data)`);

        // Get data for selected countries
        const dataA = economicData2026[countryA] || economicData2026["USA"];
        const dataB = economicData2026[countryB] || economicData2026["India"];

        // Calculate per capita GDP (in USD)
        const perCapitaA = (dataA.gdp * 1000000) / dataA.population; // Per capita in USD
        const perCapitaB = (dataB.gdp * 1000000) / dataB.population;

        // Calculate impact ratio
        const ratio = perCapitaA / perCapitaB;

        // Prepare response with full details
        const result = {
            countryA,
            countryB,
            ratio: parseFloat(ratio.toFixed(2)),
            perCapitaA: Math.round(perCapitaA),
            perCapitaB: Math.round(perCapitaB),
            gdpA: dataA.gdp,
            gdpB: dataB.gdp,
            populationA: dataA.population,
            populationB: dataB.population,
            year: 2026,
            source: "IMF/World Bank 2026 Projections",
            calculation: {
                formula: "Ratio = (GDP_A / Pop_A) / (GDP_B / Pop_B)",
                step1: `Per Capita A = $${dataA.gdp}T / ${dataA.population}M = $${Math.round(perCapitaA)}`,
                step2: `Per Capita B = $${dataB.gdp}T / ${dataB.population}M = $${Math.round(perCapitaB)}`,
                step3: `Ratio = ${Math.round(perCapitaA)} / ${Math.round(perCapitaB)} = ${ratio.toFixed(2)}`,
            }
        };

        // In production, this would be cached in Redis with 24-hour TTL
        // await redis.setex(`impact-ratio:${countryA}:${countryB}`, 86400, JSON.stringify(result));

        return NextResponse.json(result);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Failed to calculate impact ratio" },
            { status: 500 }
        );
    }
}
