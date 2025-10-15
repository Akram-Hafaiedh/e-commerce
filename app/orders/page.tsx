// app/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order } from '@/types/order';
import { mockOrders } from '@/lib/mockOrders';



export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would be an API call


        setTimeout(() => {
            setOrders(mockOrders);
            setLoading(false);
        }, 1000);
    }, []);

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'delivered':
                return '✅';
            case 'processing':
                return '🔄';
            case 'shipped':
                return '🚚';
            case 'cancelled':
                return '❌';
            default:
                return '📦';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                            <div className="space-y-4">
                                {[1, 2].map((n) => (
                                    <div key={n} className="border border-gray-200 rounded-lg p-6">
                                        <div className="h-4 bg-gray-200 rounded w-1/6 mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">No Orders Yet</h1>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            You haven&apos;t placed any orders yet. Start shopping to see your order history here!
                        </p>
                        <Link
                            href="/products"
                            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
                    <p className="text-gray-600 mt-2">View your recent purchases and order status</p>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Order Header */}
                            <div className="border-b border-gray-200 p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                <span className="mr-1">{getStatusIcon(order.status)}</span>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            Placed on {new Date(order.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                                        <p className="text-gray-600 text-sm">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Items</h4>
                                <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between py-2">
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded flex items-center justify-center flex-shrink-0">
                                                    <span className="text-sm">📦</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-medium text-gray-900 text-right">
                                                ${(item.product.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Footer */}
                            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="text-sm text-gray-600">
                                        <p className="font-medium">Shipping Address</p>
                                        <p>
                                            {order.shippingAddress.firstName} {order.shippingAddress.lastName}, {order.shippingAddress.city}
                                        </p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                            View Details
                                        </button>
                                        <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                                            Track Order
                                        </button>
                                        <button className="text-gray-600 hover:text-gray-700 font-medium text-sm">
                                            Reorder
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                <div className="mt-8 text-center">
                    <button className="bg-white text-gray-700 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        Load More Orders
                    </button>
                </div>
            </div>
        </div>
    );
}