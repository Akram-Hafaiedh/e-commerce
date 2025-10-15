'use client';

import { CartItem } from "@/types/cart";
import { CartContextType } from "@/lib/cart";
import { createContext, useContext, useEffect, useState } from "react";
import { Order } from "@/types/order";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: CartItem['product'], quantity: number = 1) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.product.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { product, quantity }];
            }
        });
    }

    const removeFromCart = (productId: string) => {
        setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setItems(prevItems =>
            prevItems.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    }

    const clearCart = () => {
        setItems([]);
    }

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }

    const [orders, setOrders] = useState<Order[]>([]);

    const addOrder = (orderData: Omit<Order, 'id'>) => {
        const newOrder: Order = {
            ...orderData,
            id: Math.random().toString(36).substr(2, 9),
        };
        setOrders(prev => [...prev, newOrder]);

        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');

        localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));
    };

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotalItems,
            getTotalPrice,
            orders,
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