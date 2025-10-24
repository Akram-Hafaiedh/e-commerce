'use client';

import { useState, useMemo, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import Link from 'next/link';
import { Category } from '@/types/category';
import { Product } from '@/types/product';

export default function CategoryPage() {
    const params = useParams<{ slug: string }>();
    const slug = params.slug as string;

    // State for data
    const [category, setCategory] = useState<Category | null>(null);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // State for filters and search
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [sortBy, setSortBy] = useState('name');

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
                
                // Check if category data is valid
                if (!categoryData || categoryData.error) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                
                setCategory(categoryData);
                
                // If category has products included, use them
                if (categoryData.products && Array.isArray(categoryData.products)) {
                    setCategoryProducts(categoryData.products);
                } else {
                    // Fallback: fetch products separately
                    const productsRes = await fetch(`/api/products?category=${slug}`);
                    if (productsRes.ok) {
                        const productsData = await productsRes.json();
                        // Handle different response formats
                        setCategoryProducts(productsData.products || productsData || []);
                    }
                }

                // Fetch all categories for sidebar
                const categoriesRes = await fetch('/api/categories');
                if (categoriesRes.ok) {
                    const categoriesData = await categoriesRes.json();
                    // Handle different response formats
                    setAllCategories(categoriesData.categories || categoriesData || []);
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

    // Filter and search logic
    const filteredProducts = useMemo(() => {
        let filtered = categoryProducts;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default:
                    return 0;
            }
        });

        return filtered;
    }, [categoryProducts, searchTerm, priceRange, sortBy]);

    // Get other categories for filter (excluding current category)
    const otherCategories = useMemo(() => {
        return allCategories.filter(c => c.slug !== slug);
    }, [allCategories, slug]);

    // Calculate price stats for the category
    const priceStats = useMemo(() => {
        if (categoryProducts.length === 0) {
            return { min: 0, max: 2000 };
        }
        const prices = categoryProducts.map(p => p.price);
        return {
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices))
        };
    }, [categoryProducts]);

    // Update price range when price stats change
    useEffect(() => {
        if (categoryProducts.length > 0) {
            setPriceRange([priceStats.min, priceStats.max]);
        }
    }, [priceStats, categoryProducts.length]);

    // Reset filters when category changes
    useEffect(() => {
        setSearchTerm('');
        setSortBy('name');
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Range</h3>
                                <div className="space-y-2">
                                    <input
                                        type="range"
                                        min={priceStats.min}
                                        max={priceStats.max}
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
                                >
                                    <option value="name">Name (A-Z)</option>
                                    <option value="price-low">Price (Low to High)</option>
                                    <option value="price-high">Price (High to Low)</option>
                                    <option value="newest">Newest First</option>
                                </select>
                            </div>

                            {/* Other Categories */}
                            {otherCategories.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Browse Categories</h3>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
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
                            )}

                            {/* Clear Filters */}
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setPriceRange([priceStats.min, priceStats.max]);
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
                                    {searchTerm 
                                        ? `No products match "${searchTerm}" in this price range.`
                                        : "Try adjusting your filters to find what you're looking for."
                                    }
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setPriceRange([priceStats.min, priceStats.max]);
                                        setSortBy('name');
                                    }}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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