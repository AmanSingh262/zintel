import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <h1 className="text-4xl font-bold mb-8">Settings</h1>
            <div className="card">
                <p className="text-gray-600">Account settings and preferences.</p>
            </div>
        </DashboardLayout>
    );
}
