"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNavigation() {
    const pathname = usePathname();

    const navItems = [
        { href: "/explore", icon: "ri-lightbulb-flash-line", label: "Explore Facts" },
        { href: "/engagement", icon: "ri-shield-check-line", label: "News Checker" },
        { href: "/compare", icon: "ri-bar-chart-grouped-line", label: "Data Compare" },
        { href: "/social", icon: "ri-live-line", label: "Live Social" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50">
            <div className="grid grid-cols-4 gap-1 px-2 py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition ${isActive
                                    ? "bg-purple-50 text-purple-600"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <i className={`${item.icon} text-2xl mb-1`}></i>
                            <span className="text-[10px] font-medium text-center leading-tight">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
