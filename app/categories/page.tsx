'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Category } from '@/types/category';
import Image from 'next/image';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetch('/api/categories?all=true', {
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Handle both response formats for backward compatibility
                if (data.categories) {
                    setCategories(data.categories);
                } else if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    throw new Error('Invalid response format');
                }

            } catch (error: unknown) {
                if (error instanceof Error && error.name === 'AbortError') {
                    console.log('Fetch aborted');
                    return;
                }
                console.error('Error fetching categories:', error);
                setError(error instanceof Error ? error.message : 'An error occurred while fetching categories');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();

        // Cleanup function to abort fetch if component unmounts
        return () => {
            controller.abort();
        };
    }, []); // Empty dependency array - runs once on mount

    const handleRetry = () => {
        setLoading(true);
        setError('');
        // Force re-mount by updating a key or manually fetch
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading categories...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">{error}</p>
                    <button
                        onClick={handleRetry}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Categories</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Browse our wide range of product categories. Find exactly what you&apos;re looking for.
                    </p>
                </div>

                {/* Categories Grid */}
                {categories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/categories/${category.slug}`}
                                className="group block"
                            >
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]">
                                    <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
                                        {category.image ? (
                                            <Image
                                                src={category.image}
                                                alt={category.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                <span className="text-2xl">🛍️</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 text-center">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                            {category.name}
                                        </h2>
                                        <p className="text-gray-600 leading-relaxed">
                                            {category.description}
                                        </p>
                                        <div className="mt-4 text-blue-600 font-medium group-hover:underline">
                                            Explore {category.name} →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No categories available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}