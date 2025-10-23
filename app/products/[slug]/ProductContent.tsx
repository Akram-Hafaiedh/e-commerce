'use client';

import { useCart } from "@/app/context/CartContext";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import Link from "next/link";
import { useState, useEffect } from "react";

interface ProductContentProps {
    product: Product;
    category?: Category;
}

export default function ProductContent({ product, category }: ProductContentProps) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loadingRelated, setLoadingRelated] = useState(true);

    // Fetch related products
    useEffect(() => {
        async function fetchRelatedProducts() {
            try {
                setLoadingRelated(true);
                const res = await fetch(`/api/products?category=${product.category.id}&all=true`);
                if (res.ok) {
                    const data = await res.json();
                    // Filter out current product and limit to 4
                    const filtered = data
                        .filter((p: Product) => p.id !== product.id)
                        .slice(0, 4);
                    setRelatedProducts(filtered);
                }
            } catch (error) {
                console.error('Error fetching related products:', error);
            } finally {
                setLoadingRelated(false);
            }
        }

        if (product.category?.id) {
            fetchRelatedProducts();
        }
    }, [product.id, product.category.id]);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        setQuantity(1);
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/products" className="hover:text-blue-600">Products</Link>
                        <span className="mx-2">/</span>
                        {category && (
                            <>
                                <Link href={`/categories/${category.slug}`} className="hover:text-blue-600">
                                    {category.name}
                                </Link>
                                <span className="mx-2">/</span>
                            </>
                        )}
                        <span className="text-gray-900 font-medium">{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* Product Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl h-96 flex items-center justify-center relative overflow-hidden">
                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-4xl">📦</span>
                            </div>
                            {/* Badge */}
                            {product.stock > 0 && (
                                <div className="absolute top-4 left-4">
                                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                                        In Stock ({product.stock} available)
                                    </span>
                                </div>
                            )}
                            {product.onSale && (
                                <div className="absolute top-4 right-4">
                                    <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                                        On Sale
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((num) => (
                                <div
                                    key={num}
                                    className="bg-gray-100 rounded-lg h-20 flex items-center justify-center cursor-pointer hover:border-2 hover:border-blue-500 transition-all"
                                >
                                    <span className="text-lg">📸</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        {/* Category & Rating */}
                        <div className="flex items-center justify-between">
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                {category?.name || product.category?.name || 'Uncategorized'}
                            </span>
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} className={`${star <= Math.floor(product.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                            ⭐
                                        </span>
                                    ))}
                                </div>
                                <span className="text-gray-600 text-sm">
                                    {product.rating || 5}/5 ({product.reviewCount || 0} reviews)
                                </span>
                            </div>
                        </div>

                        {/* Product Title */}
                        <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>

                        {/* Price */}
                        <div className="flex items-center space-x-4">
                            <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                            {product.onSale && (
                                <>
                                    <span className="text-lg text-gray-500 line-through">${(product.price * 1.2).toFixed(2)}</span>
                                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                                        Save 20%
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Features */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    High quality materials
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    1-year warranty included
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Free shipping available
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    30-day return policy
                                </li>
                            </ul>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="space-y-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700 font-medium">Quantity:</span>
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button 
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
                                    <button 
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        disabled={quantity >= Math.min(10, product.stock)}
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {product.stock} available
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4">
                                <button 
                                    className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                >
                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                                <button className="flex-1 border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl hover:border-gray-400 transition-colors font-semibold text-lg">
                                    Add to Wishlist
                                </button>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex justify-center space-x-6 text-sm text-gray-600">
                                <button className="flex items-center space-x-2 hover:text-blue-600">
                                    <span>🔄</span>
                                    <span>Compare</span>
                                </button>
                                <button className="flex items-center space-x-2 hover:text-blue-600">
                                    <span>❤️</span>
                                    <span>Save for later</span>
                                </button>
                                <button className="flex items-center space-x-2 hover:text-blue-600">
                                    <span>📤</span>
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information Sections */}
                <div className="mt-16 border-t border-gray-200 pt-12">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8">
                            {['Description', 'Specifications', `Reviews (${product.reviewCount || 0})`, 'Shipping'].map((tab) => (
                                <button
                                    key={tab}
                                    className="py-4 px-1 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 text-gray-900 font-medium"
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="py-8">
                        <div className="prose max-w-none">
                            <h3>Product Details</h3>
                            <p>
                                This {product.name} is designed with the highest quality standards to ensure
                                complete customer satisfaction. Every detail has been carefully considered to
                                provide you with the best possible experience.
                            </p>

                            <h4>What&apos;s in the box?</h4>
                            <ul>
                                <li>1 x {product.name}</li>
                                <li>User manual and documentation</li>
                                <li>1-year warranty card</li>
                                <li>All necessary accessories</li>
                            </ul>

                            <h4>Care & Maintenance</h4>
                            <p>
                                To ensure the longevity of your product, please follow the care instructions
                                provided in the user manual. Avoid exposure to extreme temperatures and
                                handle with care.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
                    
                    {loadingRelated ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : relatedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <Link
                                    key={relatedProduct.id}
                                    href={`/products/${relatedProduct.slug}`}
                                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all"
                                >
                                    <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center mb-3">
                                        <span className="text-2xl">📦</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{relatedProduct.name}</h3>
                                    <p className="text-lg font-bold text-gray-900">${relatedProduct.price.toFixed(2)}</p>
                                    {relatedProduct.onSale && (
                                        <span className="inline-block mt-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                                            On Sale
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No related products found</p>
                    )}
                </div>
            </div>
        </div>
    );
}