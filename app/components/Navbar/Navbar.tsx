// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useEffect, useRef, useState } from 'react';
import CartDropdown from '../CartDropdown';
import { useAuth } from '../../hooks/useAuth';
import UserDropdown from '../UserDropdown';
import AuthDropdown from '../AuthDropdown';
import Image from 'next/image';

export default function Navbar() {
    const pathname = usePathname();
    const { getTotalItems } = useCart();
    const { user, isAuthenticated, isLoading } = useAuth();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const cartButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close cart dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cartButtonRef.current && !cartButtonRef.current.contains(event.target as Node)) {
                setIsCartOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCartClick = () => {
        setIsCartOpen(!isCartOpen);
    }

    const handleCloseCart = () => {
        setIsCartOpen(false);
    }

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50'
            : 'bg-white shadow-lg border-b border-gray-200'
            }`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        {/* <div className="w-8 h-8 bg-blue-600 rounded-full"></div> */}
                        <Image src="/web-app-manifest-512x512.png" alt="Logo" width={50} height={50} />
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

                        {/* Admin Link - Only show for admin users */}
                        {isAuthenticated && user?.role === 'admin' && (
                            <Link
                                href="/admin"
                                className={`${pathname.startsWith('/admin')
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-700 hover:text-blue-600'
                                    } font-medium transition-colors`}
                            >
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Cart */}
                        <button
                            ref={cartButtonRef}
                            onClick={handleCartClick}
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
                        </button>

                        <CartDropdown
                            isOpen={isCartOpen}
                            onClose={handleCloseCart}
                        />

                        {/* Single Authentication Dropdown */}
                        {isLoading ? (
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        ) : isAuthenticated ? (
                            <UserDropdown />
                        ) : (
                            <AuthDropdown />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}