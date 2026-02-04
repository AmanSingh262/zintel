"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifyNewsPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the image verification page
        router.push("/verify-news/image");
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting to image verification...</p>
            </div>
        </div>
    );
}
