'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/parts/Pagination';
import { ProductWithStock } from '@/types/product';
import { Category } from '@/types/category';

const ITEMS_PER_PAGE = 12;

interface Props {
    initialProducts: ProductWithStock[];
    initialTotal: number;
    initialPage: number;
    initialTotalPages: number;
    categories: Category[];
    searchParams: {
        page?: string;
        search?: string;
        categories?: string;
        featured?: string;
        onSale?: string;
    };
}

export default function ProductsClient({
    initialProducts,
    initialTotal,
    initialPage,
    initialTotalPages,
    categories,
    searchParams: initialSearchParams
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // State initialized from server data
    const currentPage = Math.max(1, Number(searchParams.get('page') ?? initialPage));
    const totalPages = initialTotalPages;
    const totalProducts = initialTotal;

    // Client-side filter state
    const [searchTerm, setSearchTerm] = useState(initialSearchParams.search || '');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchParams.search || '');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        initialSearchParams.categories ? initialSearchParams.categories.split(',') : []
    );
    const [activeFilter, setActiveFilter] = useState<string | null>(
        initialSearchParams.featured === 'true' ? 'featured' :
            initialSearchParams.onSale === 'true' ? 'onSale' : null
    );
    const [showFilters, setShowFilters] = useState(false);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Update URL when filters change (this triggers server re-fetch)
    useEffect(() => {
        const params = new URLSearchParams();

        if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
        if (selectedCategories.length > 0) {
            params.set('categories', selectedCategories.join(','));
        }
        if (activeFilter === 'featured') params.set('featured', 'true');
        if (activeFilter === 'onSale') params.set('onSale', 'true');
        if (currentPage > 1) params.set('page', currentPage.toString());

        const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';

        // Use startTransition for smoother updates
        startTransition(() => {
            router.push(newUrl, { scroll: false });
        });
    }, [debouncedSearchTerm, selectedCategories, activeFilter, currentPage, router]);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
        setSelectedCategories([]);
        setActiveFilter(null);
        router.push('/products');
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());

        startTransition(() => {
            router.push(`/products?${params.toString()}`, { scroll: false });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    const gridClasses = showFilters
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalProducts);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Enhanced Hero Header */}
            <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative container mx-auto px-4 py-12">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-3">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium">
                                {activeFilter === 'featured' && '⭐ Featured Collection'}
                                {activeFilter === 'onSale' && '🔥 Hot Deals'}
                                {!activeFilter && '🛍️ Shop All Products'}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-3">
                            {activeFilter === 'featured' && 'Featured '}
                            {activeFilter === 'onSale' && 'Sale '}
                            <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                                Products
                            </span>
                        </h1>

                        <p className="text-white/90 text-lg max-w-2xl mx-auto">
                            {activeFilter === 'featured' && 'Handpicked selection of our premium products'}
                            {activeFilter === 'onSale' && 'Amazing deals and discounts available now'}
                            {!activeFilter && 'Discover our wide range of high-quality products at competitive prices'}
                        </p>
                    </div>

                    {/* Search and Filters Bar */}
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-6 py-4 pl-14 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-md focus:bg-white focus:text-gray-900 focus:border-yellow-400 focus:outline-none transition-all text-white placeholder-white/60 focus:placeholder-gray-400"
                                />
                                <svg className="w-6 h-6 text-white/60 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                {searchTerm && searchTerm !== debouncedSearchTerm && (
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-6 py-4 rounded-xl font-medium transition-all flex items-center gap-2 justify-center ${showFilters
                                    ? 'bg-white text-blue-600 shadow-lg'
                                    : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                                </svg>
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>
                        </div>

                        {/* Quick Filter Pills */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            <button
                                onClick={() => setActiveFilter(activeFilter === 'featured' ? null : 'featured')}
                                className={`px-4 py-2 rounded-full transition-all ${activeFilter === 'featured'
                                    ? 'bg-white text-blue-600 shadow-lg'
                                    : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
                                    }`}
                            >
                                ⭐ Featured
                            </button>
                            <button
                                onClick={() => setActiveFilter(activeFilter === 'onSale' ? null : 'onSale')}
                                className={`px-4 py-2 rounded-full transition-all ${activeFilter === 'onSale'
                                    ? 'bg-white text-red-600 shadow-lg'
                                    : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
                                    }`}
                            >
                                🔥 On Sale
                            </button>
                            {(selectedCategories.length > 0 || searchTerm || activeFilter) && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 rounded-full bg-red-500/20 backdrop-blur-md border border-red-300/30 text-white hover:bg-red-500/30 transition-all"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Results Summary */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl border-2 border-gray-100 p-6 shadow-sm">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                {isPending ? (
                                    <span className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                        Loading...
                                    </span>
                                ) : (
                                    `${totalProducts} Products Found`
                                )}
                            </h2>
                            <p className="text-gray-600">
                                {!isPending && totalProducts > 0 && `Showing ${startIndex}-${endIndex} of ${totalProducts} results`}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    {showFilters && (
                        <div className="lg:w-80">
                            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-6 sticky top-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                {/* Categories */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Categories</h4>
                                    <div className="space-y-3">
                                        {categories.map((category) => (
                                            <label
                                                key={category.id}
                                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category.slug)}
                                                    onChange={() => toggleCategory(category.slug)}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                                                />
                                                <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                                                    {category.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Active Filters Display */}
                                {(selectedCategories.length > 0 || activeFilter) && (
                                    <div className="border-t pt-6">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Active Filters</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCategories.map(slug => {
                                                const cat = categories.find(c => c.slug === slug);
                                                return (
                                                    <span
                                                        key={slug}
                                                        className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
                                                    >
                                                        {cat?.name}
                                                        <button
                                                            onClick={() => toggleCategory(slug)}
                                                            className="text-blue-600 hover:text-blue-800 font-bold"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                            {activeFilter && (
                                                <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full font-medium">
                                                    {activeFilter === 'featured' ? '⭐ Featured' : '🔥 On Sale'}
                                                    <button
                                                        onClick={() => setActiveFilter(null)}
                                                        className="text-orange-600 hover:text-orange-800 font-bold"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className={`${showFilters ? 'lg:flex-1' : 'w-full'}`}>
                        {initialProducts.length > 0 ? (
                            <>
                                <div className={gridClasses}>
                                    {initialProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination Component */}
                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        totalItems={totalProducts}
                                        itemsPerPage={ITEMS_PER_PAGE}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-16 text-center">
                                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-3">No Products Found</h3>
                                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                                    {searchTerm
                                        ? `No products match your search for "${searchTerm}". Try adjusting your search terms.`
                                        : 'We couldn\'t find any products matching your criteria. Try adjusting your filters or search terms.'
                                    }
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 font-bold text-lg hover:shadow-lg hover:scale-105"
                                >
                                    {searchTerm ? 'Clear Search' : 'Clear All Filters'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}