'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/forms/ProductForm';
import { Product } from '@/types/product';

export default function EditProductPage() {
    const { isAdmin, isLoading } = useAuth();
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProduct = useCallback(async () => {
        try {
            const response = await fetch(`/api/admin/products/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setProduct(data.product);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        if (params.id && isAdmin && !isLoading) {
            fetchProduct();
        } else if (!isLoading && !isAdmin) {
            setLoading(false);
        }
    }, [params.id, isAdmin, isLoading, fetchProduct]);

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product...</p>
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

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Product Not Found</h1>
                    <p className="mt-2">The product you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    return <ProductForm product={product} isEditing />;
}