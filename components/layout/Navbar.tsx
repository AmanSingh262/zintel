"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Bell, Menu } from "lucide-react";
import { useState } from "react";

const topNavLinks = [
    { href: "/explore", label: "Explore Facts" },
    { href: "/engagement", label: "News Checker" },
    { href: "/podcasts", label: "Podcasts" },
    { href: "/compare", label: "Data Compare" },
    { href: "/social", label: "Community" },
];

export function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <header className="sticky top-0 h-18 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 flex items-center justify-between z-40">
            {/* Left Section */}
            <div className="flex items-center gap-6">
                <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                    <Menu className="w-6 h-6" />
                </button>

                {/* Z Logo Icon */}
                <Image
                    src="/Zintal logo Z without Background.png"
                    alt="Z"
                    width={36}
                    height={36}
                    className="object-contain"
                />

                {/* Top Nav Links */}
                <nav className="hidden md:flex items-center gap-6 text-sm">
                    {topNavLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-gray-600 hover:text-primary font-medium transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search news, facts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                </div>

                {/* Notifications */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                </button>

                {/* Login Button */}
                <Link href="/auth/login" className="btn btn-primary">
                    Login
                </Link>
            </div>
        </header>
    );
}
