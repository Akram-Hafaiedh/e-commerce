'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Warehouse } from '@/types/warehouse';

interface WarehouseFormProps {
    warehouse?: Warehouse;
    isEditing?: boolean;
}

export default function WarehouseForm({ warehouse, isEditing = false }: WarehouseFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        type: 'REGIONAL' as Warehouse['type'],
        isActive: true,
    });

    useEffect(() => {
        if (warehouse && isEditing) {
            setFormData({
                name: warehouse.name,
                code: warehouse.code,
                address: warehouse.address,
                city: warehouse.city,
                country: warehouse.country,
                postalCode: warehouse.postalCode,
                type: warehouse.type,
                isActive: warehouse.isActive,
            });
        }
    }, [warehouse, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = isEditing ? `/api/admin/warehouses/${warehouse?.id}` : '/api/admin/warehouses';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/admin/warehouses');
                router.refresh();
            } else {
                const errorData = await response.json();
                setError(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} warehouse`);
            }
        } catch (error) {
            setError(`Error ${isEditing ? 'updating' : 'creating'} warehouse`);
            console.error(`Error ${isEditing ? 'updating' : 'creating'} warehouse:`, error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/admin/warehouses')}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors duration-200 font-medium"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Warehouses
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isEditing ? 'Edit Warehouse' : 'Create New Warehouse'}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        {isEditing ? 'Update warehouse details and information' : 'Add a new warehouse location to your inventory system'}
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

                        {/* Basic Information Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Name */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Warehouse Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="e.g., Main Distribution Center"
                                    />
                                </div>

                                {/* Code */}
                                <div>
                                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                                        Warehouse Code *
                                    </label>
                                    <input
                                        type="text"
                                        id="code"
                                        name="code"
                                        required
                                        value={formData.code}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="e.g., WH-MAIN-001"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Unique identifier for the warehouse</p>
                                </div>

                                {/* Type */}
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                        Warehouse Type *
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        required
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    >
                                        <option value="MAIN">Main Warehouse</option>
                                        <option value="REGIONAL">Regional Warehouse</option>
                                        <option value="STORE">Store</option>
                                        <option value="VIRTUAL">Virtual Warehouse</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Address Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                Location Details
                            </h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Address */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="e.g., 123 Main Street"
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="e.g., New York"
                                    />
                                </div>

                                {/* Country */}
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        required
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="e.g., United States"
                                    />
                                </div>

                                {/* Postal Code */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                                        Postal Code *
                                    </label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        name="postalCode"
                                        required
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="e.g., 10001"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Status Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                Status
                            </h2>
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <div className="ml-3">
                                    <label htmlFor="isActive" className="block text-sm font-medium text-gray-900">
                                        Active Warehouse
                                    </label>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Inactive warehouses won&apos;t be available for inventory operations
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => router.push('/admin/warehouses')}
                                className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition flex items-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        {isEditing ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    isEditing ? 'Update Warehouse' : 'Create Warehouse'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}