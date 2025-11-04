'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getErrorMessage } from '@/lib/error';

export default function TrackOrderPage() {
    const router = useRouter();
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Verify order exists and email matches
            const response = await fetch('/api/orders/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderNumber, email })
            });

            const data = await response.json();

            if (data.success) {
                router.push(`/orders/${orderNumber}`);
            } else {
                setError('Order not found or email does not match');
            }
        } catch (error) {
            setError(getErrorMessage(error));
            console.error('Error adjusting stock:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Track Your Order</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Order Number
                            </label>
                            <input
                                type="text"
                                id="orderNumber"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="ORD-2024-000001"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="your@email.com"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-semibold"
                        >
                            {loading ? 'Checking...' : 'Track Order'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}