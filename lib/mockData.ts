// Centralized mock data for all pages

// Homepage Stats
export const mockQuickStats = [
    { label: "Active Cases", value: "2.4M", change: "+5.2%", trend: "up" },
    { label: "Vaccinated", value: "1.2B", change: "+12K", trend: "up" },
    { label: "Budget Allocated", value: "₹45L Cr", change: "+8%", trend: "up" },
    { label: "Employment Rate", value: "94.2%", change: "+1.2%", trend: "up" },
];

// Population Data
export const mockStatePopulation = [
    { state: "Uttar Pradesh", population: 199812341, growth: 2.1 },
    { state: "Maharashtra", population: 112374333, growth: 1.8 },
    { state: "Bihar", population: 104099452, growth: 2.3 },
    { state: "West Bengal", population: 91276115, growth: 1.4 },
    { state: "Madhya Pradesh", population: 72626809, growth: 1.9 },
    { state: "Tamil Nadu", population: 72147030, growth: 1.1 },
    { state: "Rajasthan", population: 68548437, growth: 2.0 },
    { state: "Karnataka", population: 61095297, growth: 1.6 },
];

export const mockMigrationData = [
    { year: "2018", internal: 450, external: 180 },
    { year: "2019", internal: 475, external: 195 },
    { year: "2020", internal: 420, external: 150 },
    { year: "2021", internal: 465, external: 170 },
    { year: "2022", internal: 490, external: 210 },
    { year: "2023", internal: 510, external: 225 },
];

export const mockDemographics = [
    { ageGroup: "0-14", male: 18.5, female: 17.2 },
    { ageGroup: "15-29", male: 17.8, female: 16.9 },
    { ageGroup: "30-44", male: 15.2, female: 14.8 },
    { ageGroup: "45-59", male: 11.3, female: 10.9 },
    { ageGroup: "60+", male: 6.2, female: 6.8 },
];

// Government Data
export const mockBudgetData = [
    { department: "Defence", allocation: 525000, spent: 420000 },
    { department: "Education", allocation: 112899, spent: 95432 },
    { department: "Health", allocation: 86606, spent: 72115 },
    { department: "Agriculture", allocation: 132000, spent: 110500 },
    { department: "Infrastructure", allocation: 240000, spent: 198000 },
];

export const mockSchemePerformance = [
    { scheme: "PM-KISAN", beneficiaries: 110000000, amount: 87500 },
    { scheme: "Ayushman Bharat", beneficiaries: 50000000, amount: 64000 },
    { scheme: "MGNREGA", beneficiaries: 78000000, amount: 98000 },
    { scheme: "PM Awas Yojana", beneficiaries: 28000000, amount: 120000 },
];

// Economy Data
export const mockGDPData = [
    { quarter: "Q1 2023", gdp: 7.8, industry: 5.2, services: 9.1 },
    { quarter: "Q2 2023", gdp: 7.6, industry: 5.5, services: 8.9 },
    { quarter: "Q3 2023", gdp: 7.7, industry: 6.0, services: 8.7 },
    { quarter: "Q4 2023", gdp: 8.1, industry: 6.5, services: 9.2 },
    { quarter: "Q1 2024", gdp: 7.9, industry: 6.2, services: 9.0 },
];

export const mockInflationData = [
    { month: "Jan", rate: 6.52 },
    { month: "Feb", rate: 6.44 },
    { month: "Mar", rate: 5.66 },
    { month: "Apr", rate: 4.83 },
    { month: "May", rate: 4.75 },
    { month: "Jun", rate: 4.81 },
    { month: "Jul", rate: 5.59 },
    { month: "Aug", rate: 6.83 },
];

export const mockEmploymentData = [
    { sector: "Agriculture", employed: 42.5, unemployed: 2.1 },
    { sector: "Manufacturing", employed: 12.1, unemployed: 3.4 },
    { sector: "Services", employed: 28.9, unemployed: 2.8 },
    { sector: "Construction", employed: 11.7, unemployed: 4.2 },
    { sector: "IT/Tech", employed: 4.8, unemployed: 1.5 },
];

// Export-Import Data
export const mockTradeBalance = [
    { month: "Jan", exports: 34500, imports: 52100 },
    { month: "Feb", exports: 36200, imports: 50800 },
    { month: "Mar", exports: 38700, imports: 53200 },
    { month: "Apr", exports: 37100, imports: 51500 },
    { month: "May", exports: 39800, imports: 54300 },
    { month: "Jun", exports: 41200, imports: 55100 },
];

export const mockTopCommodities = [
    { commodity: "Petroleum Products", value: 58000, type: "export" },
    { commodity: "Gems & Jewelry", value: 39000, type: "export" },
    { commodity: "Engineering Goods", value: 105000, type: "export" },
    { commodity: "Crude Oil", value: 145000, type: "import" },
    { commodity: "Gold", value: 35000, type: "import" },
    { commodity: "Electronics", value: 67000, type: "import" },
];

// Environment Data
export const mockAQIData = [
    { city: "Delhi", aqi: 312, category: "Very Poor" },
    { city: "Mumbai", aqi: 156, category: "Moderate" },
    { city: "Bangalore", aqi: 89, category: "Satisfactory" },
    { city: "Chennai", aqi: 102, category: "Moderate" },
    { city: "Kolkata", aqi: 187, category: "Moderate" },
    { city: "Hyderabad", aqi: 95, category: "Satisfactory" },
];

export const mockForestCover = [
    { year: "2018", area: 712249, percentage: 21.67 },
    { year: "2019", area: 715343, percentage: 21.76 },
    { year: "2020", area: 717520, percentage: 21.82 },
    { year: "2021", area: 720658, percentage: 21.92 },
    { year: "2023", area: 723789, percentage: 22.01 },
];

export const mockWaterQuality = [
    { river: "Ganga", bod: 3.2, ph: 7.8, quality: "Acceptable" },
    { river: "Yamuna", bod: 15.5, ph: 7.2, quality: "Poor" },
    { river: "Narmada", bod: 2.1, ph: 7.9, quality: "Good" },
    { river: "Godavari", bod: 3.8, ph: 7.6, quality: "Acceptable" },
    { river: "Krishna", bod: 4.2, ph: 7.5, quality: "Acceptable" },
];

// Media Data
export const mockFactChecks = [
    { claim: "Viral claim about policy", verdict: "False", date: "2024-01-20" },
    { claim: "Social media misinformation", verdict: "Misleading", date: "2024-01-19" },
    { claim: "News article verification", verdict: "True", date: "2024-01-18" },
    { claim: "Political statement check", verdict: "Mostly True", date: "2024-01-17" },
];
