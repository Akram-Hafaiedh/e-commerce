'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { Warehouse } from '@/types/warehouse';
import { getErrorMessage } from '@/lib/error';
import { adjustStock } from '@/app/actions/inventory';
import { MovementType } from '@prisma/client';

export default function StockAdjustmentPage() {
    const { isAdmin, isLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [currentStock, setCurrentStock] = useState<{
        quantity: number;
        reserved: number;
        available: number;
    } | null>(null);

    const [formData, setFormData] = useState({
        productId: '',
        warehouseId: '',
        movementType: 'ADJUSTMENT' as const,
        quantity: '',
        note: '',
        referenceId: '',
    });

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/products?simple=true');
            if (response.ok) {
                const data = await response.json();
                setProducts(data.products || []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, []);

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

    const fetchCurrentStock = useCallback(async () => {
        if (!formData.productId || !formData.warehouseId) {
            setCurrentStock(null);
            return;
        }

        try {
            const response = await fetch(
                `/api/admin/inventory?productId=${formData.productId}&warehouseId=${formData.warehouseId}`
            );
            if (response.ok) {
                const data = await response.json();
                if (data.inventory && data.inventory.length > 0) {
                    const inv = data.inventory[0];
                    setCurrentStock({
                        quantity: inv.quantity,
                        reserved: inv.reserved,
                        available: inv.available,
                    });
                } else {
                    setCurrentStock({ quantity: 0, reserved: 0, available: 0 });
                }
            }
        } catch (error) {
            console.error('Error fetching current stock:', error);
            setCurrentStock(null);
        }
    }, [formData.productId, formData.warehouseId]);

    useEffect(() => {
        if (isAdmin && !isLoading) {
            Promise.all([fetchProducts(), fetchWarehouses()]).finally(() => {
                setFetching(false);
            });
        } else if (!isLoading && !isAdmin) {
            setFetching(false);
        }
    }, [isAdmin, isLoading, fetchProducts, fetchWarehouses]);

    useEffect(() => {
        fetchCurrentStock();
    }, [fetchCurrentStock]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const adjustment = parseInt(formData.quantity);
            if (adjustment < 0 && currentStock && Math.abs(adjustment) > currentStock.available) {
                throw new Error('Cannot adjust below available stock');
            }

            await adjustStock({
                productId: formData.productId,
                warehouseId: formData.warehouseId,
                quantity: adjustment,
                movementType: formData.movementType as MovementType,
                note: formData.note,
                referenceId: formData.referenceId
            });

            router.push('/admin/inventory');
            router.refresh();
        } catch (error: unknown) {
            setError(getErrorMessage(error));
            console.error('Error adjusting stock:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMovementTypeOptions = () => {
        return [
            { value: 'ADJUSTMENT', label: 'Manual Adjustment', description: 'Correct stock counts or fix discrepancies' },
            { value: 'RESTOCK', label: 'Restock', description: 'Add new inventory from suppliers' },
            { value: 'DAMAGED', label: 'Damaged Goods', description: 'Remove damaged or defective items' },
            { value: 'RETURN', label: 'Customer Return', description: 'Items returned by customers' },
            { value: 'SALE', label: 'Sale', description: 'Items sold to customers' },
        ];
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
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

    const newAvailable = currentStock ? currentStock.available + parseInt(formData.quantity) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/admin/inventory')}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors duration-200 font-medium"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Inventory
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Adjust Stock</h1>
                    <p className="mt-2 text-gray-600">
                        Update inventory levels and track stock movements
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded">
                                <p className="font-medium">Error</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {/* Product and Warehouse Selection */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                Product & Location
                            </h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Product */}
                                <div>
                                    <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-2">
                                        Product *
                                    </label>
                                    <select
                                        id="productId"
                                        name="productId"
                                        required
                                        value={formData.productId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    >
                                        <option value="">Select a product</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Warehouse */}
                                <div>
                                    <label htmlFor="warehouseId" className="block text-sm font-medium text-gray-700 mb-2">
                                        Warehouse *
                                    </label>
                                    <select
                                        id="warehouseId"
                                        name="warehouseId"
                                        required
                                        value={formData.warehouseId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    >
                                        <option value="">Select a warehouse</option>
                                        {warehouses.map((warehouse) => (
                                            <option key={warehouse.id} value={warehouse.id}>
                                                {warehouse.name} ({warehouse.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Current Stock Display */}
                            {currentStock !== null && (
                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm font-medium text-blue-900">Quantity</p>
                                        <p className="text-lg font-bold text-blue-700">{currentStock.quantity} units</p>
                                    </div>
                                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                        <p className="text-sm font-medium text-orange-900">Reserved</p>
                                        <p className="text-lg font-bold text-orange-700">{currentStock.reserved} units</p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-sm font-medium text-green-900">Available</p>
                                        <p className="text-lg font-bold text-green-700">{currentStock.available} units</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <hr className="border-gray-200" />

                        {/* Adjustment Details */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                Adjustment Details
                            </h2>

                            {/* Movement Type */}
                            <div className="mb-6">
                                <label htmlFor="movementType" className="block text-sm font-medium text-gray-700 mb-2">
                                    Movement Type *
                                </label>
                                <select
                                    id="movementType"
                                    name="movementType"
                                    required
                                    value={formData.movementType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                >
                                    {getMovementTypeOptions().map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500">
                                    {getMovementTypeOptions().find(opt => opt.value === formData.movementType)?.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Quantity */}
                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        required
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="e.g., +50 or -10"
                                        step="1"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Use positive numbers to add stock, negative to remove
                                    </p>
                                </div>

                                {/* Reference ID */}
                                <div>
                                    <label htmlFor="referenceId" className="block text-sm font-medium text-gray-700 mb-2">
                                        Reference ID
                                    </label>
                                    <input
                                        type="text"
                                        id="referenceId"
                                        name="referenceId"
                                        value={formData.referenceId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="e.g., PO-12345, RMA-67890"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Optional: Purchase order, RMA, or other reference
                                    </p>
                                </div>
                            </div>

                            {/* New Stock Preview */}
                            {newAvailable !== null && (
                                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-green-900">New Available After Adjustment:</span>
                                        <span className={`text-lg font-bold ${newAvailable < 0 ? 'text-red-600' : 'text-green-700'}`}>
                                            {newAvailable} units
                                        </span>
                                    </div>
                                    {newAvailable < 0 && (
                                        <p className="mt-2 text-xs text-red-600">
                                            Warning: This adjustment will result in negative stock
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <hr className="border-gray-200" />

                        {/* Notes */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                Additional Information
                            </h2>
                            <div>
                                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    id="note"
                                    name="note"
                                    rows={3}
                                    value={formData.note}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Add any additional context for this stock movement..."
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => router.push('/admin/inventory')}
                                className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !formData.productId || !formData.warehouseId || !formData.quantity}
                                className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition flex items-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    'Adjust Stock'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}