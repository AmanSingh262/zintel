import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DisclaimerPage() {
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Disclaimer</h1>

                <div className="space-y-8">
                    {/* Data Verification */}
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Data Verification & Sources</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                Zintel aggregates data from official government sources, primarily from{" "}
                                <strong>data.gov.in</strong> and other verified institutional databases.
                            </p>
                            <p>
                                All data is cross-verified with multiple sources before publication. Our system
                                automatically updates data every <strong>20 minutes</strong> to ensure currency
                                and accuracy.
                            </p>
                            <p className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                                <strong>Note:</strong> While we strive for 100% accuracy, data lag or API
                                limitations may occasionally affect real-time accuracy. Always refer to official
                                government sources for critical decisions.
                            </p>
                        </div>
                    </div>

                    {/* AI Disclaimer */}
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-4 text-primary">AI & Verification Technology</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                Our news verification system uses AI-assisted fact-checking combined with manual
                                review by trained analysts. The system provides:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    <strong>Confidence Scores:</strong> Algorithmic assessment of claim veracity
                                    (0-100%)
                                </li>
                                <li>
                                    <strong>Source Verification:</strong> Cross-referencing with credible news
                                    outlets and official data
                                </li>
                                <li>
                                    <strong>Community Reporting:</strong> User-submitted reports reviewed by our team
                                </li>
                            </ul>
                            <p className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                                <strong>AI Limitation:</strong> AI systems can make errors. All high-stakes
                                verification undergoes human review. Users are encouraged to report
                                discrepancies.
                            </p>
                        </div>
                    </div>

                    {/* Privacy & Truth ID */}
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Privacy & Truth ID System</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                The <strong>Truth ID</strong> verification system uses masked Aadhaar/Voter ID
                                verification:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Only last 4 digits of ID are stored (encrypted)</li>
                                <li>Full ID numbers are NEVER stored on our servers</li>
                                <li>Verification is done via secure, government-approved APIs</li>
                                <li>Users can revoke verification anytime</li>
                            </ul>
                            <p className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                                <strong>Privacy Guarantee:</strong> We comply with all Indian data protection
                                laws. Your personal data is never sold or shared with third parties.
                            </p>
                        </div>
                    </div>

                    {/* Attribution */}
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Attribution & Usage</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>All data visualizations and statistics on Zintel are:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Attributed to original government sources</li>
                                <li>Free to share with proper attribution</li>
                                <li>Updated with timestamps showing data freshness</li>
                            </ul>
                            <p>
                                When sharing Zintel content on social media, please include attribution: "Data
                                from Zintel.in | Source: data.gov.in"
                            </p>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="card bg-gray-50">
                        <h2 className="text-xl font-bold mb-3">Questions or Concerns?</h2>
                        <p className="text-gray-700 mb-4">
                            If you find inaccurate data or have questions about our verification process,
                            please contact us:
                        </p>
                        <div className="flex gap-4">
                            <button className="btn btn-primary">Report Issue</button>
                            <button className="btn btn-outline">Contact Support</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
