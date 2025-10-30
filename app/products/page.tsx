import { Suspense } from 'react';
import ProductsContent from './ProductsContent';

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading amazing products...</p>
                </div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}