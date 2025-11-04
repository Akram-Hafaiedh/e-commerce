import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Privacy Policy - ShopStore',
    description: 'Learn how ShopStore collects, uses, and protects your personal information. Your privacy is important to us.',
}

export default function PrivacyPage() {
    const currentYear = new Date().getFullYear();
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative container mx-auto px-4 py-16">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-4">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium">Your Privacy Matters</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Privacy <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">Policy</span>
                        </h1>
                        <p className="text-xl text-white/90 leading-relaxed">
                            We are committed to protecting your privacy and ensuring your personal information is handled securely.
                        </p>
                    </div>
                </div>
            </section>

            {/* Privacy Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-600 text-lg mb-8">
                                    Last updated: {currentYear}. This Privacy Policy describes how ShopStore collects, uses,
                                    and shares your personal information when you visit or make a purchase from our website.
                                </p>

                                <div className="space-y-8">
                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                                        <p className="text-gray-600 mb-4">
                                            We collect information you provide directly to us, including:
                                        </p>
                                        <ul className="text-gray-600 space-y-2 ml-6">
                                            <li>• <strong>Personal Information:</strong> Name, email address, shipping address, and phone number</li>
                                            <li>• <strong>Payment Information:</strong> Credit card details processed securely by our payment partners</li>
                                            <li>• <strong>Order Information:</strong> Products purchased, order history, and preferences</li>
                                            <li>• <strong>Technical Information:</strong> IP address, browser type, device information, and cookies</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                                        <p className="text-gray-600 mb-4">We use the information we collect to:</p>
                                        <ul className="text-gray-600 space-y-2 ml-6">
                                            <li>• Process and fulfill your orders</li>
                                            <li>• Communicate with you about orders, products, and promotions</li>
                                            <li>• Improve our website and customer experience</li>
                                            <li>• Prevent fraud and enhance security</li>
                                            <li>• Comply with legal obligations</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
                                        <p className="text-gray-600">
                                            We do not sell your personal information to third parties. We may share your information with:
                                        </p>
                                        <ul className="text-gray-600 space-y-2 ml-6 mt-2">
                                            <li>• <strong>Service Providers:</strong> Payment processors, shipping carriers, and analytics providers</li>
                                            <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                                            <li>• <strong>Business Transfers:</strong> In connection with a merger or sale of our business</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
                                        <p className="text-gray-600">
                                            We use cookies and similar tracking technologies to enhance your browsing experience,
                                            analyze website traffic, and understand where our visitors come from.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                                        <p className="text-gray-600 mb-4">You have the right to:</p>
                                        <ul className="text-gray-600 space-y-2 ml-6">
                                            <li>• Access the personal information we hold about you</li>
                                            <li>• Correct inaccurate personal information</li>
                                            <li>• Request deletion of your personal information</li>
                                            <li>• Object to processing of your personal information</li>
                                            <li>• Data portability</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                                        <p className="text-gray-600">
                                            We implement appropriate security measures to protect your personal information
                                            against unauthorized access, alteration, disclosure, or destruction.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                                        <p className="text-gray-600">
                                            If you have any questions about this Privacy Policy, please contact us at:
                                        </p>
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                            <p className="text-gray-600">
                                                <strong>Email:</strong> privacy@shopstore.com<br />
                                                <strong>Phone:</strong> +1 (555) 123-4567<br />
                                                <strong>Address:</strong> 123 Commerce Street, New York, NY 10001
                                            </p>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}