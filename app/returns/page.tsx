'use client';

import Link from 'next/link';

export default function ReturnsPage() {
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
                            <span className="text-sm font-medium">Hassle-Free Returns</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Returns & <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">Refunds</span>
                        </h1>
                        <p className="text-xl text-white/90 leading-relaxed">
                            Our 30-day return policy ensures you can shop with confidence and peace of mind.
                        </p>
                    </div>
                </div>
            </section>

            {/* Returns Policy */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Return Policy</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-green-600 font-bold">✓</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">30-Day Return Window</h3>
                                        <p className="text-gray-600">
                                            You have 30 days from the delivery date to return your items for a full refund.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-green-600 font-bold">✓</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Returns</h3>
                                        <p className="text-gray-600">
                                            We offer free returns on all US orders. International return shipping fees may apply.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-green-600 font-bold">✓</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Full Refunds</h3>
                                        <p className="text-gray-600">
                                            Refunds are processed within 3-5 business days after we receive your return.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Return Process */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-blue-700">1</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Request Return</h3>
                                <p className="text-gray-600 text-sm">Start return in your account</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-green-700">2</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Print Label</h3>
                                <p className="text-gray-600 text-sm">Print free shipping label</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-purple-700">3</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Ship Package</h3>
                                <p className="text-gray-600 text-sm">Drop off at any carrier</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-yellow-700">4</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Get Refund</h3>
                                <p className="text-gray-600 text-sm">Receive refund in 3-5 days</p>
                            </div>
                        </div>

                        {/* Conditions */}
                        <div className="bg-gray-50 rounded-2xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Return Conditions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">✅ What can be returned:</h4>
                                    <ul className="text-gray-600 space-y-1">
                                        <li>• Items in original condition</li>
                                        <li>• Unused products with tags</li>
                                        <li>• Defective or damaged items</li>
                                        <li>• Wrong items received</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">❌ What cannot be returned:</h4>
                                    <ul className="text-gray-600 space-y-1">
                                        <li>• Used or worn items</li>
                                        <li>• Items without original packaging</li>
                                        <li>• Personalized products</li>
                                        <li>• Digital downloads</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Contact Support */}
                        <div className="text-center mt-12">
                            <p className="text-gray-600 mb-6">Need help with a return?</p>
                            <div className="flex gap-4 justify-center">
                                <Link
                                    href="/contact"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                                >
                                    Contact Support
                                </Link>
                                <Link
                                    href="/products"
                                    className="bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-xl hover:border-blue-300 transition-all duration-300 font-semibold"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}