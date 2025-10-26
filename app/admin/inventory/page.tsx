'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import Link from 'next/link';
import { Warehouse } from '@/types/warehouse';
import { InventoryItem } from '@/types/inventory';
import { useRouter, useSearchParams } from 'next/navigation';

export default function InventoryManagement() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAdmin, isLoading } = useAuth();
    const [pageLoading, setPageLoading] = useState(false);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [pageSize, setPageSize] = useState(12);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('all');
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchInventory = useCallback(async (page: number) => {
        setPageLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', pageSize.toString());
            if (searchQuery) {
                params.append('search', searchQuery);
            }
            if (selectedWarehouse && selectedWarehouse !== 'all') {
                params.append('warehouseId', selectedWarehouse);
            }

            const response = await fetch(`/api/admin/inventory?${params}`);
            if (response.ok) {
                const data = await response.json();
                setInventory(data.inventory || []);
                setTotalPages(data.pagination.totalPages);
                setTotalCount(data.pagination.totalCount);
                setCurrentPage(page);
            } else {
                setError('Failed to fetch inventory');
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
            setError('Error fetching inventory');
        } finally {
            setLoading(false);
            setPageLoading(false);
        }
    }, [selectedWarehouse, pageSize, searchQuery]);

    const fetchWarehouses = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/warehouses');
            if (response.ok) {
                const data = await response.json();
                setWarehouses(data.warehouses || []);
            }
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    }, []);

    useEffect(() => {
        if (isAdmin && !isLoading) {
            fetchWarehouses();
            fetchInventory(1);
        } else if (!isLoading && !isAdmin) {
            setLoading(false);
        }
    }, [isAdmin, isLoading, fetchWarehouses, fetchInventory]);

    useEffect(() => {
        if (isAdmin && !isLoading) {
            fetchInventory(1);
        }
    }, [selectedWarehouse, isAdmin, isLoading, fetchInventory, pageSize, searchQuery]);

    // Update URL when filters/page change
    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedWarehouse !== 'all') params.set('warehouse', selectedWarehouse);
        if (currentPage > 1) params.set('page', currentPage.toString());
        if (pageSize !== 12) params.set('pageSize', pageSize.toString());

        const newUrl = params.toString() ? `?${params.toString()}` : '';
        router.push(`/admin/inventory${newUrl}`, { scroll: false });
    }, [selectedWarehouse, currentPage, pageSize, router]);

    useEffect(() => {
        const warehouse = searchParams.get('warehouse');
        const page = searchParams.get('page');
        const size = searchParams.get('pageSize');

        if (warehouse) setSelectedWarehouse(warehouse);
        if (page) setCurrentPage(Number(page));
        if (size) setPageSize(Number(size));
    }, [searchParams]);

    const getStockStatus = (quantity: number, reorderPoint: number | null) => {
        if (quantity === 0) return { status: 'out-of-stock', color: 'bg-red-100 text-red-800', text: 'Out of Stock' };
        if (reorderPoint && quantity <= reorderPoint) return { status: 'low-stock', color: 'bg-orange-100 text-orange-800', text: 'Low Stock' };
        return { status: 'in-stock', color: 'bg-green-100 text-green-800', text: 'In Stock' };
    };

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading inventory...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Track stock levels across all warehouses ({totalCount} items)
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/admin/stock-movements"
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-md hover:shadow-lg inline-flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            View Stock Movements
                        </Link>
                        <Link
                            href="/admin/inventory/adjust"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg inline-flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Adjust Stock
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div>
                            <label htmlFor="warehouse-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                Filter by Warehouse
                            </label>
                            <select
                                id="warehouse-filter"
                                value={selectedWarehouse}
                                onChange={(e) => setSelectedWarehouse(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Warehouses</option>
                                {warehouses.map(warehouse => (
                                    <option key={warehouse.id} value={warehouse.id}>
                                        {warehouse.name} ({warehouse.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="page-size" className="block text-sm font-medium text-gray-700 mb-1">
                                Items per page
                            </label>
                            <select
                                id="page-size"
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="product-search" className="block text-sm font-medium text-gray-700 mb-1">
                                Search Products
                            </label>
                            <input
                                type="text"
                                id="product-search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Search products..."
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Inventory Table */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    {totalCount === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No inventory items</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by adding products to warehouses.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Warehouse
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock Level
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Min Stock
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Last Updated
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">

                                        {pageLoading ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-8 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                                                        Loading inventory...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (inventory.map((item) => {
                                            const stockStatus = getStockStatus(item.quantity, item.reorderPoint);
                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                <span className="text-sm font-medium text-gray-600">
                                                                    {item.product.name.charAt(0)}
                                                                </span>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {item.product.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    ${item.product.price}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{item.warehouse.name}</div>
                                                        <div className="text-sm text-gray-500">{item.warehouse.code}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.quantity} units
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                                                            {stockStatus.text}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.minStock || 'Not set'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(item.lastUpdated).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                                                            Adjust
                                                        </button>
                                                        <Link
                                                            href={`/admin/stock-movements?productId=${item.productId}&warehouseId=${item.warehouseId}`}
                                                            className="text-purple-600 hover:text-purple-900"
                                                        >
                                                            History
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        }))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => fetchInventory(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => fetchInventory(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>

                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span> ({totalCount} total results)
                                        </p>
                                    </div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => fetchInventory(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => fetchInventory(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => fetchInventory(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}