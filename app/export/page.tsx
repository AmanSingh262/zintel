import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlobalExportReach } from "@/components/export/GlobalExportReach";
import { ProductLevelChart } from "@/components/export/ProductLevelChart";
import { TradeDeficitChart } from "@/components/export/TradeDeficitChart";
import { IndustryRevenueChart } from "@/components/export/IndustryRevenueChart";
import { MSMEContributionChart } from "@/components/export/MSMEContributionChart";
import { StartupFundingChart } from "@/components/export/StartupFundingChart";

export default function ExportPage() {
    return (
        <DashboardLayout>
            <div className="container mx-auto px-6 py-8 max-w-7xl">
                {/* Page Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    Export-Import & Industry
                </h1>

                {/* Dashboard Grid */}
                <div className="space-y-6">
                    {/* Global Export Reach */}
                    <GlobalExportReach />

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Product-Level Import vs Export */}
                        <ProductLevelChart />

                        {/* Annual Trade Deficit/Surplus */}
                        <TradeDeficitChart />
                    </div>

                    {/* Major Industry Revenue Growth */}
                    <IndustryRevenueChart />

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* MSME Sector Contribution */}
                        <MSMEContributionChart />

                        {/* Startup Funding Distribution */}
                        <StartupFundingChart />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
