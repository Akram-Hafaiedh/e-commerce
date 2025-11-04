import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { OrderStatus, PaymentStatus } from '@/types/order'
import { getCurrentUser } from '@/lib/api-auth'
import { getOrders } from '../actions/profile'

export default async function OrdersPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/auth/login')
    }

    const orders = await getOrders(user.id)

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200'
            case 'PROCESSING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'SHIPPED': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'PENDING': return 'bg-gray-100 text-gray-800 border-gray-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getPaymentStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-800 border-green-200'
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'FAILED': return 'bg-red-100 text-red-800 border-red-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative container mx-auto px-4 py-16">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-4">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium">Order History</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            My <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">Orders</span>
                        </h1>
                        <p className="text-xl text-white/90 leading-relaxed">
                            Track your orders, view order details, and manage your purchases.
                        </p>
                    </div>
                </div>
            </section>

            {/* Orders Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {orders.length === 0 ? (
                            <div className="text-center bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h3>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    You haven&apos;t placed any orders yet. Start shopping to see your order history here.
                                </p>
                                <Link
                                    href="/products"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold inline-block"
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                                        {/* Order Header */}
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">Order #{order.orderNumber}</h3>
                                                <p className="text-gray-600 text-sm mt-1">
                                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 mt-4 lg:mt-0">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getPaymentStatusColor(order.paymentStatus)}`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="border-t border-gray-200 pt-6">
                                            <div className="space-y-4">
                                                {order.items.map((item, index) => (
                                                    <div key={index} className="flex items-center justify-between py-3">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                                                                {item.product.image ? (
                                                                    <Image
                                                                        src={item.product.image}
                                                                        alt={item.product.name}
                                                                        width={64}
                                                                        height={64}
                                                                        className="object-cover"
                                                                    />
                                                                ) : (
                                                                    <span className="text-2xl">📦</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                                                                <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                                                                <p className="text-gray-600 text-sm">${item.price.toFixed(2)} each</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Order Footer */}
                                        <div className="border-t border-gray-200 pt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                            <div className="text-lg font-bold text-gray-900">
                                                Total: ${order.total.toFixed(2)}
                                            </div>
                                            <div className="flex gap-3 mt-4 lg:mt-0">
                                                <Link
                                                    href={`/orders/${order.orderNumber}`}
                                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                                >
                                                    View Details
                                                </Link>
                                                <Link
                                                    href={`/track-order?orderNumber=${order.orderNumber}`}
                                                    className="bg-white text-gray-900 border-2 border-gray-200 px-6 py-2 rounded-lg hover:border-gray-300 transition-colors font-semibold"
                                                >
                                                    Track Order
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}