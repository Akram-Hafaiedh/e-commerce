import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from 'date-fns';
import Image from "next/image";
import Link from "next/link";
import { OrderVerifyResponse } from "@/types/order";

async function getOrder(orderNumber: string): Promise<OrderVerifyResponse> {
    try {
        const order = await prisma.order.findUnique({
            where: { orderNumber },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                slug: true
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return {
                success: false,
                error: 'Order not found'
            };
        }

        return {
            success: true,
            order
        };
    } catch (error) {
        console.error('Failed to fetch order:', error);
        return {
            success: false,
            error: 'Failed to fetch order details'
        };
    }
}

export default async function OrderDetailsPage({ params }: { params: { orderNumber: string } }) {
    const result = await getOrder(params.orderNumber);

    if (!result.success) {
        notFound();
    }

    const order = result.order!;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
            case 'REFUNDED': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-800 border-green-200';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'FAILED': return 'bg-red-100 text-red-800 border-red-200';
            case 'REFUNDED': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'PARTIALLY_REFUNDED': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative container mx-auto px-4 py-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 mb-4"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Shopping
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                Order <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">Details</span>
                            </h1>
                            <p className="text-white/90 text-lg">
                                Order #{order.orderNumber}
                                <span className="text-white/70 text-sm ml-3">
                                    • Placed {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                                </span>
                            </p>
                        </div>

                        <div className="text-right">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                                <span className="text-sm font-medium">Order Tracking</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-gray-600">Order Status</p>
                        </div>
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-gray-600">Payment Status</p>
                        </div>
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                        </span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-gray-600">Order Date</p>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Order Items</h2>
                                <div className="h-px bg-gradient-to-r from-gray-300 to-transparent flex-1"></div>
                                <span className="text-gray-500 font-medium">
                                    {order.items.length} items
                                </span>
                            </div>

                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-300">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                                                {item.product.image ? (
                                                    <Image
                                                        src={item.product.image}
                                                        width={80}
                                                        height={80}
                                                        alt={item.productName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-3xl">📦</span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                                    {item.productName}
                                                </h3>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                                            </div>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${order.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>${order.shippingCost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span>${order.tax.toFixed(2)}</span>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className="flex justify-between text-green-600 font-semibold">
                                            <span>Discount</span>
                                            <span>-${order.discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                                        <span>Total</span>
                                        <span>${order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping & Payment Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
                            </div>
                            <div className="text-gray-700 space-y-2">
                                <p className="font-semibold">{order.shippingFirstName} {order.shippingLastName}</p>
                                <p>{order.shippingAddress}</p>
                                <p>{order.shippingCity}, {order.shippingZipCode}</p>
                                <p>{order.shippingCountry}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                            </div>
                            <div className="text-gray-700 space-y-2">
                                <p className="font-semibold capitalize">
                                    {order.paymentMethod === 'card' ? 'Credit Card' : order.paymentMethod}
                                </p>
                                {order.paymentCardEnding && (
                                    <p className="text-sm text-gray-600">•••• {order.paymentCardEnding}</p>
                                )}
                                {order.paidAt && (
                                    <p className="text-sm text-gray-500">
                                        Paid on {new Date(order.paidAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                Have questions about your order? Our support team is here to help.
                            </p>
                            <button className="w-full bg-white text-blue-600 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors font-semibold">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: { params: { orderNumber: string } }) {
    const result = await getOrder(params.orderNumber);

    if (!result.success || !result.order) {
        return {
            title: 'Order Not Found',
            description: 'The requested order could not be found'
        };
    }

    return {
        title: `Order ${params.orderNumber} - Order Details`,
        description: `View details for order ${params.orderNumber}`
    };
}