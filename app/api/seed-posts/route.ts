import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// API endpoint to seed database with sample posts
// Access via: http://localhost:4001/api/seed-posts

export async function GET(request: NextRequest) {
    try {
        console.log("[seed-posts] Starting database seed...");

        // Create Zintel.in official account
        const zintelAccount = await prisma.user.upsert({
            where: { email: "official@zintel.in" },
            update: {},
            create: {
                email: "official@zintel.in",
                name: "Zintel.in",
                password: "hashed_password_placeholder",
                truthIdVerified: true,
                verificationLevel: 3, // Level 3 verification (blue tick - highest tier)
                termsAccepted: true,
                termsAcceptedAt: new Date(),
            },
        });

        console.log("[seed-posts] Created Zintel.in account");

        // Sample posts about current affairs
        const samplePosts = [
            {
                content: "India's GDP growth hits 7.8% in Q3, outperforming global forecasts. 📈 #ZintelFacts #IndianEconomy",
                postType: "intelligence",
                hashtags: ["ZintelFacts", "IndianEconomy"],
                likes: 2847,
                comments: 234,
                shares: 567,
            },
            {
                content: "New Green Hydrogen plant announced in Rajasthan, set to create 5,000+ jobs by 2026. 🌱 #SustainableIndia #RajasthanNews",
                postType: "intelligence",
                hashtags: ["SustainableIndia", "RajasthanNews"],
                likes: 1923,
                comments: 178,
                shares: 445,
            },
            {
                content: "AI in Healthcare: Indian startups are now using machine learning to detect early-stage anomalies in rural clinics. 🏥 #TechForGood #ZintelIntelligence",
                postType: "intelligence",
                hashtags: ["TechForGood", "ZintelIntelligence"],
                likes: 3156,
                comments: 289,
                shares: 723,
            },
            {
                content: "UP Government announces a new dedicated corridor for IT and electronics manufacturing. 💻 #DigitalIndia #UPDevelopment",
                postType: "intelligence",
                hashtags: ["DigitalIndia", "UPDevelopment"],
                likes: 1678,
                comments: 145,
                shares: 389,
            },
            {
                content: "ISRO successfully tests new semi-cryogenic engine for future heavy-lift missions. 🚀 #SpaceTech #IndiaInSpace",
                postType: "intelligence",
                hashtags: ["SpaceTech", "IndiaInSpace"],
                likes: 4521,
                comments: 412,
                shares: 1089,
            },
            {
                content: "Current Affairs Alert: New national mental health helpline 'Tele-MANAS' records 1 million calls. 🧠 #MentalHealthAwareness #ZintelCare",
                postType: "intelligence",
                hashtags: ["MentalHealthAwareness", "ZintelCare"],
                likes: 2234,
                comments: 198,
                shares: 534,
            },
            {
                content: "India's renewable energy capacity surpasses 180GW goal ahead of schedule. ☀️ #RenewableEnergy #ClimateAction",
                postType: "intelligence",
                hashtags: ["RenewableEnergy", "ClimateAction"],
                likes: 2789,
                comments: 256,
                shares: 678,
            },
            {
                content: "Job Crisis Update: New data suggests a 12% rise in demand for data scientists in Indian Tier-2 cities. 📊 #JobMarket #CareerInsights",
                postType: "intelligence",
                hashtags: ["JobMarket", "CareerInsights"],
                likes: 1845,
                comments: 167,
                shares: 423,
            },
            {
                content: "Cybersecurity Update: Government issues high-alert for new UPI-related phishing scams. Stay safe! 🛡️ #DigitalSafety #CyberSecurityIndia",
                postType: "intelligence",
                hashtags: ["DigitalSafety", "CyberSecurityIndia"],
                likes: 3012,
                comments: 301,
                shares: 845,
            },
            {
                content: "Education Reform: 500+ new skill-development centers to open across rural Rajasthan and UP this year. 🎓 #SkillIndia #EmpoweringYouth",
                postType: "intelligence",
                hashtags: ["SkillIndia", "EmpoweringYouth"],
                likes: 2456,
                comments: 212,
                shares: 589,
            },
        ];

        // Create posts
        const createdPosts = [];
        for (let i = 0; i < samplePosts.length; i++) {
            const post = samplePosts[i];

            const createdPost = await prisma.post.create({
                data: {
                    content: post.content,
                    postType: post.postType,
                    hashtags: post.hashtags,
                    authorId: zintelAccount.id,
                    shares: post.shares,
                    moderationStatus: "approved",
                    aiSafetyScore: 98,
                    isVerified: true,
                    createdAt: new Date(Date.now() - i * 3600000), // Stagger by 1 hour
                },
            });

            createdPosts.push(createdPost);
            console.log(`[seed-posts] Created post ${i + 1}/10`);
        }

        console.log("[seed-posts] Database seeded successfully!");

        return NextResponse.json({
            success: true,
            message: "Database seeded successfully!",
            data: {
                account: {
                    name: zintelAccount.name,
                    verified: zintelAccount.truthIdVerified,
                    verificationLevel: zintelAccount.verificationLevel,
                },
                postsCreated: createdPosts.length,
                posts: createdPosts.map((p) => ({
                    id: p.id,
                    content: p.content.substring(0, 50) + "...",
                    shares: p.shares,
                })),
            },
        });
    } catch (error: any) {
        console.error("[seed-posts] Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}
