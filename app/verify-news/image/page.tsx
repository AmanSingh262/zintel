"use client";

import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ImageUploadZone } from "@/components/verify/ImageUploadZone";
import { ImagePreview } from "@/components/verify/ImagePreview";
import { ImageAuditPanel } from "@/components/verify/ImageAuditPanel";
import { ImageAnalysisResult } from "@/types/verify";

export default function ImageVerificationPage() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelect = useCallback(async (file: File) => {
        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        if (!validTypes.includes(file.type)) {
            setError("Invalid file type. Only JPG, PNG, and WebP are supported.");
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setError("File size exceeds 10MB limit.");
            return;
        }

        setError(null);
        setUploadedFile(file);

        // Generate preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Start analysis
        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            console.log("Starting image analysis...");
            const formData = new FormData();
            formData.append("image", file);

            // Call both APIs in parallel for comprehensive analysis
            const [imageAnalysis, ocrAnalysis] = await Promise.allSettled([
                // Gemini-based forensic analysis
                fetch("/api/verify-image", {
                    method: "POST",
                    body: formData,
                }).then(async (res) => {
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
                        throw new Error(errorData.error || `Server error: ${res.status}`);
                    }
                    return res.json();
                }),
                
                // Python OCR-based news verification
                fetch("http://localhost:8001/verify-ocr", {
                    method: "POST",
                    body: (() => {
                        const fd = new FormData();
                        fd.append("file", file);
                        return fd;
                    })(),
                }).then(async (res) => {
                    if (!res.ok) {
                        throw new Error(`OCR analysis failed: ${res.status}`);
                    }
                    return res.json();
                }).catch((err) => {
                    console.log("OCR analysis unavailable:", err.message);
                    return null; // OCR is optional
                })
            ]);

            let result: ImageAnalysisResult;

            if (imageAnalysis.status === 'fulfilled') {
                result = imageAnalysis.value;
                
                // Enhance with OCR results if available
                if (ocrAnalysis.status === 'fulfilled' && ocrAnalysis.value) {
                    const ocr = ocrAnalysis.value;
                    
                    // Add OCR findings to AI contextual analysis
                    if (ocr.extracted_text) {
                        result.aiContextualAnalysis.contextualIssues.unshift(
                            `📰 Text detected: "${ocr.extracted_text.substring(0, 100)}${ocr.extracted_text.length > 100 ? '...' : ''}"`
                        );
                    }
                    
                    if (ocr.verified_source) {
                        result.aiContextualAnalysis.contextualIssues.unshift(
                            `✅ Verified: Matches trusted news source - ${ocr.database_match?.source || 'database'}`
                        );
                        result.aiContextualAnalysis.status = 'pass';
                    } else if (ocr.overall_prediction === 'REAL') {
                        result.aiContextualAnalysis.contextualIssues.unshift(
                            `✓ Content appears authentic based on text analysis`
                        );
                    } else if (ocr.overall_prediction === 'FAKE') {
                        result.aiContextualAnalysis.contextualIssues.unshift(
                            `⚠️ Warning: Text content flagged as potentially fake news`
                        );
                        result.aiContextualAnalysis.status = 'warning';
                    }
                }
                
                console.log("Analysis result:", result);
                setAnalysisResult(result);
            } else {
                throw imageAnalysis.reason;
            }
        } catch (err: any) {
            console.error("Analysis error:", err);
            const errorMessage = err.message || "Failed to analyze image. Please try again.";
            setError(errorMessage);
        } finally {
            setIsAnalyzing(false);
        }
    }, []);

    const handleUploadNew = useCallback(() => {
        setUploadedFile(null);
        setImagePreview(null);
        setAnalysisResult(null);
        setError(null);
    }, []);

    const handleDownloadReport = useCallback(() => {
        if (!analysisResult || !uploadedFile) return;

        // Generate text report
        const report = `
NEWS CHECKERS AUDIT REPORT
================================
Generated: ${new Date().toLocaleString()}
File: ${uploadedFile.name}

METADATA ANALYSIS
-----------------
Status: ${analysisResult.metadataAnalysis.status.toUpperCase()}
EXIF Data Intact: ${analysisResult.metadataAnalysis.exifIntact ? 'Yes' : 'No'}
Date/Time Consistency: ${analysisResult.metadataAnalysis.dateTimeConsistency ? 'Yes' : 'No'}

Findings:
${analysisResult.metadataAnalysis.findings.map(f => `- ${f}`).join('\n')}

TAMPERING DETECTION
-------------------
Status: ${analysisResult.tamperingDetection.status.toUpperCase()}
Confidence: ${analysisResult.tamperingDetection.confidence}%

Techniques Detected:
${analysisResult.tamperingDetection.techniques.map(t => `- ${t}`).join('\n')}

Artifacts Found:
${analysisResult.tamperingDetection.artifacts.map(a => `- ${a}`).join('\n')}

AI CONTEXTUAL ANALYSIS
----------------------
Status: ${analysisResult.aiContextualAnalysis.status.toUpperCase()}
AI Generated: ${analysisResult.aiContextualAnalysis.aiGenerated ? 'Yes' : 'No'}

Deepfake Indicators:
${analysisResult.aiContextualAnalysis.deepfakeIndicators.map(i => `- ${i}`).join('\n')}

Contextual Issues:
${analysisResult.aiContextualAnalysis.contextualIssues.map(i => `- ${i}`).join('\n')}

---
Report generated by Zintel.in News Checkers System
Powered by Google Gemini 1.5 Flash
        `.trim();

        // Download as text file
        const blob = new Blob([report], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `image-audit-${uploadedFile.name}-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [analysisResult, uploadedFile]);

    const isForgeryDetected =
        analysisResult?.tamperingDetection.status === 'fail' ||
        analysisResult?.aiContextualAnalysis.status === 'fail';

    return (
        <DashboardLayout>
            <div className="container mx-auto px-6 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black font-manrope text-gray-900 mb-2">
                        News Checkers
                    </h1>
                    <p className="text-gray-600">
                        Upload an image to check its authenticity and detect potential manipulations.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-700 font-medium">⚠️ {error}</p>
                    </div>
                )}

                {/* 2-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column (8/12) - Upload & Preview */}
                    <div className="lg:col-span-8 space-y-6">
                        {!imagePreview ? (
                            <ImageUploadZone
                                onImageSelect={handleImageSelect}
                                isAnalyzing={isAnalyzing}
                            />
                        ) : (
                            <ImagePreview
                                imageUrl={imagePreview}
                                fileName={uploadedFile?.name || "Unknown"}
                                isForgeryDetected={isForgeryDetected}
                                onUploadNew={handleUploadNew}
                                onDownloadReport={handleDownloadReport}
                            />
                        )}
                    </div>

                    {/* Right Column (4/12) - Audit Panel */}
                    <div className="lg:col-span-4">
                        <ImageAuditPanel
                            result={analysisResult}
                            isLoading={isAnalyzing}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
