/**
 * Budget API Helper
 * Centralized API URL configuration for Government Finance Backend
 */

const BUDGET_API_URL = process.env.NEXT_PUBLIC_BUDGET_SERVER_URL || 'http://localhost:8002';

export const budgetApi = {
  // Base URL
  baseUrl: BUDGET_API_URL,

  // Budget endpoints
  budgetOverview: (year: number) => `${BUDGET_API_URL}/budget/overview?year=${year}`,
  budgetMinistries: (year: number) => `${BUDGET_API_URL}/budget/ministries?year=${year}`,
  budgetWelfare: () => `${BUDGET_API_URL}/budget/welfare`,
  budgetTrend: () => `${BUDGET_API_URL}/budget/trend`,
  budgetStatesSectors: () => `${BUDGET_API_URL}/budget/states-sectors`,

  // Revenue endpoints
  revenueSummary: (year: number) => `${BUDGET_API_URL}/revenue/summary?year=${year}`,
  revenueStateGst: () => `${BUDGET_API_URL}/revenue/state-gst`,

  // States endpoints
  statesBudgets: (year: number) => `${BUDGET_API_URL}/states/budgets?year=${year}`,

  // Economy endpoints
  economyIndicators: () => `${BUDGET_API_URL}/economy/indicators`,

  // Environment endpoints
  environmentAqiPollution: () => `${BUDGET_API_URL}/environment/aqi-pollution`,
  environmentWaterScarcity: () => `${BUDGET_API_URL}/environment/water-scarcity`,
  environmentWasteGeneration: () => `${BUDGET_API_URL}/environment/waste-generation`,
  environmentWaterUsage: () => `${BUDGET_API_URL}/environment/water-usage`,

  // Export endpoints
  exportTradeBalance: () => `${BUDGET_API_URL}/export/trade-balance`,
  exportStartupFunding: () => `${BUDGET_API_URL}/export/startup-funding`,
  exportProductLevel: () => `${BUDGET_API_URL}/export/product-level`,
  exportMsmeContribution: () => `${BUDGET_API_URL}/export/msme-contribution`,

  // Compare endpoints
  compareSummary: (params: { states: string; year: number }) => 
    `${BUDGET_API_URL}/compare/summary?states=${params.states}&year=${params.year}`,
  comparePopulation: (params: { states: string; year: number }) => 
    `${BUDGET_API_URL}/compare/population?states=${params.states}&year=${params.year}`,
  compareGdp: () => `${BUDGET_API_URL}/compare/gdp`,
  compareGdpComposition: () => `${BUDGET_API_URL}/compare/gdp-composition`,

  // Salary/Doctor endpoints
  salarySkillDemandHeatmap: () => `${BUDGET_API_URL}/salary/skill-demand-heatmap`,
  salaryGeekWorkerContribution: () => `${BUDGET_API_URL}/salary/geek-worker-contribution`,
  salarySectorWiseByState: () => `${BUDGET_API_URL}/salary/sector-wise-by-state`,

  // Economy endpoints (extended)
  economyStats: () => `${BUDGET_API_URL}/economy/stats`,
  economyIncomeTrend: () => `${BUDGET_API_URL}/economy/income/trend`,
  economyIncomeStates: () => `${BUDGET_API_URL}/economy/income/states`,
  economyIncomeDistribution: () => `${BUDGET_API_URL}/economy/income/distribution`,
  economyTradeBalance: () => `${BUDGET_API_URL}/economy/trade/balance`,
  economyStartups: () => `${BUDGET_API_URL}/economy/startups`,
  economyPoverty: () => `${BUDGET_API_URL}/economy/poverty`,

  // State-specific data
  stateData: (state: string, year: number) => 
    `${BUDGET_API_URL}/states/${state.replace(/ /g, '-')}?year=${year}`,
};

export default budgetApi;
