'use client';

import Link from 'next/link';

export default function AboutPage() {
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
                            <span className="text-sm font-medium">Our Story</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            About <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">ShopStore</span>
                        </h1>
                        <p className="text-xl text-white/90 leading-relaxed">
                            We&apos;re on a mission to revolutionize online shopping by providing exceptional quality,
                            unbeatable prices, and an unforgettable customer experience.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Journey</h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                Founded in 2020, ShopStore started as a small passion project with a big vision:
                                to create the most customer-centric online shopping experience in the world.
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Today, we serve millions of customers worldwide, offering a carefully curated
                                selection of products across dozens of categories, all while maintaining our
                                commitment to quality and customer satisfaction.
                            </p>
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">1M+</div>
                                    <div className="text-gray-600">Happy Customers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600">50K+</div>
                                    <div className="text-gray-600">Products</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">100+</div>
                                    <div className="text-gray-600">Categories</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">🚀</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">Fast Shipping</h3>
                                    <p className="text-gray-600 text-sm">2-3 day delivery worldwide</p>
                                </div>
                                <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">⭐</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">5-Star Quality</h3>
                                    <p className="text-gray-600 text-sm">Rigorous quality control</p>
                                </div>
                                <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">💬</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
                                    <p className="text-gray-600 text-sm">Always here to help</p>
                                </div>
                                <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">💎</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">Best Prices</h3>
                                    <p className="text-gray-600 text-sm">Price match guarantee</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
                        <p className="text-lg text-gray-600">The principles that guide everything we do</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Customer First</h3>
                            <p className="text-gray-600">
                                Every decision we make starts with our customers needs and happiness.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl">🌱</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Sustainable Growth</h3>
                            <p className="text-gray-600">
                                We believe in growing responsibly while making a positive impact.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl">💡</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation</h3>
                            <p className="text-gray-600">
                                Constantly pushing boundaries to improve your shopping experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Shop?</h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join millions of satisfied customers and discover why ShopStore is the trusted choice for online shopping.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/products"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                        >
                            Start Shopping
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-xl hover:border-blue-300 transition-all duration-300 font-semibold"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}