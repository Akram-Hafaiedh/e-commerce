'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/category';
import Image from 'next/image';

interface CategoryFormProps {
    category?: Category;
    isEditing?: boolean;
}

export default function CategoryForm({ category, isEditing = false }: CategoryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image: '',
        featured: false,
    });

    useEffect(() => {
        if (category && isEditing) {
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description,
                image: category.image,
                featured: category.featured || false,
            });
        }
    }, [category, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));

        // Auto-generate slug from name
        if (name === 'name' && !isEditing) {
            const generatedSlug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug: generatedSlug }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = isEditing ? `/api/categories/${category?.id}` : '/api/categories';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/admin/categories');
                router.refresh();
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Something went wrong');
            }
        } catch (error) {
            setError('Failed to save category');
            console.error('Error saving category:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Edit Category' : 'Create New Category'}
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter category name"
                            />
                        </div>

                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                                Slug *
                            </label>
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                required
                                value={formData.slug}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="category-slug"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                URL-friendly version of the name. Use hyphens instead of spaces.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter category description"
                            />
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Image URL *
                            </label>
                            <input
                                type="url"
                                id="image"
                                name="image"
                                required
                                value={formData.image}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com/image.jpg"
                            />
                            {formData.image && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                                    <Image
                                        src={formData.image}
                                        alt="Preview"
                                        className="h-32 w-32 object-cover rounded-md border"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="featured"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                                Featured Category
                            </label>
                        </div>

                        <div className="flex justify-end space-x-3 pt-6">
                            <button
                                type="button"
                                onClick={() => router.push('/admin/categories')}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}