'use client';

import { useState, useMemo } from 'react';
import { products, categories } from '@/lib/data';
import ProductCard from '../components/ProductCard';

const ITEMS_PER_PAGE = 9; // Changed to 9 to work better with 3 columns

export default function ProductsPage() {
    // State for filters, search, and pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [sortBy, setSortBy] = useState('name');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    // Calculate price stats for all products
    const priceStats = useMemo(() => {
        const prices = products.map(p => p.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }, []);

    // Filter and search logic
    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Price filter
        filtered = filtered.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product =>
                selectedCategories.includes(product.category)
            );
        }

        // Sort products
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [searchTerm, priceRange, sortBy, selectedCategories]);

    // Pagination logic
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

    const clampPage = (page: number) => Math.max(1, Math.min(page, totalPages));

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length);
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        const next = clampPage(page);
        if (next === currentPage) return;
        setCurrentPage(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle category selection
    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setPriceRange([0, priceStats.max]);
        setSortBy('name');
        setSelectedCategories([]);
        setCurrentPage(1);
    };

    // Grid classes based on filter state
    const gridClasses = showFilters 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" // 3 columns when filters shown
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"; // 4 columns when no filters

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
                            <p className="text-gray-600">
                                Discover our wide range of high-quality products at competitive prices.
                            </p>
                        </div>

                        {/* Search Bar and Filter Toggle */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full sm:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                    showFilters 
                                        ? 'bg-blue-700 text-white' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                                </svg>
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>
                        </div>
                    </div>

                    {/* Results Info */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-600">
                        <span>
                            Showing {startIndex + 1}-{endIndex} of {filteredProducts.length} products
                            {filteredProducts.length !== products.length && ` (filtered from ${products.length} total)`}
                        </span>
                        {filteredProducts.length !== products.length && (
                            <button
                                onClick={clearFilters}
                                className="text-blue-600 hover:text-blue-700 transition-colors mt-2 sm:mt-0 font-medium"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    {showFilters && (
                        <div className="lg:w-1/4">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Range</h3>
                                    <div className="space-y-2">
                                        <input
                                            type="range"
                                            min={0}
                                            max={priceStats.max}
                                            value={priceRange[1]}
                                            onChange={(e) => {
                                                setPriceRange([priceRange[0], parseInt(e.target.value)]);
                                                setCurrentPage(1);
                                            }}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>${priceRange[0]}</span>
                                            <span>${priceRange[1]}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sort By */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Sort By</h3>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => {
                                            setSortBy(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="name">Name (A-Z)</option>
                                        <option value="price-low">Price (Low to High)</option>
                                        <option value="price-high">Price (High to Low)</option>
                                    </select>
                                </div>

                                {/* Categories */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
                                    <div className="space-y-3">
                                        {categories.map((category) => (
                                            <label key={category.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category.slug)}
                                                    onChange={() => toggleCategory(category.slug)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-gray-700 flex-1">{category.name}</span>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {products.filter(p => p.category === category.slug).length}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Active Filters */}
                                {(selectedCategories.length > 0 || searchTerm || priceRange[1] < priceStats.max) && (
                                    <div className="border-t pt-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Active Filters</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCategories.map(categorySlug => {
                                                const category = categories.find(c => c.slug === categorySlug);
                                                return (
                                                    <span 
                                                        key={categorySlug}
                                                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                                    >
                                                        {category?.name}
                                                        <button
                                                            onClick={() => toggleCategory(categorySlug)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                            {searchTerm && (
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                    Search: &quot;{searchTerm}&quot;
                                                    <button
                                                        onClick={() => setSearchTerm('')}
                                                        className="text-green-600 hover:text-green-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            )}
                                            {priceRange[1] < priceStats.max && (
                                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                    Price: ≤${priceRange[1]}
                                                    <button
                                                        onClick={() => setPriceRange([0, priceStats.max])}
                                                        className="text-purple-600 hover:text-purple-800"
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
                    <div className={`${showFilters ? 'lg:w-3/4' : 'w-full'}`}>
                        {currentProducts.length > 0 ? (
                            <>
                                <div className={gridClasses}>
                                    {currentProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex flex-col items-center space-y-4 mt-12">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Previous
                                            </button>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-4 py-2 border rounded-lg transition-colors ${
                                                        currentPage === page
                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Next
                                            </button>
                                        </div>

                                        {/* Page Info */}
                                        <div className="text-center text-gray-600 text-sm">
                                            Page {currentPage} of {totalPages}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Empty State */
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    {searchTerm 
                                        ? `No products match your search for "${searchTerm}". Try adjusting your search terms.`
                                        : 'No products match your current filters. Try adjusting your filters to see more results.'
                                    }
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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