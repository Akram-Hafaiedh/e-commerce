'use client';

import { useState, useMemo, useEffect } from 'react';
import { categories } from '@/lib/category';
import { products } from '@/lib/product';
import { notFound, useParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import Link from 'next/link';

export default function CategoryPage() {
    const params = useParams<{ slug: string }>();
    const slug = params.slug as string;

    const category = categories.find((c) => c.slug === slug);

    if (!category) {
        notFound();
    }

    // State for filters and search
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [sortBy, setSortBy] = useState('name');

    // Get products for this category
    const categoryProducts = products.filter((p) => p.category === slug);

    // Filter and search logic
    const filteredProducts = useMemo(() => {
        let filtered = categoryProducts;

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
    }, [categoryProducts, searchTerm, priceRange, sortBy]);

    // Get unique categories for filter (excluding current category)
    const otherCategories = categories.filter(c => c.slug !== slug);

    // Calculate price stats for the category
    const priceStats = useMemo(() => {
        const prices = categoryProducts.map(p => p.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }, [categoryProducts]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/categories" className="hover:text-blue-600">Categories</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">{category.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                            {/* Search */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Search</h3>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
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
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="name">Name (A-Z)</option>
                                    <option value="price-low">Price (Low to High)</option>
                                    <option value="price-high">Price (High to Low)</option>
                                </select>
                            </div>

                            {/* Other Categories */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Browse Categories</h3>
                                <div className="space-y-2">
                                    {otherCategories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/categories/${cat.slug}`}
                                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-gray-700">{cat.name}</span>
                                            <span className="text-gray-400">→</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setPriceRange([0, priceStats.max]);
                                    setSortBy('name');
                                }}
                                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Header Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
                                    <p className="text-gray-600">{category.description}</p>
                                </div>
                                <div className="mt-4 md:mt-0 text-sm text-gray-500">
                                    Showing {filteredProducts.length} of {categoryProducts.length} products
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Try adjusting your search or filters to find what you&apos;re looking for.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setPriceRange([0, priceStats.max]);
                                        setSortBy('name');
                                    }}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}