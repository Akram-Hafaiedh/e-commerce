import { Suspense } from 'react';
import ProductsContent from './ProductsContent';

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}