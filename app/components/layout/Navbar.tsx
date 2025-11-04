'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import CartDropdown from '../CartDropdown';
import { useAuth } from '../../hooks/useAuth';
import UserDropdown from '../UserDropdown';
import AuthDropdown from '../AuthDropdown';
import Image from 'next/image';
import SearchOverlay from '../parts/SearchOverlay';

export default function Navbar() {
    const pathname = usePathname();
    const { getTotalItems } = useCart();
    const { user, isAuthenticated, isLoading } = useAuth();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const cartButtonRef = useRef<HTMLButtonElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const handleCartClick = () => {
        setIsCartOpen(!isCartOpen);
    }

    const handleCloseCart = () => {
        setIsCartOpen(false);
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    const handleSearchOpen = () => {
        setIsSearchOpen(true);
    };

    const handleSearchClose = useCallback(() => {
        setIsSearchOpen(false);
    }, []);

    const handleLogout = () => {
        // Add your logout logic here
        console.log('Logout clicked');
    };


    return (
        <>
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50'
                : 'bg-white shadow-lg border-b border-gray-200'
                }`}>
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <Image src="/logo.svg" className="h-8 w-8 object-contain" alt="Logo" width={40} height={40} />
                            <span className="text-xl font-bold text-gray-900">ShopStore</span>
                        </Link>

                        {/* Desktop Navigation Links */}
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
                            <Link
                                href="/orders/track"
                                className={`${pathname.startsWith('/orders')
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-700 hover:text-blue-600'
                                    } font-medium transition-colors`}
                            >
                                Orders
                            </Link>
                        </div>

                        {/* Right side icons */}
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {/* Search - Hidden on smallest screens */}
                            <button
                                onClick={handleSearchOpen}
                                className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                                aria-label="Search"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Cart */}
                            <button
                                ref={cartButtonRef}
                                onClick={handleCartClick}
                                className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
                                aria-label="Cart"
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

                            {/* Desktop Authentication Dropdown */}
                            <div className="hidden md:block">
                                {isLoading ? (
                                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                ) : isAuthenticated ? (
                                    <UserDropdown />
                                ) : (
                                    <AuthDropdown />
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={toggleMobileMenu}
                                className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <SearchOverlay
                isOpen={isSearchOpen}
                onClose={handleSearchClose}
            />

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" />
            )}

            {/* Mobile Menu */}
            <div
                ref={mobileMenuRef}
                className={`fixed top-16 right-0 bottom-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Navigation Links */}
                    <div className="flex-1 py-6 px-4 space-y-4 overflow-y-auto">
                        <Link
                            href="/"
                            className={`block py-2 px-4 rounded-lg ${pathname === '/'
                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                : 'text-gray-700 hover:bg-gray-50'
                                } transition-colors`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className={`block py-2 px-4 rounded-lg ${pathname === '/products'
                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                : 'text-gray-700 hover:bg-gray-50'
                                } transition-colors`}
                        >
                            Products
                        </Link>
                        <Link
                            href="/categories"
                            className={`block py-2 px-4 rounded-lg ${pathname.startsWith('/categories')
                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                : 'text-gray-700 hover:bg-gray-50'
                                } transition-colors`}
                        >
                            Categories
                        </Link>
                        <Link
                            href="/orders/track"
                            className={`block py-2 px-4 rounded-lg ${pathname.startsWith('/orders')
                                ? 'bg-blue-50 text-blue-600 font-semibold'
                                : 'text-gray-700 hover:bg-gray-50'
                                } transition-colors`}
                        >
                            Orders
                        </Link>


                        {/* Search on mobile */}
                        <button className="w-full py-2 px-4 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2 sm:hidden">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>Search</span>
                        </button>
                    </div>

                    {/* User Section */}
                    <div className="border-t border-gray-200 p-4">
                        {isLoading ? (
                            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                        ) : isAuthenticated ? (
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <Link
                                    href="/profile"
                                    className="block py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/orders"
                                    className="block py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Orders
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left py-2 px-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link
                                    href="/login"
                                    className="block w-full py-2 px-4 rounded-lg bg-blue-600 text-white text-center font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="block w-full py-2 px-4 rounded-lg border border-blue-600 text-blue-600 text-center font-medium hover:bg-blue-50 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}