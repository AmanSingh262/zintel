"use server";

import { prisma } from "@/lib/prisma";
import { ReportType, ReportStatus } from "@prisma/client";
import { headers } from "next/headers";

// Rate limiting map (in-memory for simplicity, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 10; // 10 reports per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Check if user has exceeded rate limit
 */
async function checkRateLimit(userId: string): Promise<boolean> {
    const now = Date.now();
    const userLimit = rateLimitMap.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
        rateLimitMap.set(userId, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW,
        });
        return true;
    }

    if (userLimit.count >= RATE_LIMIT) {
        return false;
    }

    userLimit.count++;
    return true;
}

/**
 * AI spam pre-scan placeholder
 * Returns a score from 0-100 (higher = more likely spam)
 */
function aiSpamPreScan(description: string): number {
    // Placeholder logic - replace with actual AI model
    const spamKeywords = ["click here", "buy now", "limited offer", "winner", "congratulations"];
    let score = 0;

    const lowerDesc = description.toLowerCase();
    spamKeywords.forEach(keyword => {
        if (lowerDesc.includes(keyword)) score += 20;
    });

    // Check for excessive caps
    const capsPercent = (description.match(/[A-Z]/g) || []).length / description.length;
    if (capsPercent > 0.5) score += 30;

    return Math.min(score, 100);
}

/**
 * Create audit log for compliance (IT Rules 2021)
 */
async function createAuditLog(
    reportId: string,
    userId: string,
    action: string,
    ipAddress?: string,
    userAgent?: string
) {
    await prisma.auditLog.create({
        data: {
            reportId,
            userId,
            action,
            ipAddress,
            userAgent,
            createdAt: new Date(),
        },
    });
}

/**
 * Submit a new community report
 */
export async function submitReport(data: {
    userId: string;
    type: ReportType;
    title: string;
    description: string;
}) {
    try {
        // Check if user exists and has Level 1+ auth
        const user = await prisma.user.findUnique({
            where: { id: data.userId },
            select: { id: true, emailVerified: true, role: true },
        });

        if (!user || !user.emailVerified) {
            return {
                success: false,
                error: "Level 1+ authentication required to submit reports",
            };
        }

        // Rate limiting check
        const withinLimit = await checkRateLimit(data.userId);
        if (!withinLimit) {
            return {
                success: false,
                error: "Rate limit exceeded. Maximum 10 reports per hour.",
            };
        }

        // AI spam pre-scan
        const spamScore = aiSpamPreScan(data.description);

        // Get IP and user agent for audit log
        const headersList = await headers();
        const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip");
        const userAgent = headersList.get("user-agent");

        // Create the report
        const report = await prisma.communityReport.create({
            data: {
                userId: data.userId,
                type: data.type,
                title: data.title,
                description: data.description,
                status: ReportStatus.PENDING,
                aiSpamScore: spamScore,
                createdAt: new Date(),
            },
        });

        // Create audit log for compliance
        await createAuditLog(
            report.id,
            data.userId,
            "SUBMITTED",
            ipAddress || undefined,
            userAgent || undefined
        );

        return {
            success: true,
            reportId: report.id,
            message: "Report submitted successfully",
        };
    } catch (error) {
        console.error("Error submitting report:", error);
        return {
            success: false,
            error: "Failed to submit report. Please try again.",
        };
    }
}

/**
 * Get current user's reports
 */
export async function getMyReports(userId: string) {
    try {
        const reports = await prisma.communityReport.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                type: true,
                title: true,
                description: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                resolvedAt: true,
            },
        });

        return {
            success: true,
            reports,
        };
    } catch (error) {
        console.error("Error fetching user reports:", error);
        return {
            success: false,
            error: "Failed to fetch reports",
            reports: [],
        };
    }
}

/**
 * Get moderation summary statistics
 */
export async function getModerationSummary() {
    try {
        // Try to get cached stats first
        let stats = await prisma.moderationStats.findFirst({
            orderBy: { lastUpdated: "desc" },
        });

        // If no stats or stats are older than 5 minutes, recalculate
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        if (!stats || stats.lastUpdated < fiveMinutesAgo) {
            const totalReports = await prisma.communityReport.count();
            const pendingReports = await prisma.communityReport.count({
                where: { status: ReportStatus.PENDING },
            });

            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const resolvedThisWeek = await prisma.communityReport.count({
                where: {
                    status: ReportStatus.RESOLVED,
                    resolvedAt: { gte: oneWeekAgo },
                },
            });

            // Get trending categories
            const reportsByType = await prisma.communityReport.groupBy({
                by: ["type"],
                _count: true,
                orderBy: { _count: { type: "desc" } },
            });

            const trendingCategories = JSON.stringify(
                reportsByType.map(item => ({
                    category: item.type,
                    count: item._count,
                }))
            );

            // Update or create stats
            if (stats) {
                stats = await prisma.moderationStats.update({
                    where: { id: stats.id },
                    data: {
                        totalReports,
                        pendingReports,
                        resolvedThisWeek,
                        activeModerators: 12, // Placeholder
                        trendingCategories,
                        lastUpdated: new Date(),
                    },
                });
            } else {
                stats = await prisma.moderationStats.create({
                    data: {
                        totalReports,
                        pendingReports,
                        resolvedThisWeek,
                        activeModerators: 12, // Placeholder
                        trendingCategories,
                    },
                });
            }
        }

        return {
            success: true,
            stats: {
                totalReports: stats.totalReports,
                pendingReports: stats.pendingReports,
                resolvedThisWeek: stats.resolvedThisWeek,
                activeModerators: stats.activeModerators,
                trendingCategories: stats.trendingCategories
                    ? JSON.parse(stats.trendingCategories)
                    : [],
            },
        };
    } catch (error) {
        console.error("Error fetching moderation summary:", error);
        return {
            success: false,
            error: "Failed to fetch moderation summary",
        };
    }
}
