'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { Order } from '@/types/order';

export default function OrdersPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders');
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };

        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <h3 className="mt-4 text-xl font-medium text-gray-900">No orders yet</h3>
                            <p className="mt-2 text-gray-500">You haven&apos;t placed any orders yet.</p>
                            <button
                                onClick={() => router.push('/products')}
                                className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                                            <p className="text-gray-500 text-sm">
                                                Placed on {new Date(order.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-900">${order.total}</p>
                                            <span className={`inline-block px-3 py-1 text-sm rounded-full ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                                        <div className="space-y-3">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                                            <span className="text-xs text-gray-500">IMG</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{item.product.name}</p>
                                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-medium text-gray-900">${item.product.price}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                                            View Order Details
                                        </button>
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                            Track Order
                                        </button>
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