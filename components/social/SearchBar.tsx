"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { VerificationBadge } from "./VerificationBadge";

interface SearchResult {
    id: string;
    name: string;
    email: string;
    image?: string;
    verificationLevel: number;
    truthIdVerified: boolean;
    bio?: string;
}

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close results when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Search users with debounce
    useEffect(() => {
        if (query.trim().length === 0) {
            setResults([]);
            setShowResults(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
                if (response.ok) {
                    const data = await response.json();
                    setResults(data);
                    setShowResults(true);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        }, 300); // Debounce 300ms

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleResultClick = (userId: string) => {
        setQuery("");
        setResults([]);
        setShowResults(false);
        router.push(`/profile/${userId}`);
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-md">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-12 pr-12 py-3 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:border-purple-600 transition-colors"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            setResults([]);
                            setShowResults(false);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                )}
                {loading && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600 animate-spin" />
                )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-96 overflow-y-auto z-50">
                    {results.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            No users found
                        </div>
                    ) : (
                        <div className="py-2">
                            {results.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => handleResultClick(user.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                >
                                    {/* Avatar */}
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                        {user.image ? (
                                            <img
                                                src={user.image}
                                                alt={user.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            user.name?.charAt(0).toUpperCase() || "?"
                                        )}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-gray-900 truncate">
                                                {user.name || "Unknown User"}
                                            </span>
                                            <VerificationBadge
                                                level={user.verificationLevel}
                                                verified={user.truthIdVerified}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">
                                            @{user.email.split('@')[0]}
                                        </p>
                                        {user.bio && (
                                            <p className="text-xs text-gray-400 truncate mt-1">
                                                {user.bio}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
