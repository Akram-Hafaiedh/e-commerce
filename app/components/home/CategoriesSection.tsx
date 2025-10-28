'use client';

import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export default function CategoriesSection({ categories }: { categories: Category[] }) {

    const featuredCategories = categories.filter(category => category.featured).slice(0, 6);
    return (
        <>
            {featuredCategories.length > 0 && (
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full mb-3">
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                <span className="text-sm font-medium">Browse Collections</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                Shop by <span className="text-blue-600">Category</span>
                            </h2>
                            <p className="text-base text-gray-600 max-w-2xl mx-auto">
                                Discover our carefully curated categories filled with products that match your style and needs
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {featuredCategories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/categories/${category.slug}`}
                                    className="group block"
                                >
                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
                                        <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
                                            {category.image ? (
                                                <Image
                                                    src={category.image}
                                                    alt={category.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                                    priority={false}
                                                    loading="lazy"
                                                    placeholder="blur"
                                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                                    <span className="text-2xl">🛍️</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                                        </div>

                                        <div className="p-3 text-center">
                                            <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                                                {category.name}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* View All Categories Button */}
                        <div className="text-center mt-8">
                            <Link
                                href="/categories"
                                className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 font-semibold hover:gap-3"
                            >
                                <span>View All Categories</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}