import Link from "next/link";

export default function HeroSection() {
    return (

        <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative container mx-auto px-4 py-32">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-sm font-medium">🚀 New Collections Just Dropped</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                                Welcome to{' '}
                                <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                                    ShopStore
                                </span>
                            </h1>

                            <p className="text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed max-w-2xl">
                                Discover <span className="font-semibold text-yellow-300">amazing products</span> at unbeatable prices.
                                Quality meets affordability with fast shipping and excellent service.
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-6 mb-8 justify-center lg:justify-start">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-300">10K+</div>
                                    <div className="text-sm opacity-80">Happy Customers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-300">5★</div>
                                    <div className="text-sm opacity-80">Rated Service</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-300">24/7</div>
                                    <div className="text-sm opacity-80">Support</div>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    href="/products"
                                    className="group bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl hover:bg-yellow-300 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-yellow-500/25 hover:scale-105 flex items-center justify-center gap-2"
                                >
                                    <span>🛍️ Shop Now</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>

                                <Link
                                    href="/categories"
                                    className="group border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 font-bold text-lg hover:scale-105 flex items-center justify-center gap-2"
                                >
                                    <span>📂 Browse Categories</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image/Illustration */}
                        <div className="flex-1 relative">
                            <div className="relative w-full max-w-lg mx-auto">
                                {/* Floating Product Cards */}
                                <div className="absolute -top-4 -left-4 w-24 h-32 bg-white rounded-2xl shadow-2xl transform -rotate-12 animate-float">
                                    <div className="w-full h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-2xl"></div>
                                    <div className="p-2">
                                        <div className="h-2 bg-gray-200 rounded mb-1"></div>
                                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                </div>

                                <div className="absolute -bottom-4 -right-4 w-28 h-36 bg-white rounded-2xl shadow-2xl transform rotate-6 animate-float animation-delay-2000">
                                    <div className="w-full h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-t-2xl"></div>
                                    <div className="p-2">
                                        <div className="h-2 bg-gray-200 rounded mb-1"></div>
                                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                </div>

                                {/* Main Hero Illustration */}
                                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
                                    <div className="w-full h-64 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                                <span className="text-3xl">🛒</span>
                                            </div>
                                            <p className="text-white font-semibold">Your Shopping Journey Starts Here</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="animate-bounce">
                    <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </section>
    )
}