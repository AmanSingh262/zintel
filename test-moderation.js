// Quick test script for AI moderation
const fetch = require('node-fetch');

async function testModeration() {
    console.log("🧪 Testing AI Moderation System...\n");

    const tests = [
        {
            name: "Clean Content (Should Approve)",
            content: "Just analyzed the latest employment data - youth unemployment in tier-2 cities is decreasing! This is encouraging news for our economy. #IndiaGDP #Economy"
        },
        {
            name: "Abusive Language (Should Reject)",
            content: "This politician is an idiot and should be removed immediately!"
        },
        {
            name: "Spam (Should Reject)",
            content: "BUY NOW! Limited offer! Click here for amazing deals!!! 🎉🎉🎉"
        },
        {
            name: "Fact-Based Discussion (Should Approve)",
            content: "According to the latest census data, literacy rates have improved by 12% in rural areas. This is a positive trend for education. #Education"
        }
    ];

    for (const test of tests) {
        console.log(`\n📝 Test: ${test.name}`);
        console.log(`Content: "${test.content}"\n`);

        try {
            const response = await fetch('http://localhost:4001/api/posts/moderate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: test.content })
            });

            const result = await response.json();

            if (result.approved) {
                console.log(`✅ APPROVED`);
                console.log(`   Safety Score: ${result.safetyScore}/100`);
            } else {
                console.log(`❌ REJECTED`);
                console.log(`   Reason: ${result.reason}`);
                console.log(`   Suggestion: ${result.suggestion}`);
            }
        } catch (error) {
            console.error(`❌ Error: ${error.message}`);
        }
    }

    console.log("\n\n✅ Testing Complete!");
}

testModeration();
