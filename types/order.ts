//types/order.ts
import { Order, OrderItem, OrderStatus, PaymentStatus, Product } from '@prisma/client';

// Order with items and product details
export type OrderWithItems = Order & {
    items: (OrderItem & {
        product: Pick<Product, 'id' | 'name' | 'image' | 'slug'>;
    })[];
};

// For API responses
export interface OrderVerifyRequest {
    orderNumber: string;
    email: string;
}

export interface OrderVerifyResponse {
    success: boolean;
    order?: OrderWithItems;
    error?: string;
}

// For order display
export interface OrderSummary {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    total: number;
    createdAt: Date;
    items: {
        product: {
            name: string
            image: string
        }
        quantity: number
        price: number
    }[]
    itemCount: number;
}

// Export Prisma enums for convenience
export { OrderStatus, PaymentStatus } from '@prisma/client';