'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const pathname = usePathname();

    const { getTotalItems } = useCart();

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                        <span className="text-xl font-bold text-gray-900">ShopStore</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className={`${pathname === '/'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-700 hover:text-blue-600'
                                } font-medium transition-colors`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className={`${pathname === '/products'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-700 hover:text-blue-600'
                                } font-medium transition-colors`}
                        >
                            Products
                        </Link>
                        <Link
                            href="/categories"
                            className={`${pathname.startsWith('/categories')
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-700 hover:text-blue-600'
                                } font-medium transition-colors`}
                        >
                            Categories
                        </Link>
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <Link
                            href="/cart"
                            className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {getTotalItems()}
                                </span>
                            )}
                        </Link>
                        <button className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}