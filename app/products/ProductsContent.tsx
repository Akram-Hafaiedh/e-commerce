'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '../components/ProductCard';
import { Product } from '@/types/product';
import { Category } from '@/types/category';

const ITEMS_PER_PAGE = 12;

interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export default function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.categories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Initialize state from URL
    useEffect(() => {
        const filter = searchParams.get('filter');
        const sort = searchParams.get('sort');
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const page = searchParams.get('page');

        if (filter) setActiveFilter(filter);
        if (sort) setSortBy(sort);
        if (search) setSearchTerm(search);
        if (category) setSelectedCategories([category]);
        if (page) setCurrentPage(parseInt(page));
    }, [searchParams]);

    // Fetch products whenever filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.set('page', currentPage.toString());
                params.set('limit', ITEMS_PER_PAGE.toString());

                if (activeFilter === 'featured') params.set('featured', 'true');
                if (activeFilter === 'onSale') params.set('onSale', 'true');
                if (searchTerm) params.set('search', searchTerm);
                if (selectedCategories.length === 1) {
                    params.set('category', selectedCategories[0]);
                }

                const response = await fetch(`/api/products?${params.toString()}`);
                if (response.ok) {
                    const data: ProductsResponse = await response.json();

                    // Apply client-side sorting if needed
                    const sortedProducts = [...data.products];
                    switch (sortBy) {
                        case 'price-low':
                            sortedProducts.sort((a, b) => a.price - b.price);
                            break;
                        case 'price-high':
                            sortedProducts.sort((a, b) => b.price - a.price);
                            break;
                        case 'name':
                            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                            break;
                        case 'rating':
                            sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                            break;
                        // 'newest' is default from API
                    }

                    setProducts(sortedProducts);
                    setTotalPages(data.totalPages);
                    setTotalProducts(data.total);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, activeFilter, searchTerm, selectedCategories, sortBy]);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();

        if (activeFilter) params.set('filter', activeFilter);
        if (searchTerm) params.set('search', searchTerm);
        if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);
        if (selectedCategories.length === 1) params.set('category', selectedCategories[0]);
        if (currentPage > 1) params.set('page', currentPage.toString());

        const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
        router.replace(newUrl, { scroll: false });
    }, [searchTerm, sortBy, selectedCategories, activeFilter, currentPage, router]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSortBy('newest');
        setSelectedCategories([]);
        setActiveFilter(null);
        setCurrentPage(1);
        router.replace('/products', { scroll: false });
    };

    const gridClasses = showFilters
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

    const activeCategory = searchParams.get('category');
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalProducts);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {activeFilter === 'featured' && 'Featured Products'}
                                {activeFilter === 'onSale' && 'Products on Sale'}
                                {activeCategory && `${categories.find((c: Category) => c.slug === activeCategory)?.name} Products`}
                                {!activeFilter && !activeCategory && 'All Products'}
                            </h1>
                            <p className="text-gray-600">
                                {activeFilter === 'featured' && 'Handpicked selection of our premium products'}
                                {activeFilter === 'onSale' && 'Amazing deals and discounts available now'}
                                {activeCategory && `Explore our ${categories.find((c: Category) => c.slug === activeCategory)?.name?.toLowerCase()} collection`}
                                {!activeFilter && !activeCategory && 'Discover our wide range of high-quality products at competitive prices.'}
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
                                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${showFilters ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
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
                            {loading ? (
                                'Loading products...'
                            ) : totalProducts > 0 ? (
                                <>
                                    Showing {startIndex}-{endIndex} of {totalProducts} products
                                    {(activeFilter || activeCategory) && (
                                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            {activeFilter === 'featured' && 'Featured'}
                                            {activeFilter === 'onSale' && 'On Sale'}
                                            {activeCategory && `${categories.find((c: Category) => c.slug === activeCategory)?.name}`}
                                        </span>
                                    )}
                                </>
                            ) : (
                                'No products found'
                            )}
                        </span>
                        {(searchTerm || activeFilter || activeCategory || selectedCategories.length > 0) && (
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

                                {/* Sort By */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Sort By</h3>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => {
                                            setSortBy(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="name">Name (A-Z)</option>
                                        <option value="price-low">Price (Low to High)</option>
                                        <option value="price-high">Price (High to Low)</option>
                                        <option value="rating">Highest Rated</option>
                                    </select>
                                </div>

                                {/* Categories */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
                                    <div className="space-y-3">
                                        {categories.map((category: Category) => (
                                            <label key={category.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category.slug)}
                                                    onChange={() => toggleCategory(category.slug)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-gray-700 flex-1">{category.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Filters */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Filters</h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => {
                                                setActiveFilter('featured');
                                                setSelectedCategories([]);
                                                setSearchTerm('');
                                                setCurrentPage(1);
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeFilter === 'featured'
                                                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            ⭐ Featured Products
                                        </button>
                                        <button
                                            onClick={() => {
                                                setActiveFilter('onSale');
                                                setSelectedCategories([]);
                                                setSearchTerm('');
                                                setCurrentPage(1);
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeFilter === 'onSale'
                                                    ? 'bg-red-100 text-red-800 border border-red-300'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            🔥 On Sale
                                        </button>
                                    </div>
                                </div>

                                {/* Active Filters */}
                                {(selectedCategories.length > 0 || searchTerm || activeFilter) && (
                                    <div className="border-t pt-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Active Filters</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCategories.map(categorySlug => {
                                                const category = categories.find((c: Category) => c.slug === categorySlug);
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
                                            {activeFilter && (
                                                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                    {activeFilter === 'featured' ? 'Featured' : 'On Sale'}
                                                    <button
                                                        onClick={() => setActiveFilter(null)}
                                                        className="text-orange-600 hover:text-orange-800"
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
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className={gridClasses}>
                                    {products.map((product: Product) => (
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

                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`px-4 py-2 border rounded-lg transition-colors ${currentPage === pageNum
                                                                ? 'bg-blue-600 text-white border-blue-600'
                                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Next
                                            </button>
                                        </div>

                                        <div className="text-center text-gray-600 text-sm">
                                            Page {currentPage} of {totalPages}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
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