'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import Link from 'next/link';
import { Category } from '@/types/category';
import Image from 'next/image';

export default function CategoriesManagement() {
    const { isAdmin, isLoading } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories);
            } else {
                setError('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Error fetching categories');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAdmin && !isLoading) {
            fetchCategories();
        } else if (!isLoading && !isAdmin) {
            setLoading(false);
        }
    }, [isAdmin, isLoading, fetchCategories]);

    const deleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCategories(categories.filter(category => category.id !== id));
            } else {
                setError('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            setError('Error deleting category');
        }
    };

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Loading...</div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                    <p className="mt-2">You don&apos;t have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Manage your product categories
                        </p>
                    </div>
                    <Link
                        href="/admin/categories/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Add New Category
                    </Link>
                </div>

                {error && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {categories.length === 0 && !loading ? (
                    <div className="mt-8 bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-12 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No categories</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by creating your first category.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/admin/categories/new"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <svg
                                        className="-ml-1 mr-2 h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Add New Category
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <div key={category.id} className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-md overflow-hidden">
                                            <Image
                                                src={category.image}
                                                alt={category.name}
                                                width={48}
                                                height={48}
                                                className="h-12 w-12 object-cover"
                                            />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
                                            {category.featured && (
                                                <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <Link
                                            href={`/admin/categories/edit/${category.id}`}
                                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => deleteCategory(category.id)}
                                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}