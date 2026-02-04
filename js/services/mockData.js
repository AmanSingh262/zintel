/* mockData.js - Realistic Indian Statistics */

// ... (Existing Population & GDP Data) ...
export const mockPopulationData = {
    total: "1.42B",
    growthRate: "0.8%",
    topStates: [
        { name: "Uttar Pradesh", population: "240M", growth: "1.2%" },
        { name: "Maharashtra", population: "126M", growth: "0.9%" },
        { name: "Bihar", population: "130M", growth: "1.5%" },
        { name: "West Bengal", population: "99M", growth: "0.6%" },
        { name: "Madhya Pradesh", population: "85M", growth: "1.1%" }
    ],
    demographics: {
        youth: "15.3%", // Youth Unemployment
        rural: "65%",
        urban: "35%"
    }
};

export const mockGDPData = {
    total: "₹295 Lakh Crore", // Approx $3.7T
    growth: "7.2%",
    perCapita: "₹1.97L",
    sectors: {
        agriculture: "18%",
        industry: "28%",
        services: "54%"
    }
};

export const trendingTopics = [
    {
        id: 1,
        title: "Rural Digital Adoption Soars",
        category: "Connectivity",
        description: "Significant increase in internet usage and digital payments in Tier-3 cities.",
        icon: "wifi"
    },
    {
        id: 2,
        title: "MSME Sector Growth Drives Economy",
        category: "Economy",
        description: "Micro, Small, and Medium Enterprises show robust 12% YoY growth.",
        icon: "building"
    },
    {
        id: 3,
        title: "Clean Energy Investments Surge",
        category: "Environment",
        description: "India commits to sustainable development with record solar park installations.",
        icon: "leaf"
    }
];

// --- NEW DATA FOR BATCH 1 ---

export const govtFinanceData = {
    budget: {
        defense: 28,
        infrastructure: 22,
        education: 15,
        healthcare: 12,
        agriculture: 10,
        socialWelfare: 8,
        others: 5
    },
    taxCollection: [
        { state: "Maharashtra", amount: 120 },
        { state: "Uttar Pradesh", amount: 85 },
        { state: "Karnataka", amount: 80 },
        { state: "Tamil Nadu", amount: 75 },
        { state: "Gujarat", amount: 65 }
    ],
    revenueTrend: {
        years: [2020, 2021, 2022, 2023, 2024],
        revenue: [510, 560, 590, 610, 645],
        expenditure: [500, 540, 580, 600, 630]
    }
};

export const economyData = {
    jobsCreated: "1,234,567",
    povertyRate: "18.6%",
    youthUnemployment: "23.1%",
    perCapitaStates: [
        { state: "Maharashtra", income: 250000 },
        { state: "Karnataka", income: 245000 },
        { state: "Gujarat", income: 230000 },
        { state: "Tamil Nadu", income: 220000 },
        { state: "Punjab", income: 175000 }
    ],
    povertyIndex: [
        { region: "Rural North", score: 0.45, level: "High" },
        { region: "Urban West", score: 0.12, level: "Low" },
        { region: "East Coastal", score: 0.30, level: "Medium" }
    ]
};

export const mediaData = {
    fakeVsVerified: [65, 35], // 65% Verified, 35% Fake/Unverified
    trendingNews: [
        { title: "New Infrastructure Projects Boost Economy in UP", status: "Verified", score: 92 },
        { title: "Tech Layoffs Hit Bengaluru Startups Hard", status: "Unverified", score: 75 },
        { title: "Mumbai Records Highest Rainfall in a Decade", status: "Verified", score: 88 }
    ]
};

export const exportData = {
    tradeVolume: "USD 1.2 Trillion",
    growth: "12.3%",
    imports: [600, 320, 410, 580, 300, 450], // Electronics, Textiles, Chemicals, Energy, Agri, Auto
    exports: [450, 400, 420, 200, 500, 350],
    categories: ["Electronics", "Textiles", "Chemicals", "Energy", "Agri", "Auto"]
};

// --- NEW DATA FOR BATCH 2 ---

export const doctorsData = {
    salaryByState: [
        { state: "Maharashtra", salary: 1.8 }, // in Millions
        { state: "Karnataka", salary: 1.75 },
        { state: "Delhi", salary: 2.0 },
        { state: "Tamil Nadu", salary: 1.65 },
        { state: "UP", salary: 1.4 }
    ],
    salaryIndex: {
        years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
        index: [100, 108, 115, 128, 138, 145, 152]
    },
    skillHeatmap: [
        { skill: "Machine Learning", demand: "High", salary: "25-40 LPA" },
        { skill: "Cloud Computing", demand: "Very High", salary: "20-35 LPA" },
        { skill: "Full Stack Dev", demand: "High", salary: "15-28 LPA" }
    ]
};

export const environmentData = {
    aqiTrend: [180, 210, 245, 200, 280, 310, 305], // Last 7 days
    wasteGeneration: [
        { type: "Plastic", gen: 65, recycled: 25 },
        { type: "Organic", gen: 80, recycled: 60 },
        { type: "E-Waste", gen: 55, recycled: 35 }
    ]
};

export const socialData = {
    posts: [
        {
            user: "Ravi Sharma", handle: "@ravi_s", time: "2h ago", verified: true,
            content: "Great insights on the latest economic policies! It's crucial for citizens to understand these changes. #India360 #Economy",
            likes: 125, comments: 32
        },
        {
            user: "Priya Singh", handle: "@priya_singh", time: "15m ago", verified: false,
            content: "Just witnessed an amazing act of community service in my neighborhood. So inspiring! #CommunityStrong",
            likes: 88, comments: 15
        }
    ],
    discussions: [
        { topic: "New Education Policy Impact", count: 1234 },
        { topic: "Future of Digital Payments", count: 987 },
        { topic: "Climate Change Resilience", count: 543 }
    ]
};
