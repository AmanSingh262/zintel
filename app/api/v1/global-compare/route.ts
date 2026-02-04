import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const countries = searchParams.get("countries")?.split(",") || ["India", "USA", "China"];
        const indicator = searchParams.get("indicator") || "GDP";
        const yearRange = searchParams.get("yearRange") || "2020-2023";

        console.log(`Fetching comparison data for ${countries.join(", ")} - ${indicator} (${yearRange})`);

        // Mock global comparison data
        const mockData = {
            indicator,
            yearRange,
            countries: countries.map(country => ({
                name: country,
                gdp: country === "India" ? 3.70 : country === "USA" ? 27.80 : 18.40,
                population: country === "India" ? 1.42 : country === "USA" ? 0.34 : 1.42,
                growthRate: country === "India" ? 7.2 : country === "USA" ? 2.1 : 5.2,
            })),
            populationTrend: [
                { year: "2020", [countries[0]]: 1.38, [countries[1]]: 0.33, [countries[2]]: 1.41 },
                { year: "2021", [countries[0]]: 1.39, [countries[1]]: 0.33, [countries[2]]: 1.41 },
                { year: "2022", [countries[0]]: 1.41, [countries[1]]: 0.34, [countries[2]]: 1.42 },
                { year: "2023", [countries[0]]: 1.42, [countries[1]]: 0.34, [countries[2]]: 1.42 },
            ],
            gdpComposition: [
                { sector: "Services", value: 55, color: "#8b5cf6" },
                { sector: "Industry", value: 30, color: "#3b82f6" },
                { sector: "Agriculture", value: 15, color: "#10b981" },
            ],
        };

        return NextResponse.json(mockData);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to fetch comparison data" }, { status: 500 });
    }
}
