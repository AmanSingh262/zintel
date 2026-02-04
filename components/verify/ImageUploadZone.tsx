"use client";

import { Upload, Camera } from "lucide-react";
import { useCallback, useRef } from "react";

interface ImageUploadZoneProps {
    onImageSelect: (file: File) => void;
    isAnalyzing: boolean;
}

export function ImageUploadZone({ onImageSelect, isAnalyzing }: ImageUploadZoneProps) {
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();

            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                onImageSelect(file);
            }
        },
        [onImageSelect]
    );

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                onImageSelect(file);
            }
        },
        [onImageSelect]
    );

    const handleCameraClick = useCallback(() => {
        cameraInputRef.current?.click();
    }, []);

    return (
        <div className="space-y-4">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-zintel-purple transition-colors cursor-pointer bg-gray-50"
            >
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileInput}
                    className="hidden"
                    id="image-upload"
                    disabled={isAnalyzing}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-900 mb-1">
                                Drag & drop image here or click to upload
                            </p>
                            <p className="text-sm text-gray-500">
                                Supports JPG, PNG, WebP (Max 10MB)
                            </p>
                        </div>
                    </div>
                </label>
            </div>

            {/* Camera Capture Button */}
            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={handleCameraClick}
                    disabled={isAnalyzing}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-zintel-purple text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Camera className="w-5 h-5" />
                    <span>Take Photo / Use Camera</span>
                </button>
                <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={isAnalyzing}
                />
            </div>
        </div>
    );
}
