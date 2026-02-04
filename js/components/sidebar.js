/**
 * sidebar.js
 * Centrally manages the Sidebar navigation to ensure all pages are connected.
 */

const menuItems = [
    { label: 'Homepage', icon: 'ri-dashboard-line', link: 'index.html' },
    { label: 'Population & Migration', icon: 'ri-bar-chart-grouped-line', link: 'population.html' },
    { label: 'Government & Finance', icon: 'ri-government-line', link: 'government.html' },
    { label: 'Citizen Economy', icon: 'ri-money-dollar-circle-line', link: 'economy.html' },
    { label: 'Export & Industry', icon: 'ri-global-line', link: 'export.html' },
    { label: 'Doctors & Work', icon: 'ri-stethoscope-line', link: 'doctors.html' },
    { label: 'Environment', icon: 'ri-leaf-line', link: 'environment.html' },
    { label: 'Social Community', icon: 'ri-discuss-line', link: 'social.html' },
    { label: 'Explore Data', icon: 'ri-compass-3-line', link: 'engagement.html' }
];

export function initSidebar() {
    const sidebar = document.querySelector('.sidebar-nav');
    if (!sidebar) return;

    // determine absolute path depth to handle subpages if needed (simple approximation)
    const isInSubfolder = window.location.pathname.includes('/subpages/');
    const prefix = isInSubfolder ? '../' : '';

    const currentFile = window.location.pathname.split('/').pop() || 'index.html';

    let html = '';
    menuItems.forEach(item => {
        const isActive = currentFile === item.link;
        const activeClass = isActive ? 'active' : '';
        html += `
            <a href="${prefix}${item.link}" class="nav-item ${activeClass}">
                <i class="${item.icon}"></i>
                <span>${item.label}</span>
            </a>
        `;
    });

    sidebar.innerHTML = html;

    // Also Init Drawer Toggle for Mobile
    const toggleBtn = document.querySelector('.mobile-toggle');
    const sidebarEl = document.querySelector('.sidebar');
    if (toggleBtn && sidebarEl) {
        toggleBtn.addEventListener('click', () => {
            sidebarEl.classList.toggle('open');
        });

        // Close when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024 &&
                !sidebarEl.contains(e.target) &&
                !toggleBtn.contains(e.target) &&
                sidebarEl.classList.contains('open')) {
                sidebarEl.classList.remove('open');
            }
        });
    }
}
