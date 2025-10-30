'use client';

import Link from 'next/link';

export default function ShippingPage() {
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
                            <span className="text-sm font-medium">Delivery Information</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Shipping <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">Info</span>
                        </h1>
                        <p className="text-xl text-white/90 leading-relaxed">
                            Fast, reliable shipping options to get your products to you quickly and safely.
                        </p>
                    </div>
                </div>
            </section>

            {/* Shipping Options */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🚀</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Express Shipping</h3>
                                <p className="text-gray-600 mb-4">1-2 business days</p>
                                <div className="text-2xl font-bold text-blue-600">$9.99</div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">📦</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Standard Shipping</h3>
                                <p className="text-gray-600 mb-4">3-5 business days</p>
                                <div className="text-2xl font-bold text-green-600">$4.99</div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🎁</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Free Shipping</h3>
                                <p className="text-gray-600 mb-4">5-7 business days</p>
                                <div className="text-2xl font-bold text-purple-600">Free</div>
                                <p className="text-sm text-gray-500 mt-2">On orders over $50</p>
                            </div>
                        </div>

                        {/* Shipping Details */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Shipping Details</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Processing Time</h3>
                                    <p className="text-gray-600">
                                        All orders are processed within 1-2 business days. Orders are not processed or shipped on weekends or holidays.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Delivery Areas</h3>
                                    <p className="text-gray-600 mb-4">
                                        We currently ship to all 50 US states and international destinations. International shipping times may vary.
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                                            <div className="font-semibold text-blue-600">USA</div>
                                            <div className="text-gray-600">3-5 days</div>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <div className="font-semibold text-green-600">Canada</div>
                                            <div className="text-gray-600">5-7 days</div>
                                        </div>
                                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                                            <div className="font-semibold text-purple-600">Europe</div>
                                            <div className="text-gray-600">7-10 days</div>
                                        </div>
                                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                            <div className="font-semibold text-yellow-600">Worldwide</div>
                                            <div className="text-gray-600">10-14 days</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Order Tracking</h3>
                                    <p className="text-gray-600">
                                        Once your order has shipped, you will receive an email with a tracking number and link to track your package.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Shipping Restrictions</h3>
                                    <p className="text-gray-600">
                                        Some items cannot be shipped to certain locations due to manufacturer restrictions or local regulations.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="text-center mt-12">
                            <p className="text-gray-600 mb-6">Ready to place your order?</p>
                            <Link
                                href="/products"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}