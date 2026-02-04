/* script.js - Main Application Logic */
import { apiService } from './services/apiService.js';

import { initSidebar } from './components/sidebar.js';
import './core/animations.js';

document.addEventListener('DOMContentLoaded', async () => {
    initSidebar();
    initApp();
});

async function initApp() {
    setupSidebar();
    await loadDashboardData();
}

function setupSidebar() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024 && !sidebar.contains(e.target) && !toggleBtn.contains(e.target) && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    }
}

async function loadDashboardData() {
    const statsContainer = document.getElementById('quick-stats-container');
    const trendingList = document.getElementById('trending-list');

    if (!statsContainer) return; // Not on dashboard page

    // 1. Fetch Data
    try {
        const [popData, gdpData, trends] = await Promise.all([
            apiService.fetchPopulationData(),
            apiService.fetchGDPData(),
            apiService.fetchTrendingTopics()
        ]);

        // 2. Render Quick Stats
        statsContainer.innerHTML = ''; // Clear skeleton

        createStatCard(statsContainer, "Total Population", popData.total, "Updated 20 min ago", "up");
        createStatCard(statsContainer, "Youth Unemployment", popData.demographics.youth, "Critical metric", "down");
        // Note: 'down' in red usually implies bad, but for unemployment going down is good. 
        // Logic: if we want to show it's high/bad, use proper status color, here just using trend colors for visual.

        createStatCard(statsContainer, "Est. GDP (2024)", gdpData.total, `${gdpData.growth} Growth`, "up");
        createStatCard(statsContainer, "Rur/Urb Ratio", `${popData.demographics.rural}/${popData.demographics.urban}`, "Stable", "neutral");

        // Load AI insight immediately
        const factBubble = document.getElementById('daily-fact');
        if (factBubble) {
            factBubble.innerText = "Fetching latest insights...";
            try {
                import('./services/geminiService.js').then(async (module) => {
                    const insight = await module.geminiService.generateInsight('gdp', '7.2%');
                    factBubble.innerText = `"${insight}"`;
                });
            } catch (error) {
                console.error('Gemini error:', error);
                factBubble.innerText = "Data analysis in progress...";
            }
        }

        renderCharts(); // Assuming this function is defined elsewhere or will be added.

        // 3. Render Trending Topics
        if (trendingList) {
            trendingList.innerHTML = '';
            trends.forEach(topic => {
                const item = document.createElement('div');
                item.className = 'trending-item';
                item.innerHTML = `
                    <div class="trending-icon">
                        <i class="ri-${topic.icon}-line"></i>
                    </div>
                    <div class="trending-info">
                        <span class="trending-cat">${topic.category}</span>
                        <h4>${topic.title}</h4>
                        <p>${topic.description}</p>
                    </div>
                `;
                trendingList.appendChild(item);
            });
        }

    } catch (error) {
        console.error("Failed to load data", error);
        statsContainer.innerHTML = '<div class="text-danger">Error loading data. Please try again.</div>';
    }
}

function createStatCard(container, label, value, subtext, trend) {
    const card = document.createElement('div');
    card.className = 'stat-card';

    let trendHtml = '';
    if (trend === 'up') trendHtml = '<span class="stat-trend up"><i class="ri-arrow-up-line"></i> Rising</span>';
    else if (trend === 'down') trendHtml = '<span class="stat-trend down"><i class="ri-arrow-down-line"></i> High</span>';
    else trendHtml = '<span class="stat-trend text-muted"><i class="ri-subtract-line"></i> Stable</span>';

    card.innerHTML = `
        <div class="stat-label">${label}</div>
        <div class="stat-value">${value}</div>
        <div class="flex items-center justify-between mt-2">
            ${trendHtml}
            <span class="text-sm text-muted">${subtext}</span>
        </div>
    `;
    container.appendChild(card);
}

function renderCharts() {
    // Check if we are on a page that needs a specific global chart
    // For now, this is a placeholder to prevent errors.
    // Specific page charts are handled in their respective HTML <script> blocks (e.g., population.html).
    // If we wanted a global chart on index.html:
    const ctx = document.getElementById('globalTrendChart');
    if (ctx) {
        // Render global chart
    }
}
