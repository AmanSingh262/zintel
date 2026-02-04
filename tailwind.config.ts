import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#5B2D8B",
                    light: "#8E6BBF",
                    dark: "#3D1D5C",
                },
                verification: {
                    real: "#2ECC71",
                    fake: "#E74C3C",
                    misleading: "#F39C12",
                },
                zintel: {
                    green: "#10b981",
                    purple: "#8b5cf6",
                    "purple-dark": "#2e008b",
                },
                background: {
                    light: "#F7F8FA",
                    DEFAULT: "#FFFFFF",
                },
                text: {
                    dark: "#1F2937",
                    muted: "#6B7280",
                },
            },
            fontFamily: {
                sans: ["Inter", "Poppins", "system-ui", "sans-serif"],
                manrope: ["Manrope", "Inter", "system-ui", "sans-serif"],
                mono: ["Monaco", "Courier New", "monospace"],
            },
            animation: {
                "fade-in": "fadeIn 0.6s ease-out",
                "slide-in-left": "slideInLeft 0.6s ease-out",
                "slide-in-right": "slideInRight 0.6s ease-out",
                pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideInLeft: {
                    "0%": { transform: "translateX(-20px)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" },
                },
                slideInRight: {
                    "0%": { transform: "translateX(20px)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
