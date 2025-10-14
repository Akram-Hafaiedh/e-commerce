import Link from 'next/link';
import { categories } from '@/lib/data';

export default function CategoriesPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Categories</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Browse our wide range of product categories. Find exactly what you&#39;re looking for.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="group block"
                        >
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]">
                                <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-2xl">🛍️</span>
                                    </div>
                                </div>

                                <div className="p-6 text-center">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {category.name}
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        {category.description}
                                    </p>
                                    <div className="mt-4 text-blue-600 font-medium group-hover:underline">
                                        Explore {category.name} →
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}