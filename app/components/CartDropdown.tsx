'use client';
import { useCart } from "../context/CartContext";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CartDropdownProps, CartItem } from "@/types/cart";
import Image from "next/image";

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
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
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
        <>
            {/* Backdrop - rely on document listener for closing */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />
            {/* Cart Dropdown */}
            <div
                ref={dropdownRef}
                className={`fixed right-4 top-20 w-96 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 transition-all duration-300 ${isOpen
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
                    }`}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Your Cart ({getTotalItems()})
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {getTotalItems() === 1 ? '1 item' : `${getTotalItems()} items`}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-sm hover:shadow-md"
                            aria-label="Close cart"
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                {/* Cart Content */}
                <div className="max-h-96 overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="text-center py-12 px-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h4>
                            <p className="text-gray-500 text-sm mb-6">Add some items to get started</p>
                            <button
                                onClick={handleClose}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all font-medium hover:shadow-lg"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 space-y-3">
                            {items.map((item: CartItem) => (
                                <div key={item.product.id} className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 transition-all group">
                                    {/* Product Image */}
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                        {item.product.image ? (
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                width={64}
                                                height={64}
                                                className="rounded-lg object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl">📦</span>
                                        )}
                                    </div>
                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 text-sm truncate mb-1">
                                            {item.product.name}
                                        </h4>
                                        <p className="text-blue-600 font-bold text-sm">
                                            ${item.product.price}
                                        </p>
                                    </div>
                                    {/* Quantity Controls */}
                                    <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                                        <button
                                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                            className="w-7 h-7 flex items-center justify-center bg-white rounded-md hover:bg-gray-100 transition-colors shadow-sm"
                                            aria-label="Decrease quantity"
                                        >
                                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span className="text-sm font-bold text-gray-900 w-6 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                            disabled={item.quantity >= item.product.stock}
                                            className="w-7 h-7 flex items-center justify-center bg-white rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
                                            aria-label="Increase quantity"
                                        >
                                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromCart(item.product.id)}
                                        className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors group/remove"
                                        aria-label="Remove item"
                                    >
                                        <svg className="w-4 h-4 group-hover/remove:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl">
                        {/* Total */}
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600 font-medium">Subtotal:</span>
                            <span className="text-2xl font-bold text-gray-900">
                                ${getTotalPrice().toFixed(2)}
                            </span>
                        </div>
                        {/* Actions */}
                        <div className="space-y-3">
                            <Link
                                href="/cart"
                                onClick={handleClose}
                                className="block w-full bg-white text-gray-900 text-center py-3 px-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all font-semibold"
                            >
                                View Full Cart
                            </Link>
                            <Link
                                href="/checkout"
                                onClick={handleClose}
                                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 px-4 rounded-xl hover:shadow-lg transition-all font-semibold hover:scale-[1.02]"
                            >
                                Checkout Now
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}