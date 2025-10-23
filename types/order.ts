import { User } from "./auth";
import { Product } from "./product";

export interface OrderItem {
    id: string;
    product: Product;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    date: string;
    status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    items: OrderItem[];
    total: number;
    shippingAddress: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        zipCode: string;
        country: string;
    };
    paymentMethod: {
        cardEnding: string;
        expiryDate: string;
    };
    userId?: string | null;
    guestEmail?: string | null;
    User?: User | null;
    orderNumber: string;
    createdAt: string;
    updatedAt: string;
}
