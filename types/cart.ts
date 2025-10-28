import { Order } from "./order";
import { ProductWithStock } from "./product";

export interface CartItem {
    product: ProductWithStock;
    quantity: number;
}


export interface CartContextType {
    items: CartItem[];
    addToCart: (product: ProductWithStock, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    orders: Order[];
    addOrder: (order: Omit<Order, 'id'>) => void;
}


export interface CartDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}