'use client';
import { useEffect, useState, useMemo } from 'react';

import { CategoryWithCount } from "@/types/category";
import CategoryCard from "@/components/CategoryCard";
import Pagination from "@/components/parts/Pagination";
import Link from 'next/link';
import Image from 'next/image';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryWithCount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 9; // 3x3 grid or list items

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
                if (data.categories) {
                    setCategories(data.categories);
                } else if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    throw new Error('Invalid response format');
                }
                setLoading(false); // Only set to false on success
            } catch (error: unknown) {
                if (error instanceof Error && error.name === 'AbortError') {
                    console.log('Fetch aborted');
                    return;
                }
                console.error('Error fetching categories:', error);
                setError(error instanceof Error ? error.message : 'An error occurred while fetching categories');
                setLoading(false); // Set to false only on non-abort errors
            }
        };
        fetchCategories();
        return () => {
            controller.abort();
        };
    }, []);

    // Filter categories based on search
    const filteredCategories = useMemo(() => {
        return categories.filter(category =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categories, searchTerm]);

    // Separate featured and regular categories
    const featuredCategories = filteredCategories.filter(c => c.featured);
    const regularCategories = filteredCategories.filter(c => !c.featured);

    // Pagination for regular categories
    const totalRegularPages = Math.ceil(regularCategories.length / ITEMS_PER_PAGE);
    const paginatedRegularCategories = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return regularCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [regularCategories, currentPage]);

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4 py-16">
                    {/* Header Skeleton */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-full mb-4 animate-pulse">
                            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                            <span className="h-4 w-32 bg-gray-300 rounded"></span>
                        </div>
                        <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded w-[600px] max-w-full mx-auto animate-pulse"></div>
                    </div>

                    {/* Search Skeleton */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="h-14 bg-gray-200 rounded-xl animate-pulse"></div>
                    </div>

                    {/* Grid Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                                <div className="h-56 bg-gray-200"></div>
                                <div className="p-6 space-y-3">
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="flex gap-2 mt-4">
                                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                                        <div className="h-6 bg-gray-200 rounded w-24"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold hover:shadow-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Header Section with Background */}
            <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative container mx-auto px-4 py-16">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-4">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium">Explore Our Collection</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">
                            Shop by <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">Category</span>
                        </h1>
                        <p className="text-white/90 text-lg max-w-2xl mx-auto">
                            Discover our carefully curated categories. From trending items to timeless classics, find exactly what you need.
                        </p>
                    </div>

                    {/* Search Bar & View Toggle */}
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-6 py-4 pl-14 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-md focus:bg-white focus:text-gray-900 focus:border-yellow-400 focus:outline-none transition-all text-white placeholder-white/60 focus:placeholder-gray-400"
                                />
                                <svg className="w-6 h-6 text-white/60 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <div className="flex gap-2 bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all ${viewMode === 'grid'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-white hover:bg-white/20'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all ${viewMode === 'list'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-white hover:bg-white/20'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                {/* Only show empty state if data is loaded AND no results found */}
                {!loading && filteredCategories.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No categories found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm
                                ? 'Try adjusting your search terms'
                                : 'No categories are available at the moment'}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold hover:shadow-lg"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Featured Categories - Always show all featured */}
                        {featuredCategories.length > 0 && (
                            <div className="mb-16">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="font-semibold">Featured Categories</span>
                                    </div>
                                    <div className="h-px bg-gradient-to-r from-gray-300 to-transparent flex-1"></div>
                                </div>

                                {/* Compact grid - 6 columns like home page */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {featuredCategories.map((category: CategoryWithCount) => (
                                        <Link
                                            key={category.id}
                                            href={`/categories/${category.slug}`}
                                            className="group block"
                                        >
                                            <div className="bg-white rounded-xl border-2 border-gray-100 p-4 text-center hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
                                                {/* Compact icon/image */}
                                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                                    {category.image ? (
                                                        <Image
                                                            src={category.image}
                                                            alt={category.name}
                                                            width={32}
                                                            height={32}
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-2xl">📦</span>
                                                    )}
                                                </div>

                                                {/* Category name */}
                                                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                                                    {category.name}
                                                </h3>

                                                {/* Product count */}
                                                <p className="text-xs text-gray-500">
                                                    {category._count?.products || 0} products
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* All Categories - With Pagination */}
                        {regularCategories.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900">All Categories</h2>
                                    <div className="h-px bg-gradient-to-r from-gray-300 to-transparent flex-1"></div>
                                    <span className="text-gray-500 font-medium">
                                        {regularCategories.length} categories
                                    </span>
                                </div>

                                <div className={viewMode === 'grid'
                                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                    : "space-y-4"
                                }>
                                    {paginatedRegularCategories.map((category: CategoryWithCount) => (
                                        <CategoryCard key={category.id} category={category} viewMode={viewMode} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalRegularPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalRegularPages}
                                        onPageChange={setCurrentPage}
                                        totalItems={regularCategories.length}
                                        itemsPerPage={ITEMS_PER_PAGE}
                                    />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}