"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Mic2, Headphones, Radio, Sparkles } from "lucide-react";

export default function PodcastsPage() {
    return (
        <DashboardLayout>
            <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
                {/* Coming Soon Banner */}
                <div className="w-full max-w-4xl">
                    {/* Main Card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16">
                        {/* Animated Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                        
                        {/* Content */}
                        <div className="relative z-10 text-center text-white">
                            {/* Icon */}
                            <div className="flex justify-center mb-6 sm:mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                                    <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-6 sm:p-8 border-2 border-white/40">
                                        <Mic2 className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-white" strokeWidth={1.5} />
                                    </div>
                                </div>
                            </div>

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 sm:px-6 py-2 mb-6 sm:mb-8">
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                                <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">Exciting News</span>
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 sm:mb-6 tracking-tight">
                                PODCASTS
                            </h1>
                            
                            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                                <div className="h-1 w-12 sm:w-20 bg-white/40 rounded-full"></div>
                                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                                    Coming Soon
                                </h2>
                                <div className="h-1 w-12 sm:w-20 bg-white/40 rounded-full"></div>
                            </div>

                            {/* Description */}
                            <p className="text-base sm:text-lg lg:text-xl text-purple-100 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
                                Get ready for data-driven insights, fact-checked discussions, and truth-first conversations. 
                                Available in <span className="font-bold text-white">English & हिंदी</span>.
                            </p>

                            {/* Features */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 max-w-3xl mx-auto">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                                    <Radio className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 mx-auto mb-3" />
                                    <h3 className="font-bold text-sm sm:text-base mb-1 sm:mb-2">Live Episodes</h3>
                                    <p className="text-xs sm:text-sm text-purple-200">Real-time discussions</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                                    <Headphones className="w-8 h-8 sm:w-10 sm:h-10 text-pink-300 mx-auto mb-3" />
                                    <h3 className="font-bold text-sm sm:text-base mb-1 sm:mb-2">Expert Insights</h3>
                                    <p className="text-xs sm:text-sm text-purple-200">Data-backed analysis</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                                    <Mic2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-300 mx-auto mb-3" />
                                    <h3 className="font-bold text-sm sm:text-base mb-1 sm:mb-2">Truth-First</h3>
                                    <p className="text-xs sm:text-sm text-purple-200">Verified information</p>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button className="w-full sm:w-auto px-8 py-4 bg-white text-purple-700 rounded-xl font-bold text-base sm:text-lg hover:bg-purple-50 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl">
                                    Notify Me When Live
                                </button>
                                <button className="w-full sm:w-auto px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white/40 rounded-xl font-bold text-base sm:text-lg hover:bg-white/30 transform hover:scale-105 transition-all">
                                    Learn More
                                </button>
                            </div>

                            {/* Coming Date Hint */}
                            <p className="mt-8 sm:mt-10 text-sm sm:text-base text-purple-200 font-medium">
                                🚀 Launching Q1 2026 • Stay Tuned!
                            </p>
                        </div>
                    </div>

                    {/* Bottom Info Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 sm:mt-8">
                        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-purple-100 hover:border-purple-300 transition-all">
                            <div className="flex items-center gap-3 sm:gap-4 mb-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl">
                                    📊
                                </div>
                                <h3 className="font-bold text-base sm:text-lg text-gray-900">Data-Driven Content</h3>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">
                                Every episode backed by verified government data, research papers, and expert analysis.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-purple-100 hover:border-purple-300 transition-all">
                            <div className="flex items-center gap-3 sm:gap-4 mb-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl">
                                    🇮🇳
                                </div>
                                <h3 className="font-bold text-base sm:text-lg text-gray-900">Bilingual Episodes</h3>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">
                                Available in both English and Hindi to reach every Indian citizen with the truth.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
