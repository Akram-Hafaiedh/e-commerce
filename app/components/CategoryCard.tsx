import Image from "next/image";
import { CategoryWithCount } from "@/types/category";
import Link from "next/link";

export default function CategoryCard({ category, viewMode, featured = false }: { category: CategoryWithCount; viewMode: 'grid' | 'list'; featured?: boolean }) {
    if (viewMode === 'list') {
        return (
            <Link href={`/categories/${category.slug}`} className="group block">
                <div className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden hover:shadow-xl transition-all duration-300 ${featured ? 'border-amber-200 hover:border-amber-400' : 'border-gray-100 hover:border-blue-300'
                    }`}>
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden flex-shrink-0">
                            {category.image ? (
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-3xl">🛍️</span>
                                    </div>
                                </div>
                            )}
                            {featured && (
                                <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    Featured
                                </div>
                            )}
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    {category.description}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-4">
                                    {category._count && (
                                        <>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                                <span className="text-gray-600 font-medium">{category._count.products} products</span>
                                            </div>
                                            {category._count.children > 0 && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-gray-600 font-medium">{category._count.children} subcategories</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                                    Explore
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/categories/${category.slug}`} className="group block">
            <div className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:translate-y-[-8px] ${featured ? 'border-amber-200 hover:border-amber-400' : 'border-gray-100 hover:border-blue-300'
                }`}>
                <div className="h-56 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
                    {category.image ? (
                        <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                                <span className="text-4xl">🛍️</span>
                            </div>
                        </div>
                    )}
                    {featured && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Featured
                        </div>
                    )}
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {category.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                        {category.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        {category._count && (
                            <div className="flex gap-3">
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">{category._count.products}</span>
                                </div>
                                {category._count.children > 0 && (
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                                            <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <span className="font-medium">{category._count.children}</span>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                            Explore
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}