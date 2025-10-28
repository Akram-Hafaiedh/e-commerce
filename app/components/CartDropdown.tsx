'use client';

import { useCart } from "../context/CartContext";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CartDropdownProps, CartItem } from "@/types/cart";

export default function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
    const { items, getTotalPrice, getTotalItems, removeFromCart, updateQuantity } = useCart();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClose = useCallback(() => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 200);
    }, [onClose]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                handleClose();
            }
        }

        function handleEscapeKey(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                handleClose();
            }
        }

        if (isOpen) {
            setIsAnimating(true);
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, handleClose]);



    const handleQuantityChange = (item: CartItem, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(item.product.id);
        } else {
            updateQuantity(item.product.id, newQuantity);
        }
    };

    if (!isOpen && !isAnimating) return null;

    return (
        <div
            ref={dropdownRef}
            className={`absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-200 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                }`}
        >
            <div className="p-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Shopping Cart ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close cart"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                {items.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-2">🛒</div>
                        <p className="text-gray-500">Your cart is empty</p>
                        <button
                            onClick={handleClose}
                            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
                            {items.map((item: CartItem) => (
                                <div key={item.product.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                                    {/* Product Image */}
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm">📦</span>
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 text-sm truncate">
                                            {item.product.name}
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            ${item.product.price}
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                                            aria-label="Decrease quantity"
                                        >
                                            -
                                        </button>
                                        <span className="text-sm font-medium w-6 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                            disabled={item.quantity >= item.product.stock}
                                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromCart(item.product.id)}
                                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                                        aria-label="Remove item"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="border-t border-gray-200 pt-3 mb-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-semibold text-gray-900">
                                    ${getTotalPrice().toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            <Link
                                href="/cart"
                                onClick={handleClose}
                                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                View Cart
                            </Link>
                            <Link
                                href="/checkout"
                                onClick={handleClose}
                                className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Checkout
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}