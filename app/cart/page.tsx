'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { CartItem } from '@/types/cart';

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Looks like you haven&apos;t added any products to your cart yet. Start shopping to find amazing products!
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
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                                <button
                                    onClick={clearCart}
                                    className="text-red-600 hover:text-red-700 transition-colors font-medium"
                                >
                                    Clear Cart
                                </button>
                            </div>

                            <div className="space-y-4">
                                {items.map((item: CartItem) => (
                                    <div key={item.product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-xl">📦</span>
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
                                            <p className="text-gray-600 text-sm">${item.product.price}</p>
                                            <p className="text-gray-500 text-sm">{item.product.category}</p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-gray-500"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center font-medium text-gray-700">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-gray-500"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Total Price */}
                                        <div className="text-right min-w-20">
                                            <p className="font-semibold text-gray-900">
                                                ${(item.product.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.product.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors p-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Items ({getTotalItems()})</span>
                                    <span className="text-gray-900">${getTotalPrice().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-gray-900">$0.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-gray-900">${(getTotalPrice() * 0.1).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-gray-900">Total</span>
                                        <span className="text-gray-900">${(getTotalPrice() * 1.1).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg mb-4 block text-center"
                            >
                                Proceed to Checkout
                            </Link>

                            <Link
                                href="/products"
                                className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg hover:border-gray-400 transition-colors font-semibold text-lg block text-center"
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