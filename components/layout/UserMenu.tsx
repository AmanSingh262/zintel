"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
}

export function UserMenu() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        checkUser();

        // Close menu when clicking outside
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const checkUser = async () => {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser) {
            // Fetch user profile from database
            const response = await fetch(`/api/user/profile?userId=${authUser.id}`);
            if (response.ok) {
                const data = await response.json();
                setUser(data.profile);
            } else {
                // Fallback to auth user data
                setUser({
                    id: authUser.id,
                    name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
                    email: authUser.email || '',
                    image: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture,
                });
            }
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setIsOpen(false);
        router.push("/");
        router.refresh();
    };

    if (!user) {
        return (
            <Link href="/auth/login">
                <button
                    className="px-6 py-2 rounded-xl font-semibold transition-colors"
                    style={{ backgroundColor: "#2e008b", color: "white" }}
                >
                    Login
                </button>
            </Link>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
                {user.image ? (
                    <div className="w-10 h-10 rounded-full border-2 border-purple-500 overflow-hidden flex-shrink-0">
                        <Image
                            src={user.image}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            style={{ width: '40px', height: '40px' }}
                        />
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-green-600 flex items-center justify-center text-white font-bold border-2 border-purple-500">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        <Link
                            href={`/profile/${user.id}`}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-gray-700 font-semibold">My Profile</span>
                        </Link>

                        <Link
                            href="/profile/settings"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-gray-700 font-semibold">Account Settings</span>
                        </Link>

                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-gray-700 font-semibold">Data Dashboard</span>
                        </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200 pt-2">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors w-full text-left"
                        >
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="text-red-600 font-semibold">Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
