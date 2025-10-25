'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { Category } from '@/types/category';
import Image from 'next/image';

export default function CategoryPage() {
    const params = useParams<{ slug: string }>();
    const slug = params.slug as string;

    // State for data
    const [category, setCategory] = useState<Category | null>(null);
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Fetch data on mount
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(false);
                
                // Fetch category by slug
                const categoryRes = await fetch(`/api/categories/${slug}`);
                if (!categoryRes.ok) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                const categoryData = await categoryRes.json();
                
                if (!categoryData || categoryData.error) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                
                setCategory(categoryData);
                
                // Fetch subcategories for this category
                const subcategoriesRes = await fetch(`/api/categories?parent=${slug}`);
                if (subcategoriesRes.ok) {
                    const subcategoriesData = await subcategoriesRes.json();
                    setSubcategories(subcategoriesData.categories || subcategoriesData || []);
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            fetchData();
        }
    }, [slug]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading category...</p>
                </div>
            </div>
        );
    }

    // Error or not found
    if (error || !category) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600 transition-colors">
                            Home
                        </Link>
                        <span className="mx-2">/</span>
                        <Link href="/categories" className="hover:text-blue-600 transition-colors">
                            Categories
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">{category.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {category.description || `Explore our ${category.name} collection`}
                    </p>
                </div>

                {/* Subcategories Grid or Direct Products Link */}
                {subcategories.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {subcategories.map((subcategory) => (
                                <Link
                                    key={subcategory.id}
                                    href={`/categories/${subcategory.slug}`}
                                    className="group block"
                                >
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]">
                                        <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
                                            {subcategory.image ? (
                                                <Image
                                                    src={subcategory.image}
                                                    alt={subcategory.name}
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
                                                {subcategory.name}
                                            </h2>
                                            <p className="text-gray-600 leading-relaxed">
                                                {subcategory.description}
                                            </p>
                                            <div className="mt-4 text-blue-600 font-medium group-hover:underline">
                                                Explore {subcategory.name} →
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    // If no subcategories, show direct link to products
                    <div className="text-center py-12">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 max-w-2xl mx-auto">
                            <div className="text-6xl mb-4">📦</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Browse {category.name} Products
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Explore our complete collection of {category.name.toLowerCase()} products with advanced filtering and search.
                            </p>
                            <Link
                                href={`/products?categories=${category.slug}`}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                View All Products
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}