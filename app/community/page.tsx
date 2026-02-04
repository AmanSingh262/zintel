import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportNewIssue } from "@/components/community/ReportNewIssue";
import { MyRecentReports } from "@/components/community/MyRecentReports";
import { ModerationOverview } from "@/components/community/ModerationOverview";
import { TrendingCategories } from "@/components/community/TrendingCategories";

export default function CommunityPage() {
    // TODO: Get actual user ID from session/auth
    const userId = "demo-user-id";

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Community & Reporting</h1>
                    <p className="text-lg text-gray-600">
                        Help us maintain truth by reporting misleading content.
                    </p>
                </div>

                {/* Moderation Overview Stats */}
                <div className="mb-8">
                    <ModerationOverview />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Left Column - Report New Issue */}
                    <div>
                        <ReportNewIssue userId={userId} />
                    </div>

                    {/* Right Column - Trending Categories */}
                    <div>
                        <TrendingCategories />
                    </div>
                </div>

                {/* My Recent Reports - Full Width */}
                <div>
                    <MyRecentReports userId={userId} />
                </div>
            </div>
        </DashboardLayout>
    );
}
