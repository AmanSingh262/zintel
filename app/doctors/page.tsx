import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DoctorSalaryChart } from "@/components/doctors/DoctorSalaryChart";
import { SkillDemandTable } from "@/components/doctors/SkillDemandTable";
import { GeekContributionChart } from "@/components/doctors/GeekContributionChart";

export default function DoctorsPage() {
    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8 max-w-7xl" style={{ backgroundColor: "#f8f9fa" }}>
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-gray-900">
                        Doctors, Salaries & Geek Workers Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">Real-time salary insights across all major sectors in India</p>
                </div>

                {/* Full-Width Sector Salary Chart */}
                <div className="mb-6">
                    <DoctorSalaryChart />
                </div>

                {/* 2-Column Grid for Other Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SkillDemandTable />
                    <GeekContributionChart />
                </div>
            </div>
        </DashboardLayout>
    );
}
