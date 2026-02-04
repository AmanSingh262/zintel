"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import {
    LayoutDashboard, Users, Building2, DollarSign, Shield,
    Globe, Stethoscope, Leaf, MessageCircle, AlertCircle,
    Settings, User, ShieldCheck
} from "lucide-react";

const navItems = [
    { href: "/", label: "Home", icon: LayoutDashboard },
    { href: "/population", label: "Population & Migration", icon: Users },
    { href: "/government", label: "Government & Finance", icon: Building2 },
    { href: "/economy", label: "Citizen Economy", icon: DollarSign },
    { href: "/export", label: "Export-Import & Industry", icon: Globe },
    { href: "/doctors", label: "Doctors & Workers", icon: Stethoscope },
    { href: "/environment", label: "Environment", icon: Leaf },
    { href: "/compare", label: "Global Data Comparison", icon: Globe },
    { href: "/social", label: "Live Social & Community", icon: MessageCircle },
    { href: "/engagement", label: "News Checker", icon: ShieldCheck },
    { href: "/disclaimer", label: "Disclaimer", icon: AlertCircle },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
            }
        };
        fetchUser();
    }, []);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {/* Logo Area */}
                <div className="py-4 border-b border-gray-200 flex items-center justify-center">
                    <Link 
                        href="/" 
                        className="block"
                        onClick={(e) => {
                            if (onClose) {
                                onClose();
                            }
                        }}
                    >
                        <Image
                            src="/Zintal Logo Without Background.png"
                            alt="Zintel"
                            width={160}
                            height={48}
                            className="w-auto max-w-[140px] h-auto transition-transform hover:scale-105"
                            priority
                        />
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hide">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-item mb-1 ${isActive ? "active" : ""}`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                    <Link href="/settings" className="nav-item mb-1">
                        <Settings className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">Settings</span>
                    </Link>
                    {userId ? (
                        <Link href={`/profile/${userId}`} className="nav-item">
                            <User className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">Profile</span>
                        </Link>
                    ) : (
                        <Link href="/auth/login" className="nav-item">
                            <User className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">Profile</span>
                        </Link>
                    )}
                </div>
        </aside>
        </>
    );
}
