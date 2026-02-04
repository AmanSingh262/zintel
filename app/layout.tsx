import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import "../css/style.css";

const outfit = Outfit({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: "#2e008b",
};

export const metadata: Metadata = {
    title: "Zintel - Gen-Z Unfiltered News & Facts",
    description: "Truth backed by data, not opinions. A data-driven, AI-assisted civic platform for India.",
    keywords: ["India", "data", "news", "verification", "facts", "civic platform", "gen-z", "zintel"],
    openGraph: {
        title: "Zintel - India's Data-Driven Civic Platform",
        description: "Verify news, explore facts, and engage with real data. Truth backed by numbers.",
        type: "website",
        locale: "en_IN",
        siteName: "Zintel",
    },
    twitter: {
        card: "summary_large_image",
        title: "Zintel - Unfiltered News & Facts",
        description: "Truth backed by data. Join the movement for verified information.",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
            </head>
            <body className={`${outfit.variable} font-sans antialiased`} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
