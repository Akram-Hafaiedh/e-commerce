// components/UserDropdown.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

interface UserDropdownProps {
    isAdmin?: boolean; // Pass true when used in admin layout
}

export default function UserDropdown({ isAdmin = false }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, signOut, isAdmin: userIsAdmin } = useAuth();
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleProfile = () => {
        setIsOpen(false);
        router.push('/profile');
    };

    const handleOrders = () => {
        setIsOpen(false);
        router.push('/orders');
    };

    const handleAdmin = () => {
        setIsOpen(false);
        router.push('/admin');
    };

    const handleLogout = async () => {
        await signOut();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className={`flex items-center space-x-2 p-2 transition-colors ${isAdmin
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
            >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                    </span>
                </div>
                <span className={`text-sm font-medium ${isAdmin ? 'hidden sm:block' : 'hidden md:block'}`}>
                    {user?.name || user?.email}
                </span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${isAdmin ? 'text-gray-600' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* User Dropdown Menu */}
            {isOpen && (
                <div
                    className={`absolute ${isAdmin ? 'right-0' : 'right-0'
                        } mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50`}
                >
                    {/* User Info Section */}
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <p className="text-xs text-blue-600 mt-1 font-medium">
                            {userIsAdmin ? 'Administrator' : 'Customer'}
                        </p>
                    </div>

                    {/* Conditional rendering based on context */}
                    {!isAdmin ? (
                        <>
                            {/* Navbar context menu items */}
                            <button
                                onClick={handleProfile}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                My Profile
                            </button>

                            <button
                                onClick={handleOrders}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                My Orders
                            </button>

                            {/* Show Admin Dashboard option if user is admin */}
                            {userIsAdmin && (
                                <button
                                    onClick={handleAdmin}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                                >
                                    Admin Dashboard
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Admin context menu items */}
                            <Link
                                href="/"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Store
                            </Link>
                        </>
                    )}

                    {/* Logout Section */}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}