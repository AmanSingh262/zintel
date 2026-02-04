/**
 * geminiService.js
 * Handles interactions with Google Gemini API for data analysis.
 */

export const geminiService = {

    // User provided key
    DEFAULT_KEY: 'AIzaSyAVUcT9WwMlkGzGlsIeHTeDTZprRj99QuY',

    getApiKey() {
        return localStorage.getItem('zintel_gemini_key') || this.DEFAULT_KEY;
    },

    saveApiKey(key) {
        localStorage.setItem('zintel_gemini_key', key);
    },

    /**
     * Generates an insight based on the provided context/data label.
     * Use "Simulated Mode" if no key is found.
     */
    async generateInsight(context, dataPoint) {
        const apiKey = this.getApiKey();

        if (!apiKey) {
            // Simulation Mode
            await new Promise(r => setTimeout(r, 1200)); // Network delay
            return this.getSimulatedInsight(context);
        }

        // Real API Call
        try {
            const prompt = `Analyze this data point for the Indian context: ${context} is ${dataPoint}. Provide a 1-sentence insight for a Gen-Z audience.`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;

        } catch (error) {
            console.error("Gemini API Error:", error);
            return "AI Service Unavailable.";
        }
    },

    /**
     * Asks Gemini for a specific raw data point (e.g., "Current India GDP").
     * Returns a cleaned string value.
     */
    async fetchLiveValue(topic) {
        const apiKey = this.getApiKey();
        if (!apiKey) return null;

        try {
            const prompt = `What is the current estimated ${topic} of India for 2024-2025? Return ONLY the number and unit (e.g. "1.45B" or "$3.9T"). Do not write any other text.`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text.trim();
            return text.replace(/\*/g, ''); // Remove markdown bold if any
        } catch (error) {
            console.warn("Gemini Live Fetch Failed:", error);
            return null; // Fallback to mock
        }
    },

    getSimulatedInsight(context) {
        const insights = {
            "population": "India's demographic dividend is peaking, with 65% of the population under 35 driving the digital economy.",
            "gdp": "With 7.2% growth, India is the fastest-growing major economy, fueled by tech and manufacturing.",
            "inflation": "Inflation is stabilizing at 5.4%, offering relief to household budgets this quarter.",
            "default": "AI analysis suggests a positive upward trend in this sector compared to last fiscal year."
        };
        return insights[context] || insights["default"];
    }
};
