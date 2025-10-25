'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import Link from 'next/link';
import { Warehouse } from '@/types/warehouse';

export default function WarehousesManagement() {
    const { isAdmin, isLoading } = useAuth();
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchWarehouses = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/warehouses');
            if (response.ok) {
                const data = await response.json();
                setWarehouses(data.warehouses || []);
            } else {
                setError('Failed to fetch warehouses');
            }
        } catch (error) {
            console.error('Error fetching warehouses:', error);
            setError('Error fetching warehouses');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAdmin && !isLoading) {
            fetchWarehouses();
        } else if (!isLoading && !isAdmin) {
            setLoading(false);
        }
    }, [isAdmin, isLoading, fetchWarehouses]);

    const deleteWarehouse = async (id: string) => {
        if (!confirm('Are you sure you want to delete this warehouse?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/warehouses/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setWarehouses(warehouses.filter(warehouse => warehouse.id !== id));
            } else {
                setError('Failed to delete warehouse');
            }
        } catch (error) {
            console.error('Error deleting warehouse:', error);
            setError('Error deleting warehouse');
        }
    };

    const getWarehouseTypeColor = (type: string) => {
        const colors: Record<string, { badge: string; icon: string }> = {
            MAIN: { badge: 'bg-blue-100 text-blue-800', icon: '🏢' },
            REGIONAL: { badge: 'bg-purple-100 text-purple-800', icon: '📦' },
            STORE: { badge: 'bg-green-100 text-green-800', icon: '🏬' },
            VIRTUAL: { badge: 'bg-orange-100 text-orange-800', icon: '☁️' },
        };
        return colors[type] || { badge: 'bg-gray-100 text-gray-800', icon: '📍' };
    };

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading warehouses...</p>
                </div>
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
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Warehouses Management</h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Manage your warehouse locations and inventory ({warehouses.length} total)
                        </p>
                    </div>
                    <Link
                        href="/admin/warehouses/new"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg inline-flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Warehouse
                    </Link>
                </div>

                {error && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {warehouses.length === 0 && !loading ? (
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
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No warehouses</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by creating your first warehouse.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/admin/warehouses/new"
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
                                    Add New Warehouse
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                        <ul className="divide-y divide-gray-200">
                            {warehouses.map((warehouse) => {
                                const { badge, icon } = getWarehouseTypeColor(warehouse.type);
                                return (
                                    <li key={warehouse.id}>
                                        <div className="px-4 py-5 sm:px-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center flex-1 min-w-0">
                                                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-xl">{icon}</span>
                                                    </div>
                                                    <div className="ml-4 flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                                {warehouse.name}
                                                            </h3>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge}`}>
                                                                {warehouse.type}
                                                            </span>
                                                            <div className="inline-flex items-center">
                                                                <div className={`w-2 h-2 rounded-full mr-2 ${warehouse.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                                <span className="text-xs font-medium text-gray-700">
                                                                    {warehouse.isActive ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <span className="font-medium text-gray-600">{warehouse.code}</span>
                                                            <span>•</span>
                                                            <svg className="w-4 h-4 text-gray-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span>{warehouse.address}, {warehouse.city}, {warehouse.country}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 ml-4">
                                                    <Link
                                                        href={`/admin/warehouses/edit/${warehouse.id}`}
                                                        className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteWarehouse(warehouse.id)}
                                                        className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}