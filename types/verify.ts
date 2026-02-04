export interface ImageAnalysisResult {
    metadataAnalysis: {
        status: 'pass' | 'fail' | 'warning';
        exifIntact: boolean;
        dateTimeConsistency: boolean;
        findings: string[];
    };
    tamperingDetection: {
        status: 'pass' | 'fail' | 'warning';
        confidence: number;
        techniques: string[];
        artifacts: string[];
    };
    aiContextualAnalysis: {
        status: 'pass' | 'fail' | 'warning';
        aiGenerated: boolean;
        deepfakeIndicators: string[];
        contextualIssues: string[];
    };
}

export interface ImageUploadState {
    file: File | null;
    preview: string | null;
    isAnalyzing: boolean;
    result: ImageAnalysisResult | null;
    error: string | null;
}
