'use client';

import { CartContextType, CartItem } from "@/types/cart";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Order } from "@/types/order";
import { useToast } from "./ToastContext";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { showToast } = useToast();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout>(null);

    // Initialize cart from localStorage ONLY on client side
    useEffect(() => {
        try {
            if (typeof window === 'undefined') return;

            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                setItems(parsedCart);
                // console.log('Cart loaded from localStorage:', parsedCart);
            }
            setIsHydrated(true);
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            setIsHydrated(true);
        }
    }, []);

    // Save cart to localStorage with debouncing to prevent race conditions
    useEffect(() => {
        if (!isHydrated) return;

        // Clear any pending save
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Debounce the save by 300ms
        saveTimeoutRef.current = setTimeout(() => {
            try {
                localStorage.setItem('cart', JSON.stringify(items));
                // console.log('Cart saved to localStorage:', items);
            } catch (error) {
                console.error('Error saving cart to localStorage:', error);
            }
        }, 300);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [items, isHydrated]);

    const addToCart = useCallback((product: CartItem['product'], quantity: number = 1) => {
        // console.log('addToCart called:', { product: product.name, quantity, stock: product.stock });

        if (product.stock <= 0) {
            showToast(`${product.name} is out of stock`, 'error');
            return;
        }

        if (quantity <= 0) {
            showToast('Quantity must be at least 1', 'error');
            return;
        }

        setItems(prevItems => {
            // console.log('Current items in state:', prevItems);
            const existingItem = prevItems.find(item => item.product.id === product.id);
            const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

            // console.log('New quantity would be:', newQuantity, 'Stock:', product.stock);

            if (newQuantity > product.stock) {
                showToast(`Only ${product.stock} items available in stock`, 'error');
                return prevItems;
            }

            let updatedItems;
            if (existingItem) {
                updatedItems = prevItems.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                updatedItems = [...prevItems, { product, quantity }];
            }

            // console.log('Returning updated items:', updatedItems);
            return updatedItems;
        });

        showToast(`${product.name} added to cart`, 'success');
    }, [showToast]);

    const removeFromCart = useCallback((productId: string) => {
        setItems(prevItems => {
            const itemToRemove = prevItems.find(item => item.product.id === productId);
            if (itemToRemove) {
                showToast(`${itemToRemove.product.name} removed from cart`, 'info');
            }
            return prevItems.filter(item => item.product.id !== productId);
        });
    }, [showToast]);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setItems(prevItems => {
            const itemToUpdate = prevItems.find(item => item.product.id === productId);
            if (!itemToUpdate) return prevItems;

            if (quantity > itemToUpdate.product.stock) {
                showToast(`Only ${itemToUpdate.product.stock} items available in stock`, 'error');
                return prevItems;
            }

            return prevItems.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            );
        });
    }, [removeFromCart, showToast]);

    const clearCart = useCallback(() => {
        setItems([]);
        showToast('Cart cleared', 'info');
    }, [showToast]);

    const getTotalItems = useCallback(() => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }, [items]);

    const getTotalPrice = useCallback(() => {
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }, [items]);

    const addOrder = useCallback(async (orderData: Omit<Order, 'id'>) => {
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const newOrder = await response.json();
            clearCart();
            showToast('Order placed successfully!', 'success');

            return newOrder;
        } catch (error) {
            console.error('Error creating order:', error);
            showToast('Failed to place order', 'error');
        }
    }, [clearCart, showToast]);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotalItems,
            getTotalPrice,
            orders: [],
            addOrder,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context || context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}