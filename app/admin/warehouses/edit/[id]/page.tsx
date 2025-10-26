'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useParams } from 'next/navigation';
import WarehouseForm from '@/app/components/forms/WarehouseForm';
import { Warehouse } from '@/types/warehouse';

export default function EditWarehousePage() {
    const { isAdmin, isLoading } = useAuth();
    const params = useParams();
    const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchWarehouse = useCallback(async () => {
        try {
            const response = await fetch(`/api/admin/warehouses/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setWarehouse(data.warehouse);
            }
        } catch (error) {
            console.error('Error fetching warehouse:', error);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        if (params.id && isAdmin && !isLoading) {
            fetchWarehouse();
        } else if (!isLoading && !isAdmin) {
            setLoading(false);
        }
    }, [params.id, isAdmin, isLoading, fetchWarehouse]);

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading warehouse...</p>
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

    if (!warehouse) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Warehouse Not Found</h1>
                    <p className="mt-2">The warehouse you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    return <WarehouseForm warehouse={warehouse} isEditing />;
}