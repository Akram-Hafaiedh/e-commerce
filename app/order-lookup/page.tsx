// app/order-lookup/page.tsx
'use client';

import { Order, OrderItem } from '@/types/order';
import { useState } from 'react';

export default function OrderLookupPage() {
    const [email, setEmail] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/orders/lookup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, orderNumber }),
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders || []);
                if (data.orders.length === 0) {
                    setError('No orders found with the provided information.');
                }
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to find orders');
            }
        } catch (error) {
            console.error('Error looking up order:', error);
            setError('An error occurred while looking up your order.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Lookup</h1>

                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <form onSubmit={handleLookup} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter the email used for the order"
                                />
                            </div>

                            <div>
                                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                    Order Number
                                </label>
                                <input
                                    type="text"
                                    id="orderNumber"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your order number"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Looking up order...' : 'Find Order'}
                            </button>
                        </form>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-800">{error}</p>
                        </div>
                    )}

                    {orders.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">Your Orders</h2>
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Order #{order.orderNumber}
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                            {order.guestEmail && (
                                                <p className="text-gray-500 text-sm">
                                                    Guest order: {order.guestEmail}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-900">
                                                ${order.total.toFixed(2)}
                                            </p>
                                            <span className={`inline-block px-3 py-1 text-sm rounded-full ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                                        <div className="space-y-3">
                                            {order.items.map((item: OrderItem, index: number) => (
                                                <div key={index} className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                                            <span className="text-xs text-gray-500">IMG</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {item.product.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Qty: {item.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="font-medium text-gray-900">
                                                        ${item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}