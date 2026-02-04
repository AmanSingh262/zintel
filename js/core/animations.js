/**
 * animations.js
 * Handles scroll-based animations using Intersection Observer
 */

export function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe all cards and stat items
    document.querySelectorAll('.card, .stat-card, .trending-item').forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });

    // Add stagger effect
    document.querySelectorAll('.stats-row .stat-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}
