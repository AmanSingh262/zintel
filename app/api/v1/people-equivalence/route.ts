import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        let countryA = searchParams.get("countryA") || "USA";
        let countryB = searchParams.get("countryB") || "India";
        const mode = searchParams.get("mode") || "nominal";

        console.log(`Calculating equivalence: ${countryA} vs ${countryB} (${mode})`);

        // Mock GDP and population data (In production, fetch from World Bank API)
        const countryData: Record<string, any> = {
            "India": {
                gdpNominal: 3700, // Billion USD
                gdpPPP: 11700,    // Billion USD
                population: 1420  // Million
            },
            "USA": {
                gdpNominal: 27800,
                gdpPPP: 27800,
                population: 340
            },
            "China": {
                gdpNominal: 18400,
                gdpPPP: 31000,
                population: 1420
            },
            "Japan": {
                gdpNominal: 4200,
                gdpPPP: 5800,
                population: 125
            },
            "Germany": {
                gdpNominal: 4500,
                gdpPPP: 5200,
                population: 84
            },
        };

        let dataA = countryData[countryA] || countryData["USA"];
        let dataB = countryData[countryB] || countryData["India"];

        // Calculate per capita GDP
        let gdpA = mode === "ppp" ? dataA.gdpPPP : dataA.gdpNominal;
        let gdpB = mode === "ppp" ? dataB.gdpPPP : dataB.gdpNominal;

        let perCapitaA = (gdpA * 1000) / dataA.population; // Per capita in USD
        let perCapitaB = (gdpB * 1000) / dataB.population;

        // SWAP LOGIC: Always ensure country with HIGHER per capita is "A"
        if (perCapitaA < perCapitaB) {
            // Swap countries
            [countryA, countryB] = [countryB, countryA];
            [dataA, dataB] = [dataB, dataA];
            [gdpA, gdpB] = [gdpB, gdpA];
            [perCapitaA, perCapitaB] = [perCapitaB, perCapitaA];
        }

        // Calculate equivalence ratio (now always >= 1)
        const ratio = perCapitaA / perCapitaB;

        const result = {
            countryA,
            countryB,
            ratio: parseFloat(ratio.toFixed(2)),
            perCapitaA: Math.round(perCapitaA),
            perCapitaB: Math.round(perCapitaB),
            mode,
            calculation: {
                gdpA: `$${gdpA}B`,
                gdpB: `$${gdpB}B`,
                populationA: `${dataA.population}M`,
                populationB: `${dataB.population}M`,
            }
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to calculate equivalence" }, { status: 500 });
    }
}
