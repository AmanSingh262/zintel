import { NextResponse } from "next/server";
import { fetchRealtimeAQI, getCityAverageAQI } from "@/lib/services/aqiFetcher";

/**
 * Test endpoint to verify OGD API connectivity
 * Access at: /api/environment/aqi/test
 */
export async function GET() {
    console.log("\n" + "=".repeat(60));
    console.log("AQI API TEST - Starting...");
    console.log("=".repeat(60));

    const results: any = {
        timestamp: new Date().toISOString(),
        tests: []
    };

    // Test 1: Fetch raw data
    console.log("\n[Test 1] Fetching raw AQI data for Delhi, Mumbai, Jaipur...");
    try {
        const rawData = await fetchRealtimeAQI(["Delhi", "Mumbai", "Jaipur"], 50);
        results.tests.push({
            name: "Fetch Raw Data",
            status: rawData.length > 0 ? "✅ PASS" : "⚠️ NO DATA",
            recordCount: rawData.length,
            sample: rawData[0] || null
        });
        console.log(`✅ Fetched ${rawData.length} records`);
    } catch (error) {
        results.tests.push({
            name: "Fetch Raw Data",
            status: "❌ FAIL",
            error: String(error)
        });
        console.error("❌ Error:", error);
    }

    // Test 2: Get city average for Delhi
    console.log("\n[Test 2] Getting city average for Delhi...");
    try {
        const delhiData = await getCityAverageAQI("Delhi");
        results.tests.push({
            name: "Delhi City Average",
            status: delhiData.aqi > 0 ? "✅ PASS" : "⚠️ NO DATA",
            data: delhiData
        });
        console.log(`✅ Delhi AQI: ${delhiData.aqi} (${delhiData.health_status})`);
    } catch (error) {
        results.tests.push({
            name: "Delhi City Average",
            status: "❌ FAIL",
            error: String(error)
        });
        console.error("❌ Error:", error);
    }

    // Test 3: Get city average for Jaipur
    console.log("\n[Test 3] Getting city average for Jaipur...");
    try {
        const jaipurData = await getCityAverageAQI("Jaipur");
        results.tests.push({
            name: "Jaipur City Average",
            status: jaipurData.aqi > 0 ? "✅ PASS" : "⚠️ NO DATA",
            data: jaipurData
        });
        console.log(`✅ Jaipur AQI: ${jaipurData.aqi} (${jaipurData.health_status})`);
    } catch (error) {
        results.tests.push({
            name: "Jaipur City Average",
            status: "❌ FAIL",
            error: String(error)
        });
        console.error("❌ Error:", error);
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("TEST SUMMARY");
    console.log("=".repeat(60));
    results.tests.forEach((test: any) => {
        console.log(`${test.status} ${test.name}`);
    });
    console.log("=".repeat(60) + "\n");

    return NextResponse.json(results, { 
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
