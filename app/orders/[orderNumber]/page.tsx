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
        })

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
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'PROCESSING': return 'bg-blue-100 text-blue-800';
            case 'SHIPPED': return 'bg-purple-100 text-purple-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            case 'REFUNDED': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'FAILED': return 'bg-red-100 text-red-800';
            case 'REFUNDED': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Shopping
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                    <p className="text-gray-600 mt-2">
                        Order #{order.orderNumber}
                        <span className="text-sm text-gray-500 ml-2">
                            • Placed {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                        </span>
                    </p>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <p className="text-sm text-gray-600 mb-2">Order Status</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                        </span>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <p className="text-sm text-gray-600 mb-2">Order Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                        {item.product.image ? (
                                            <Image
                                                src={item.product.image}
                                                width={64} height={64}
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl">📦</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{item.productName}</h3>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                                    </div>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="space-y-2">
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
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-${order.discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipping & Payment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
                        <p className="text-gray-700">
                            {order.shippingFirstName} {order.shippingLastName}<br />
                            {order.shippingAddress}<br />
                            {order.shippingCity}, {order.shippingZipCode}<br />
                            {order.shippingCountry}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                        <p className="text-gray-700">
                            {order.paymentMethod === 'card' ? 'Credit Card' : order.paymentMethod}<br />
                            {order.paymentCardEnding && `•••• ${order.paymentCardEnding}`}<br />
                            {order.paidAt && (
                                <span className="text-sm text-gray-500">
                                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


export async function generateMetadata({
    params
}: {
    params: { orderNumber: string }
}) {
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
