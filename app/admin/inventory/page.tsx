'use client';

import { useState, useEffect, useTransition, useCallback, useRef } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getInventoryList } from '@/app/actions/inventory';
import { Warehouse } from '@/types/warehouse';
import { InventoryItem } from '@/types/inventory';
import Image from 'next/image';

export default function InventoryManagement() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAdmin, isLoading } = useAuth();
    const [isPending, startTransition] = useTransition();

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [selectedWarehouse, setSelectedWarehouse] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [pageSize, setPageSize] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Use ref to track if initial load is done
    const initialLoadDone = useRef(false);

    // Fetch warehouses on mount
    useEffect(() => {
        if (isAdmin && !isLoading) {
            fetch('/api/admin/warehouses')
                .then(r => r.json())
                .then(data => setWarehouses(data.warehouses || []))
                .catch(err => console.error('Error fetching warehouses:', err));
        }
    }, [isAdmin, isLoading]);

    // Fetch inventory using server action
    const fetchInventory = useCallback((page: number) => {
        startTransition(async () => {
            try {
                const result = await getInventoryList({
                    page,
                    limit: pageSize,
                    warehouseId: selectedWarehouse !== 'all' ? selectedWarehouse : undefined,
                    search: searchQuery || undefined
                });

                if (result.success) {
                    setInventory(result.inventory as InventoryItem[]);
                    setTotalPages(result.pagination.totalPages);
                    setTotalCount(result.pagination.totalCount);
                    setCurrentPage(page);
                    setError('');
                } else {
                    setError(result.error || 'Failed to fetch inventory');
                }
            } catch (err) {
                console.error('Error fetching inventory:', err);
                setError('Error fetching inventory');
            } finally {
                setLoading(false);
            }
        });
    }, [pageSize, selectedWarehouse, searchQuery]);

    // Initial load - load URL params and fetch once
    useEffect(() => {
        if (isAdmin && !isLoading && !initialLoadDone.current) {
            const page = searchParams.get('page');
            const warehouse = searchParams.get('warehouse');
            const size = searchParams.get('pageSize');

            // Set state without triggering effects
            if (warehouse && warehouse !== 'all') setSelectedWarehouse(warehouse);
            if (size) setPageSize(Number(size));

            fetchInventory(page ? Number(page) : 1);
            initialLoadDone.current = true;
        } else if (!isLoading && !isAdmin) {
            setLoading(false);
        }
    }, [isAdmin, isLoading, searchParams, fetchInventory]);

    // Refetch when filters change (but NOT on initial load)
    useEffect(() => {
        if (isAdmin && !isLoading && initialLoadDone.current) {
            fetchInventory(1);
        }
    }, [selectedWarehouse, pageSize, searchQuery, isAdmin, isLoading, fetchInventory]);

    // Update URL when filters change
    useEffect(() => {
        if (!initialLoadDone.current) return; // Don't update URL during initial load

        const params = new URLSearchParams();
        if (selectedWarehouse !== 'all') params.set('warehouse', selectedWarehouse);
        if (currentPage > 1) params.set('page', currentPage.toString());
        if (pageSize !== 12) params.set('pageSize', pageSize.toString());

        const newUrl = params.toString() ? `?${params.toString()}` : '';
        router.push(`/admin/inventory${newUrl}`, { scroll: false });
    }, [selectedWarehouse, currentPage, pageSize, router]);

    const getStockStatus = (available: number, reorderPoint: number | null) => {
        if (available === 0) {
            return { status: 'out-of-stock', color: 'bg-red-100 text-red-800', text: 'Out of Stock' };
        }
        if (reorderPoint && available <= reorderPoint) {
            return { status: 'low-stock', color: 'bg-orange-100 text-orange-800', text: 'Low Stock' };
        }
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
                                disabled={isPending}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 bg-white text-gray-900"
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
                                disabled={isPending}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 bg-white text-gray-900"
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
                                disabled={isPending}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 bg-white text-gray-900 placeholder-gray-700"
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
                                                Total / Available
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Reserved
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
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
                                        {isPending ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-8 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                                                        Loading inventory...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            inventory.map((item) => {
                                                const stockStatus = getStockStatus(item.available, item.reorderPoint);
                                                return (
                                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                    {item.product.images && item.product.images.length > 0 ? (
                                                                        <Image
                                                                            width={80}
                                                                            height={80}
                                                                            src={item.product.images[0]}
                                                                            alt={item.product.name}
                                                                            className="h-10 w-10 object-cover"
                                                                        />
                                                                    ) : item.product.image ? (
                                                                        <Image
                                                                            width={80}
                                                                            height={80}
                                                                            src={item.product.image}
                                                                            alt={item.product.name}
                                                                            className="h-10 w-10 object-cover"
                                                                        />
                                                                    ) : (
                                                                        <span className="text-sm font-medium text-gray-600">
                                                                            {item.product.name.charAt(0)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {item.product.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        ${item.product.price} {item.product.sku && `• ${item.product.sku}`}
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
                                                                {item.quantity} / {item.available} units
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                Total / Available
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {item.reserved > 0 ? (
                                                                    <span className="text-orange-600 font-medium">{item.reserved} reserved</span>
                                                                ) : (
                                                                    <span className="text-gray-400">—</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                                                                {stockStatus.text}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(item.lastUpdated).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <Link
                                                                href="/admin/inventory/adjust"
                                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                                            >
                                                                Adjust
                                                            </Link>
                                                            <Link
                                                                href={`/admin/stock-movements?productId=${item.product.id}&warehouseId=${item.warehouse.id}`}
                                                                className="text-purple-600 hover:text-purple-900"
                                                            >
                                                                History
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing page <span className="font-medium">{currentPage}</span> of{' '}
                                            <span className="font-medium">{totalPages}</span> ({totalCount} total results)
                                        </p>
                                    </div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button
                                            onClick={() => fetchInventory(currentPage - 1)}
                                            disabled={currentPage === 1 || isPending}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            const page = i + 1;
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => fetchInventory(page)}
                                                    disabled={isPending}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        } disabled:opacity-50`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => fetchInventory(currentPage + 1)}
                                            disabled={currentPage === totalPages || isPending}
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