'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/types/product';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Focus search input when search opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    // Search functionality with debounce
    useEffect(() => {
        const delaySearch = setTimeout(async () => {
            if (searchQuery.trim().length > 0) {
                setIsSearching(true);
                try {
                    // Replace this with your actual API endpoint
                    const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=20`);
                    const data = await response.json();
                    setSearchResults(data.products || []);
                } catch (error) {
                    console.error('Search error:', error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [searchQuery]);

    const handleClose = useCallback(() => {
        setSearchQuery('');
        setSearchResults([]);
        onClose();
    }, [onClose]);

    // Close search on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, handleClose]);

    // Prevent body scroll when search is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            handleClose();
        }
    };

    const handleProductClick = (productId: string) => {
        router.push(`/products/${productId}`);
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop with page blur effect */}
            <div className="fixed inset-0 backdrop-blur-xl bg-black/20 z-[60] animate-in fade-in duration-200" />

            {/* Subtle color overlay */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-800/10 z-[61]" />

            {/* Animated Background Elements - Very subtle */}
            <div className="fixed inset-0 z-[62]">
                <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob animation-delay-4000"></div>
            </div>

            {/* Search Content */}
            <div className="fixed inset-0 z-[63] flex flex-col items-center pt-32 px-4">
                {/* Close Button - Top Right Corner */}
                <button
                    onClick={handleClose}
                    className="absolute top-8 right-8 p-3 text-gray-700 hover:text-gray-900 bg-white/80 hover:bg-white rounded-xl transition-all duration-300 backdrop-blur-md border border-white/30 shadow-lg"
                    aria-label="Close search"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="w-full max-w-2xl">
                    {/* Search Input */}
                    <div className="relative mb-6">
                        <form onSubmit={handleSearchSubmit} className="w-full">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for products..."
                                className="w-full px-6 py-4 pl-14 text-lg border-2 border-white/50 rounded-2xl bg-white/80 backdrop-blur-xl focus:bg-white hover:bg-white focus:text-gray-900 focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 shadow-2xl"
                            />
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>
                    </div>

                    {/* Search Results Card */}
                    <div className="w-full max-h-[60vh] overflow-y-auto rounded-2xl backdrop-blur-xl bg-white/90 border border-white/50 shadow-2xl">
                        {isSearching ? (
                            <div className="flex flex-col items-center justify-center py-16 space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                <p className="text-gray-600 text-lg">Searching products...</p>
                            </div>
                        ) : searchQuery.trim().length > 0 ? (
                            searchResults.length > 0 ? (
                                <div className="space-y-2 p-6">
                                    {searchResults.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => handleProductClick(product.id)}
                                            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-300 text-left group border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform border border-gray-200">
                                                {product.image ? (
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 truncate">{product.category.name}</p>
                                            </div>
                                            <div className="text-lg font-semibold text-blue-600">
                                                ${product.price}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                // Enhanced "No products found" state
                                <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 border border-gray-200">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                                    <p className="text-gray-600 text-lg mb-6 max-w-md">
                                        We couldn&apos;t find any products matching &quot;<span className="text-blue-600 font-semibold">{searchQuery}</span>&quot;
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded-xl transition-all duration-300 font-medium hover:scale-105"
                                        >
                                            Clear Search
                                        </button>
                                        <button
                                            onClick={() => router.push('/products')}
                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 font-semibold hover:scale-105 hover:shadow-lg"
                                        >
                                            Browse All Products
                                        </button>
                                    </div>
                                </div>
                            )
                        ) : (
                            // Enhanced initial search state
                            <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                                <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mb-8 border border-gray-200">
                                    <svg className="w-14 h-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">Start typing to search</h3>
                                <p className="text-gray-600 text-xl mb-2">Find products by name or category</p>
                                <p className="text-gray-500 text-sm mb-8">Try searching for specific product names</p>

                                {/* Quick search suggestions */}
                                <div className="flex flex-wrap gap-3 justify-center">
                                    {['electronics', 'clothing', 'phones', 'books', 'home'].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => setSearchQuery(suggestion)}
                                            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg transition-all duration-300 text-sm capitalize hover:scale-105"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Tips - Bottom Center */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-300 shadow-lg">
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                        <span className="text-sm font-medium text-gray-700">💡 Press ESC to close</span>
                    </div>
                </div>
            </div>
        </>
    );
}