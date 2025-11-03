//app/context/CartContext.tsx

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
    const [pendingToasts, setPendingToasts] = useState<Array<{ message: string; type: 'success' | 'error' | 'info' }>>([]);
    const saveTimeoutRef = useRef<NodeJS.Timeout>(null);

    // Process pending toasts after render
    useEffect(() => {
        if (pendingToasts.length > 0) {
            const nextToast = pendingToasts[0];
            showToast(nextToast.message, nextToast.type);
            setPendingToasts(prev => prev.slice(1));
        }
    }, [pendingToasts, showToast]);

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
            setPendingToasts(prev => [...prev, { message: `${product.name} is out of stock`, type: 'error' }]);
            return;
        }

        if (quantity <= 0) {
            setPendingToasts(prev => [...prev, { message: 'Quantity must be at least 1', type: 'error' }]);
            return;
        }

        setItems(prevItems => {
            // console.log('Current items in state:', prevItems);
            const existingItem = prevItems.find(item => item.product.id === product.id);
            const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

            // console.log('New quantity would be:', newQuantity, 'Stock:', product.stock);

            if (newQuantity > product.stock) {
                setPendingToasts(prev => [...prev, { message: `Only ${product.stock} items available in stock`, type: 'error' }]);
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
            setPendingToasts(prev => [...prev, { message: `${product.name} added to cart`, type: 'success' }]);
            return updatedItems;
        });

    }, []);

    const removeFromCart = useCallback((productId: string) => {
        setItems(prevItems => {
            const itemToRemove = prevItems.find(item => item.product.id === productId);
            if (itemToRemove) {
                setPendingToasts(prev => [...prev, { message: `${itemToRemove.product.name} removed from cart`, type: 'info' }]);
            }
            return prevItems.filter(item => item.product.id !== productId);
        });
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setItems(prevItems => {
            const itemToUpdate = prevItems.find(item => item.product.id === productId);
            if (!itemToUpdate) return prevItems;

            if (quantity > itemToUpdate.product.stock) {
                setPendingToasts(prev => [...prev, { message: `Only ${itemToUpdate.product.stock} items available in stock`, type: 'error' }]);
                return prevItems;
            }

            return prevItems.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            );
        });
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setItems([]);
        setPendingToasts(prev => [...prev, { message: 'Cart cleared', type: 'info' }]);
    }, []);

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
            setPendingToasts(prev => [...prev, { message: 'Order placed successfully!', type: 'success' }]);

            return newOrder;
        } catch (error) {
            console.error('Error creating order:', error);
            setPendingToasts(prev => [...prev, { message: 'Failed to place order', type: 'error' }]);
        }
    }, [clearCart]);

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