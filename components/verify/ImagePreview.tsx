"use client";

import { Download, Upload } from "lucide-react";
import Image from "next/image";

interface ImagePreviewProps {
    imageUrl: string;
    fileName: string;
    isForgeryDetected: boolean;
    onUploadNew: () => void;
    onDownloadReport: () => void;
}

export function ImagePreview({
    imageUrl,
    fileName,
    isForgeryDetected,
    onUploadNew,
    onDownloadReport,
}: ImagePreviewProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-black font-manrope text-gray-900">
                Image Preview & Status
            </h2>

            <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                <Image
                    src={imageUrl}
                    alt="Uploaded image"
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                />

                {isForgeryDetected && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                        ⚠️ Forgery Detected
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onUploadNew}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                    <Upload className="w-4 h-4" />
                    Upload New Image
                </button>

                <button
                    onClick={onDownloadReport}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zintel-purple-dark text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                >
                    <Download className="w-4 h-4" />
                    Download Audit Report
                </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
                File: {fileName}
            </p>
        </div>
    );
}
