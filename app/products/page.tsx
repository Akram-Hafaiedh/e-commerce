import { Suspense } from 'react';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import ProductsClient from './ProductsClient';


const ITEMS_PER_PAGE = 12;

interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}


type SearchParams = {
    page?: string;
    search?: string;
    categories?: string;
    featured?: string;
    onSale?: string;
};

async function getProducts(searchParams: SearchParams): Promise<ProductsResponse> {
    const page = Math.max(1, Number(searchParams.page ?? 1));
    const params = new URLSearchParams();

    params.set('page', page.toString());
    params.set('limit', ITEMS_PER_PAGE.toString());

    if (searchParams.featured === 'true') params.set('featured', 'true');
    if (searchParams.onSale === 'true') params.set('onSale', 'true');
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.categories) params.set('categories', searchParams.categories);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
        next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
        return {
            products: [],
            total: 0,
            page: 1,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
        };
    }

    return response.json();
}


async function getCategories(): Promise<Category[]> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    try {
        const response = await fetch(`${baseUrl}/api/categories`, {
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data.categories || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams.page || '1';
    const search = resolvedSearchParams.search || '';

    return {
        title: search
            ? `Search: ${search} - Products | Your Store`
            : `Products${page !== '1' ? ` - Page ${page}` : ''} | Your Store`,
        description: 'Browse our wide selection of high-quality products at competitive prices.',
    };
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    // Fetch data in parallel on the server
    const resolvedSearchParams = await searchParams;

    const [initialData, categories] = await Promise.all([
        getProducts(resolvedSearchParams),
        getCategories()
    ]);

    return (
        <Suspense fallback={<ProductsLoadingSkeleton />}>
            <ProductsClient
                initialProducts={initialData.products}
                initialTotal={initialData.total}
                initialPage={initialData.page}
                initialTotalPages={initialData.totalPages}
                categories={categories}
                searchParams={resolvedSearchParams}
            />
        </Suspense>
    );
}


function ProductsLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Header Skeleton */}
            <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative container mx-auto px-4 py-12">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-3 animate-pulse">
                            <span className="w-2 h-2 bg-white/30 rounded-full"></span>
                            <span className="h-4 w-32 bg-white/30 rounded"></span>
                        </div>
                        <div className="h-12 bg-white/20 rounded w-96 mx-auto mb-4 animate-pulse"></div>
                        <div className="h-6 bg-white/20 rounded w-[600px] max-w-full mx-auto animate-pulse"></div>
                    </div>
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1 h-14 bg-white/20 rounded-xl animate-pulse"></div>
                            <div className="h-14 w-full md:w-40 bg-white/20 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Skeleton */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                            <div className="h-48 bg-gray-200"></div>
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-8 bg-gray-200 rounded w-24"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}