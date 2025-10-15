import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";

export interface CartContextType {
    items: CartItem[];
    addToCart : (product: Product, quantity?: number) => void;
    removeFromCart : (productId: string) => void;
    updateQuantity : (productId: string, quantity: number) => void;
    clearCart : () => void;
    getTotalItems : () => number;
    getTotalPrice : () => number;
}