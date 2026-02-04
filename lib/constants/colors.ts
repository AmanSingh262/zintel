/**
 * Zintel Brand Colors and Design System Constants
 */

export const ZINTEL_COLORS = {
    // Primary Brand Colors
    primary: {
        purple: '#2e008b',      // Zintel Purple Dark
        purpleLight: '#6b21a8', // Zintel Purple Light
        green: '#10b981',       // Zintel Green (for maps, highlights)
        greenLight: '#34d399',  // Zintel Green Light
    },

    // UI Colors
    ui: {
        background: '#ffffff',
        backgroundGray: '#f9fafb',
        border: '#e5e7eb',
        borderDark: '#d1d5db',
    },

    // Text Colors
    text: {
        primary: '#111827',
        secondary: '#6b7280',
        muted: '#9ca3af',
        white: '#ffffff',
    },

    // Status Colors
    status: {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
    },

    // Data Visualization Colors (for charts)
    chart: {
        primary: '#2e008b',
        secondary: '#10b981',
        tertiary: '#f59e0b',
        quaternary: '#3b82f6',
        quinary: '#8b5cf6',
    },

    // Heat Map Colors (for geospatial visualizations)
    heatMap: {
        low: '#dcfce7',      // Very light green
        mediumLow: '#86efac', // Light green
        medium: '#10b981',    // Zintel green
        mediumHigh: '#059669', // Dark green
        high: '#047857',      // Very dark green
    },
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
    fast: 200,
    normal: 400,
    slow: 800,
    chart: 800,
} as const;

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
    mobile: 390,      // iPhone 14 Pro
    tablet: 768,
    desktop: 1024,
    wide: 1920,
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
    base: 0,
    dropdown: 10,
    modal: 50,
    tooltip: 100,
    notification: 1000,
} as const;
