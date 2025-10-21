'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useParams } from 'next/navigation';
import { Category } from '@/types/category';
import CategoryForm from '@/app/components/forms/CategoryForm';

export default function EditCategoryPage() {
    const { isAdmin, isLoading } = useAuth();
    const params = useParams();
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchCategory = useCallback(async () => {
        try {
            const response = await fetch(`/api/admin/categories/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setCategory(data.category);
            }
        } catch (error) {
            console.error('Error fetching category:', error);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        if (params.id && isAdmin && !isLoading) {
            fetchCategory();
        } else if (!isLoading && !isAdmin) {
            setLoading(false);
        }
    }, [params.id, isAdmin, isLoading, fetchCategory]);

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

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Category Not Found</h1>
                    <p className="mt-2">The category you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    return <CategoryForm category={category} isEditing />;
}