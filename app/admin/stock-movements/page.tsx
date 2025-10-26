'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface StockMovement {
    id: string;
    productId: string;
    warehouseId: string;
    quantity: number;
    stockAfter: number;
    movementType: string;
    referenceId: string | null;
    note: string | null;
    createdAt: string;
    createdBy: string | null;
    product: {
        id: string;
        name: string;
    };
    warehouse: {
        id: string;
        name: string;
        code: string;
    };
}

export default function StockMovementsPage() {
    const { isAdmin, isLoading } = useAuth();
    const searchParams = useSearchParams();
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        movementType: 'all',
        warehouseId: searchParams.get('warehouseId') || 'all',
        productId: searchParams.get('productId') || 'all',
    });

    const fetchMovements = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (filters.movementType !== 'all') params.append('movementType', filters.movementType);
            if (filters.warehouseId !== 'all') params.append('warehouseId', filters.warehouseId);
            if (filters.productId !== 'all') params.append('productId', filters.productId);

            const response = await fetch(`/api/admin/stock-movements?${params}`);
            if (response.ok) {
                const data = await response.json();
                setMovements(data.movements || []);
            } else {
                setError('Failed to fetch stock movements');
            }
        } catch (error) {
            console.error('Error fetching stock movements:', error);
            setError('Error fetching stock movements');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        if (isAdmin && !isLoading) {
            fetchMovements();
        } else if (!isLoading && !isAdmin) {
            setLoading(false);
        }
    }, [isAdmin, isLoading, fetchMovements]);

    const getMovementTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            SALE: 'bg-red-100 text-red-800',
            RETURN: 'bg-green-100 text-green-800',
            RESTOCK: 'bg-blue-100 text-blue-800',
            ADJUSTMENT: 'bg-orange-100 text-orange-800',
            RESERVATION: 'bg-purple-100 text-purple-800',
            RELEASE: 'bg-indigo-100 text-indigo-800',
            TRANSFER_IN: 'bg-teal-100 text-teal-800',
            TRANSFER_OUT: 'bg-cyan-100 text-cyan-800',
            DAMAGED: 'bg-gray-100 text-gray-800',
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const getMovementIcon = (type: string) => {
        const icons: Record<string, string> = {
            SALE: '🛒',
            RETURN: '↩️',
            RESTOCK: '📦',
            ADJUSTMENT: '⚖️',
            RESERVATION: '⏳',
            RELEASE: '🔓',
            TRANSFER_IN: '⬇️',
            TRANSFER_OUT: '⬆️',
            DAMAGED: '💥',
        };
        return icons[type] || '📊';
    };

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading stock movements...</p>
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
                        <h1 className="text-3xl font-bold text-gray-900">Stock Movements</h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Track all inventory changes and movements ({movements.length} records)
                        </p>
                    </div>
                    <Link
                        href="/admin/inventory"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg inline-flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Back to Inventory
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="movement-type" className="block text-sm font-medium text-gray-700 mb-1">
                                Movement Type
                            </label>
                            <select
                                id="movement-type"
                                value={filters.movementType}
                                onChange={(e) => setFilters(prev => ({ ...prev, movementType: e.target.value }))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Types</option>
                                <option value="SALE">Sale</option>
                                <option value="RETURN">Return</option>
                                <option value="RESTOCK">Restock</option>
                                <option value="ADJUSTMENT">Adjustment</option>
                                <option value="TRANSFER_IN">Transfer In</option>
                                <option value="TRANSFER_OUT">Transfer Out</option>
                            </select>
                        </div>
                        {/* Add warehouse and product filters here */}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Movements Table */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    {movements.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No stock movements</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Stock movements will appear here when inventory changes occur.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Warehouse
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stock After
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Notes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {movements.map((movement) => (
                                        <tr key={movement.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(movement.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(movement.createdAt).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {movement.product.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{movement.warehouse.name}</div>
                                                <div className="text-sm text-gray-500">{movement.warehouse.code}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-lg mr-2">{getMovementIcon(movement.movementType)}</span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMovementTypeColor(movement.movementType)}`}>
                                                        {movement.movementType.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm font-medium ${movement.quantity < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {movement.stockAfter} units
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {movement.note || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}