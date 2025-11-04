import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Terms of Service - ShopStore',
    description: 'Read our Terms of Service to understand the rules and guidelines for using ShopStore website and services.',
}
export default function TermsPage() {

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
                            <span className="text-sm font-medium">Legal Terms</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Terms of <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">Service</span>
                        </h1>
                        <p className="text-xl text-white/90 leading-relaxed">
                            Please read these terms carefully before using our website and services.
                        </p>
                    </div>
                </div>
            </section>

            {/* Terms Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-600 text-lg mb-8">
                                    Last updated: {currentYear}. These Terms of Service govern your use of
                                    ShopStore website and the services we provide.
                                </p>

                                <div className="space-y-8">
                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                                        <p className="text-gray-600">
                                            By accessing or using our website, you agree to be bound by these Terms of Service
                                            and our Privacy Policy. If you disagree with any part of the terms, you may not access our services.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Account Registration</h2>
                                        <p className="text-gray-600 mb-4">
                                            To access certain features, you may be required to register for an account. You agree to:
                                        </p>
                                        <ul className="text-gray-600 space-y-2 ml-6">
                                            <li>• Provide accurate and complete registration information</li>
                                            <li>• Maintain the security of your password</li>
                                            <li>• Accept responsibility for all activities under your account</li>
                                            <li>• Notify us immediately of any unauthorized use of your account</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Products and Pricing</h2>
                                        <p className="text-gray-600 mb-4">
                                            We strive to display accurate product information and prices. However, we reserve the right to:
                                        </p>
                                        <ul className="text-gray-600 space-y-2 ml-6">
                                            <li>• Correct any errors in product descriptions or prices</li>
                                            <li>• Refuse or cancel any orders for products listed at incorrect prices</li>
                                            <li>• Change product prices without notice</li>
                                            <li>• Limit quantities of products that may be purchased</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Order Acceptance</h2>
                                        <p className="text-gray-600">
                                            Your receipt of an order confirmation does not constitute our acceptance of your order.
                                            We reserve the right to refuse or cancel any order for any reason, including:
                                        </p>
                                        <ul className="text-gray-600 space-y-2 ml-6 mt-2">
                                            <li>• Product availability</li>
                                            <li>• Errors in product or pricing information</li>
                                            <li>• Suspected fraud or unauthorized activity</li>
                                            <li>• Inaccuracies in billing or shipping information</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
                                        <p className="text-gray-600">
                                            All content on this website, including text, graphics, logos, and images, is the property
                                            of ShopStore or its content suppliers and is protected by intellectual property laws.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Conduct</h2>
                                        <p className="text-gray-600 mb-4">You agree not to:</p>
                                        <ul className="text-gray-600 space-y-2 ml-6">
                                            <li>• Use the website for any illegal purpose</li>
                                            <li>• Attempt to gain unauthorized access to any part of the website</li>
                                            <li>• Interfere with the proper working of the website</li>
                                            <li>• Use any automated means to access the website</li>
                                            <li>• Post or transmit any harmful or malicious content</li>
                                        </ul>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
                                        <p className="text-gray-600">
                                            ShopStore shall not be liable for any indirect, incidental, special, consequential,
                                            or punitive damages resulting from your use of or inability to use the service.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
                                        <p className="text-gray-600">
                                            We reserve the right to modify these terms at any time. We will notify users of
                                            any material changes by posting the new terms on this page.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
                                        <p className="text-gray-600">
                                            Questions about these Terms of Service should be sent to us at:
                                        </p>
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                            <p className="text-gray-600">
                                                <strong>Email:</strong> legal@shopstore.com<br />
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