'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/parts/Pagination';
import { CategoryWithCount } from '@/types/category';
import { Product } from '@/types/product';

export default function SingleCategoryPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [category, setCategory] = useState<CategoryWithCount | null>(null);
    const [subcategories, setSubcategories] = useState<CategoryWithCount[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'newest'>('name');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoading(true);

                // Fetch category details, subcategories, and products
                const [categoryRes, subcategoriesRes, productsRes] = await Promise.all([
                    fetch(`/api/categories?slug=${slug}`),
                    fetch(`/api/categories?parent=${slug}`),
                    fetch(`/api/products?category=${slug}&limit=100`)
                ]);

                const categoryData = await categoryRes.json();
                const subcategoriesData = await subcategoriesRes.json();
                const productsData = await productsRes.json();

                setCategory(categoryData.category || categoryData);
                setSubcategories(subcategoriesData.categories || subcategoriesData);
                setProducts(productsData.products || productsData);
            } catch (error) {
                console.error('Error fetching category data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchCategoryData();
        }
    }, [slug]);

    // Sort products
    const sortedProducts = useMemo(() => {
        const sorted = [...products];
        switch (sortBy) {
            case 'price':
                return sorted.sort((a, b) => a.price - b.price);
            case 'rating':
                return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            case 'name':
            default:
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
    }, [products, sortBy]);

    // Pagination
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return sortedProducts.slice(startIndex, startIndex + productsPerPage);
    }, [sortedProducts, currentPage]);

    if (loading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    }

    if (!category) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
                    <Link href="/categories" className="text-blue-600 hover:text-blue-700">
                        Back to Categories
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Category Hero */}
            <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative container mx-auto px-4 py-12 z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        {/* Category Image */}
                        <div className="lg:w-1/3">
                            <div className="w-64 h-64 mx-auto bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
                                {category.image ? (
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        width={200}
                                        height={200}
                                        className="object-cover rounded-2xl"
                                    />
                                ) : (
                                    <span className="text-6xl">🛍️</span>
                                )}
                            </div>
                        </div>

                        {/* Category Info */}
                        <div className="lg:w-2/3 text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                {category.name}
                            </h1>
                            <p className="text-white/90 text-lg mb-6 max-w-2xl">
                                {category.description || `Explore our collection of ${category.name.toLowerCase()} products.`}
                            </p>

                            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                                <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-3">
                                    <div className="text-2xl font-bold text-yellow-400">{category._count?.products || 0}</div>
                                    <div className="text-white/80 text-sm">Products</div>
                                </div>
                                {(category._count?.children || 0) > 0 && (
                                    <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-3">
                                        <div className="text-2xl font-bold text-yellow-400">{category._count?.children || 0}</div>
                                        <div className="text-white/80 text-sm">Subcategories</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subcategories */}
            {subcategories.length > 0 && (
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Subcategories</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {subcategories.map((subcategory) => (
                                <Link
                                    key={subcategory.id}
                                    href={`/categories/${subcategory.slug}`}
                                    className="group block"
                                >
                                    <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all duration-300">
                                        <div className="w-12 h-12 mx-auto bg-white rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            {subcategory.image ? (
                                                <Image
                                                    src={subcategory.image}
                                                    alt={subcategory.name}
                                                    width={24}
                                                    height={24}
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <span className="text-xl">📁</span>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600">
                                            {subcategory.name}
                                        </h3>
                                        <p className="text-gray-500 text-xs mt-1">
                                            {subcategory._count?.products || 0} products
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Products Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {/* Products Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                            <p className="text-gray-600">
                                {products.length} products found in {category.name}
                            </p>
                        </div>

                        {/* Sort Options */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm text-gray-900">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating' | 'newest')}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                            >
                                <option value="name">Name</option>
                                <option value="price">Price</option>
                                <option value="rating">Rating</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {paginatedProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {paginatedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    totalItems={products.length}
                                    itemsPerPage={productsPerPage}
                                />
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">😞</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-600 mb-6">There are no products in this category yet.</p>
                            <Link
                                href="/categories"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Browse Other Categories
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Related Categories */}
            <section className="py-12 bg-white border-t">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {/* You could fetch sibling categories or popular categories here */}
                        <Link
                            href="/categories"
                            className="bg-gray-50 rounded-xl p-4 text-center hover:bg-blue-50 transition-colors"
                        >
                            <div className="w-12 h-12 mx-auto bg-white rounded-lg flex items-center justify-center mb-2">
                                <span className="text-xl">🔍</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">All Categories</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}