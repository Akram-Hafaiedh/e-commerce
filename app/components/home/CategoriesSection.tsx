'use client';

import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export default function CategoriesSection({ categories }: { categories: Category[] }) {

    const featuredCategories = categories.filter(category => category.featured).slice(0, 6);
    return (
        <>
            {featuredCategories.length > 0 && (
                <section className="py-20 bg-gradient-to-b from-white to-gray-50/50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                <span className="text-sm font-medium">Browse Collections</span>
                            </div>
                            <h2 className="text-5xl font-bold text-gray-900 mb-6">
                                Shop by <span className="text-blue-600">Category</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Discover our carefully curated categories filled with products that match your style and needs
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredCategories.map((category, index) => (
                                <Link
                                    key={category.id}
                                    href={`/categories/${category.slug}`}
                                    className="group block"
                                >
                                    <div
                                        className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:translate-y-[-8px]"
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                            animation: 'fadeInUp 0.6s ease-out forwards'
                                        }}
                                    >
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                                        <div className="h-56 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
                                            {category.image ? (
                                                <Image
                                                    src={category.image}
                                                    alt={category.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="relative z-20">
                                                    <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                        <span className="text-3xl">🛍️</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Hover Effect */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                        </div>

                                        <div className="p-6 text-center relative z-20">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                                {category.name}
                                            </h2>
                                            <p className="text-gray-600 leading-relaxed mb-4">
                                                {category.description}
                                            </p>
                                            <div className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all duration-300">
                                                <span>Explore Now</span>
                                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* View All Categories Button */}
                        <div className="text-center mt-12">
                            <Link
                                href="/categories"
                                className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold hover:gap-4 hover:shadow-xl"
                            >
                                <span>View All Categories</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>
            )}</>
    )
}