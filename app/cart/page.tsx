'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { CartItem } from '@/types/cart';

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
                <div className="container mx-auto px-4">
                    {/* Main Empty State Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center relative overflow-hidden">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 -z-10"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-30 -z-10"></div>

                        {/* Animated Cart Icon */}
                        <div className="relative inline-block mb-6">
                            <div className="text-8xl animate-bounce">🛒</div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-4 border-white"></div>
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">
                            Looks like you haven&apos;t added any products yet. Discover amazing products waiting for you!
                        </p>

                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Start Shopping
                        </Link>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow">
                            <div className="text-4xl mb-3">🚚</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
                            <p className="text-gray-600 text-sm">On orders over $50</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow">
                            <div className="text-4xl mb-3">💳</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
                            <p className="text-gray-600 text-sm">100% secure checkout</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow">
                            <div className="text-4xl mb-3">↩️</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
                            <p className="text-gray-600 text-sm">30-day return policy</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
                    {/* Cart Items */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
                                <button
                                    onClick={clearCart}
                                    className="text-red-600 hover:text-red-700 active:text-red-800 transition-colors font-medium text-sm sm:text-base self-start sm:self-auto"
                                >
                                    Clear Cart
                                </button>
                            </div>

                            <div className="space-y-4">
                                {items.map((item: CartItem) => (
                                    <div key={item.product.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-4 flex-1">
                                            {/* Product Image */}
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <span className="text-xl">📦</span>
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{item.product.name}</h3>
                                                <p className="text-gray-600 text-sm">${item.product.price}</p>
                                                <p className="text-gray-500 text-xs sm:text-sm">{item.product.category}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-gray-500 active:bg-gray-200"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 sm:w-12 text-center font-medium text-gray-700 text-sm sm:text-base">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-gray-500 active:bg-gray-200"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Total Price */}
                                            <div className="text-right min-w-16 sm:min-w-20">
                                                <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeFromCart(item.product.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors p-2 active:bg-red-50 rounded"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-24">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm sm:text-base">
                                    <span className="text-gray-600">Items ({getTotalItems()})</span>
                                    <span className="text-gray-900">${getTotalPrice().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm sm:text-base">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-gray-900">$0.00</span>
                                </div>
                                <div className="flex justify-between text-sm sm:text-base">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-gray-900">${(getTotalPrice() * 0.1).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-base sm:text-lg font-bold">
                                        <span className="text-gray-900">Total</span>
                                        <span className="text-gray-900">${(getTotalPrice() * 1.1).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full bg-green-600 text-white py-3 sm:py-4 px-6 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors font-semibold text-base sm:text-lg mb-3 sm:mb-4 block text-center"
                            >
                                Proceed to Checkout
                            </Link>

                            <Link
                                href="/products"
                                className="w-full border-2 border-gray-300 text-gray-700 py-3 sm:py-4 px-6 rounded-lg hover:border-gray-400 active:bg-gray-50 transition-colors font-semibold text-base sm:text-lg block text-center"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}