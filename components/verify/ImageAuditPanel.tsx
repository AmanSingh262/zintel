"use client";

import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { ImageAnalysisResult } from "@/types/verify";

interface ImageAuditPanelProps {
    result: ImageAnalysisResult | null;
    isLoading: boolean;
}

export function ImageAuditPanel({ result, isLoading }: ImageAuditPanelProps) {
    const [expandedSections, setExpandedSections] = useState({
        metadata: true,
        tampering: true,
        ai: true,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
        switch (status) {
            case 'pass':
                return <CheckCircle className="w-5 h-5 text-zintel-green" />;
            case 'fail':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusBadge = (status: 'pass' | 'fail' | 'warning') => {
        const colors = {
            pass: 'bg-zintel-green text-white',
            fail: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-white',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[status]}`}>
                {status.toUpperCase()}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-black font-manrope text-gray-900">
                    Image Audit Panel
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    Detailed AI analysis of image integrity.
                </p>

                {/* Loading skeletons */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                        <div className="animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!result) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-black font-manrope text-gray-900">
                    Image Audit Panel
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    Detailed AI analysis of image integrity.
                </p>

                <div className="bg-gray-50 rounded-2xl p-8 text-center">
                    <p className="text-gray-500">
                        Upload an image to begin forensic analysis
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-black font-manrope text-gray-900">
                Image Audit Panel
            </h2>
            <p className="text-sm text-gray-600 mb-6">
                Detailed AI analysis of image integrity.
            </p>

            {/* Metadata Analysis */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                    onClick={() => toggleSection('metadata')}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        {getStatusIcon(result.metadataAnalysis.status)}
                        <span className="font-bold font-manrope text-gray-900">
                            Metadata Analysis
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {getStatusBadge(result.metadataAnalysis.status)}
                        {expandedSections.metadata ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                </button>

                {expandedSections.metadata && (
                    <div className="p-4 pt-0 space-y-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">EXIF Data Intact</span>
                            <span className={`font-semibold ${result.metadataAnalysis.exifIntact ? 'text-zintel-green' : 'text-red-500'}`}>
                                {result.metadataAnalysis.exifIntact ? 'Yes' : 'No'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Date/Time Consistency</span>
                            <span className={`font-semibold ${result.metadataAnalysis.dateTimeConsistency ? 'text-zintel-green' : 'text-red-500'}`}>
                                {result.metadataAnalysis.dateTimeConsistency ? 'Consistent' : 'Inconsistent'}
                            </span>
                        </div>
                        {result.metadataAnalysis.findings.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-700 mb-2">Findings:</p>
                                <ul className="space-y-1">
                                    {result.metadataAnalysis.findings.map((finding, idx) => (
                                        <li key={idx} className="text-xs text-gray-600">• {finding}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Tampering Detection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                    onClick={() => toggleSection('tampering')}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        {getStatusIcon(result.tamperingDetection.status)}
                        <span className="font-bold font-manrope text-gray-900">
                            Tampering Detection
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {getStatusBadge(result.tamperingDetection.status)}
                        {expandedSections.tampering ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                </button>

                {expandedSections.tampering && (
                    <div className="p-4 pt-0 space-y-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Confidence Score</span>
                            <span className="font-bold text-gray-900">
                                {result.tamperingDetection.confidence}%
                            </span>
                        </div>
                        {result.tamperingDetection.techniques.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-700 mb-2">Detected Techniques:</p>
                                <ul className="space-y-1">
                                    {result.tamperingDetection.techniques.map((tech, idx) => (
                                        <li key={idx} className="text-xs text-gray-600">• {tech}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {result.tamperingDetection.artifacts.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-700 mb-2">Artifacts Found:</p>
                                <ul className="space-y-1">
                                    {result.tamperingDetection.artifacts.map((artifact, idx) => (
                                        <li key={idx} className="text-xs text-gray-600">• {artifact}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* AI Contextual Analysis */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                    onClick={() => toggleSection('ai')}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        {getStatusIcon(result.aiContextualAnalysis.status)}
                        <span className="font-bold font-manrope text-gray-900">
                            AI Contextual Analysis
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {getStatusBadge(result.aiContextualAnalysis.status)}
                        {expandedSections.ai ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                </button>

                {expandedSections.ai && (
                    <div className="p-4 pt-0 space-y-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">AI Generated</span>
                            <span className={`font-semibold ${result.aiContextualAnalysis.aiGenerated ? 'text-red-500' : 'text-zintel-green'}`}>
                                {result.aiContextualAnalysis.aiGenerated ? 'Yes' : 'No'}
                            </span>
                        </div>
                        {result.aiContextualAnalysis.deepfakeIndicators.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-700 mb-2">Deepfake Indicators:</p>
                                <ul className="space-y-1">
                                    {result.aiContextualAnalysis.deepfakeIndicators.map((indicator, idx) => (
                                        <li key={idx} className="text-xs text-gray-600">• {indicator}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {result.aiContextualAnalysis.contextualIssues.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-700 mb-2">Contextual Issues:</p>
                                <ul className="space-y-1">
                                    {result.aiContextualAnalysis.contextualIssues.map((issue, idx) => (
                                        <li key={idx} className="text-xs text-gray-600">• {issue}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
