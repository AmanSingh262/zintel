import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("Fetching product-level trade data...");

        // Mock data for product categories
        const mockData = [
            { category: "Electronics", imports: 685, exports: 421 },
            { category: "Textiles", imports: 312, exports: 568 },
            { category: "Chemicals", imports: 445, exports: 387 },
            { category: "Automobiles", imports: 298, exports: 512 },
            { category: "Pharmaceuticals", imports: 156, exports: 734 },
            { category: "Agricultural", imports: 267, exports: 623 },
        ];

        return NextResponse.json(mockData);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json([]);
    }
}
