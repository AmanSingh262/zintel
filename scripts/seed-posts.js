// Seed script to populate database with sample posts
// Run with: node scripts/seed-posts.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with sample posts...\n');

    // Create Zintel.in official account
    const zintelAccount = await prisma.user.upsert({
        where: { email: 'official@zintel.in' },
        update: {},
        create: {
            email: 'official@zintel.in',
            name: 'Zintel.in',
            password: 'hashed_password_placeholder', // Not used for official account
            emailVerified: true,
            truthIdVerified: true,
            verificationLevel: 2, // Level 2 verification (green checkmark)
            termsAccepted: true,
            termsAcceptedAt: new Date(),
        },
    });

    console.log('✅ Created Zintel.in official account');

    // Sample posts about current affairs
    const samplePosts = [
        {
            content: "🇮🇳 India's GDP growth hits 7.8% in Q3 2025, surpassing all major economies! Manufacturing sector leads with 12% growth. This marks the strongest quarterly performance in 5 years. #Economy #IndiaGDP #GrowthStory",
            postType: "intelligence",
            hashtags: ["Economy", "IndiaGDP", "GrowthStory"],
            likes: 1247,
            comments: 89,
            shares: 234,
        },
        {
            content: "📊 Youth unemployment in tier-2 cities drops to 8.2%, down from 12.4% last year. Government's skill development programs show measurable impact. Over 2.3 million new jobs created in manufacturing and tech sectors. #Employment #SkillIndia",
            postType: "intelligence",
            hashtags: ["Employment", "SkillIndia"],
            likes: 892,
            comments: 67,
            shares: 156,
        },
        {
            content: "🌱 India plants 500 million trees in 2025, exceeding Paris Agreement targets by 40%. Forest cover increases by 2.1% nationwide. Maharashtra and Karnataka lead reforestation efforts. #ClimateAction #GreenIndia",
            postType: "intelligence",
            hashtags: ["ClimateAction", "GreenIndia"],
            likes: 2134,
            comments: 145,
            shares: 567,
        },
        {
            content: "💡 Renewable energy now accounts for 48% of India's total power generation! Solar capacity doubles in 18 months. Coal dependency drops to historic low. India on track to achieve 2030 clean energy goals. #RenewableEnergy #SolarPower",
            postType: "intelligence",
            hashtags: ["RenewableEnergy", "SolarPower"],
            likes: 1678,
            comments: 112,
            shares: 389,
        },
        {
            content: "🎓 Literacy rate in rural India reaches 82%, up from 74% in 2020. Digital education initiatives reach 45 million students. Government invests ₹2.5 lakh crore in education infrastructure. #Education #DigitalIndia",
            postType: "intelligence",
            hashtags: ["Education", "DigitalIndia"],
            likes: 1456,
            comments: 98,
            shares: 278,
        },
        {
            content: "🚀 India's space program achieves milestone: Chandrayaan-4 successfully lands on Moon's south pole. ISRO discovers water ice deposits. International collaboration with 12 countries confirmed. #SpaceExploration #ISRO #Chandrayaan4",
            postType: "intelligence",
            hashtags: ["SpaceExploration", "ISRO", "Chandrayaan4"],
            likes: 3421,
            comments: 234,
            shares: 892,
        },
        {
            content: "💰 UPI transactions cross 15 billion per month, making India the global leader in digital payments. Transaction value reaches ₹22 lakh crore. 98% of transactions are peer-to-peer. #DigitalPayments #UPI #Fintech",
            postType: "intelligence",
            hashtags: ["DigitalPayments", "UPI", "Fintech"],
            likes: 1823,
            comments: 156,
            shares: 445,
        },
        {
            content: "🏥 India's healthcare infrastructure expands: 50,000 new primary health centers operational. Doctor-to-patient ratio improves to 1:834. Telemedicine reaches 150 million rural citizens. #Healthcare #AyushmanBharat",
            postType: "intelligence",
            hashtags: ["Healthcare", "AyushmanBharat"],
            likes: 1234,
            comments: 87,
            shares: 312,
        },
        {
            content: "🚆 India's high-speed rail network expands to 2,500 km. Mumbai-Ahmedabad bullet train operational. Average speed: 320 km/h. Travel time between major cities reduced by 60%. #Infrastructure #BulletTrain #ModernIndia",
            postType: "intelligence",
            hashtags: ["Infrastructure", "BulletTrain", "ModernIndia"],
            likes: 2567,
            comments: 189,
            shares: 623,
        },
        {
            content: "👩‍💼 Women's workforce participation reaches 38%, highest in 15 years. Tech sector leads with 45% female employees. Government's maternity benefit schemes benefit 8 million women. #WomenEmpowerment #GenderEquality #WorkforceIndia",
            postType: "intelligence",
            hashtags: ["WomenEmpowerment", "GenderEquality", "WorkforceIndia"],
            likes: 1945,
            comments: 134,
            shares: 478,
        },
    ];

    // Create posts
    for (let i = 0; i < samplePosts.length; i++) {
        const post = samplePosts[i];

        await prisma.post.create({
            data: {
                content: post.content,
                postType: post.postType,
                hashtags: post.hashtags,
                authorId: zintelAccount.id,
                shares: post.shares,
                moderationStatus: 'approved',
                aiSafetyScore: 98,
                isVerified: true,
                createdAt: new Date(Date.now() - (i * 3600000)), // Stagger posts by 1 hour
            },
        });

        console.log(`✅ Created post ${i + 1}/10: "${post.content.substring(0, 50)}..."`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📊 Created ${samplePosts.length} posts from Zintel.in account`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
