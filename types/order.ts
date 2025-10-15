import { CartItem } from "./cart";

export interface Order {
    id: string;
    date: string;
    status: 'delivered' | 'processing' | 'shipped' | 'cancelled';
    items: CartItem[];
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
}
