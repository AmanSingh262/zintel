// Simple diagnostic script - no dependencies needed
console.log("=== News Checkers Diagnostic ===\n");

// Check 1: Environment file
const fs = require('fs');
const path = require('path');

console.log("1. Checking .env.local file...");
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    console.log("   ✓ .env.local exists");
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasGeminiKey = envContent.includes('GOOGLE_GEMINI_API_KEY');
    if (hasGeminiKey) {
        const match = envContent.match(/GOOGLE_GEMINI_API_KEY="([^"]+)"/);
        if (match && match[1] && match[1] !== 'your-gemini-api-key-here') {
            console.log("   ✓ GOOGLE_GEMINI_API_KEY is set");
            console.log("   Key starts with:", match[1].substring(0, 10) + "...");
        } else {
            console.log("   ❌ GOOGLE_GEMINI_API_KEY is not properly set");
        }
    } else {
        console.log("   ❌ GOOGLE_GEMINI_API_KEY not found in .env.local");
    }
} else {
    console.log("   ❌ .env.local file does NOT exist");
}

// Check 2: Package installation
console.log("\n2. Checking @google/generative-ai package...");
try {
    require.resolve('@google/generative-ai');
    console.log("   ✓ @google/generative-ai is installed");
} catch (e) {
    console.log("   ❌ @google/generative-ai is NOT installed");
    console.log("   Run: npm install @google/generative-ai");
}

// Check 3: API route file
console.log("\n3. Checking API route...");
const routePath = path.join(__dirname, 'app', 'api', 'verify-image', 'route.ts');
if (fs.existsSync(routePath)) {
    console.log("   ✓ API route exists at app/api/verify-image/route.ts");
} else {
    console.log("   ❌ API route file not found");
}

// Check 4: Page file
console.log("\n4. Checking verification page...");
const pagePath = path.join(__dirname, 'app', 'verify-news', 'image', 'page.tsx');
if (fs.existsSync(pagePath)) {
    console.log("   ✓ Verification page exists");
} else {
    console.log("   ❌ Verification page not found");
}

console.log("\n=== Diagnostic Complete ===\n");
