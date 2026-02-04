// FIXED POPULATION CALCULATION LOGIC
// Jan 1, 2026 baseline: 1.4289 billion
// Annual growth: 0.8% = ~11.4 million per year
// After 34 days: ~1.43 billion (current)
// YTD Growth: ~1.06 million

const jan1_2026 = 1428900000; // Jan 1 baseline
const growthRate = 0.008;
const annualIncrease = jan1_2026 * growthRate;
const increasePerMs = annualIncrease / (365.25 * 24 * 60 * 60 * 1000);

const now = new Date();
const startOfYear = new Date(now.getFullYear(), 0, 1);
const msElapsed = now.getTime() - startOfYear.getTime();

const currentPopulation = jan1_2026 + (increasePerMs * msElapsed);

setLivePopulation(currentPopulation);
setStartOfYearPop(jan1_2026);

const clockInterval = setInterval(() => {
    setLivePopulation(prev => prev + (increasePerMs * 100));
}, 100);
