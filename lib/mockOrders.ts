import { Order } from "@/types/order";

export const mockOrders: Order[] = [
    {
        id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'delivered',
        total: 1459.97,
        items: [
            {
                product: {
                    id: '1',
                    name: 'Bluetooth Speaker',
                    price: 99.99,
                    category: 'electronics',
                    slug: 'bluetooth-speaker',
                    featured: false,
                    onSale: false,
                    rating: 4.4,
                    reviewCount: 24,
                    stock: 20,
                    image: '/images/bluetooth-speaker.jpg',
                    description: 'Portable Bluetooth speaker with deep bass'
                },
                quantity: 1
            },
            {
                product: {
                    id: '2',
                    name: 'OK Smart TV',
                    price: 1299.99,
                    category: 'electronics',
                    slug: 'ok-smart-tv',
                    featured: true,
                    onSale: false,
                    rating: 4.9,
                    reviewCount: 78,
                    stock: 8,
                    image: '/images/ok-smart-tv.jpg',
                    description: 'Latest smart TV with advanced features'
                },
                quantity: 1
            }
        ],
        shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main St',
            city: 'New York',
            zipCode: '10001',
            country: 'US'
        },
        paymentMethod: {
          cardEnding: '4242',
          expiryDate: '12/25'
        }
    },
    {
        id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'delivered',
        total: 89.99,
        items: [
            {
                product: {
                    id: '4',
                    name: 'Wireless Earbuds',
                    price: 89.99,
                    category: 'electronics',
                    slug: 'wireless-earbuds',
                    featured: false,
                    onSale: false,
                    rating: 4.6,
                    reviewCount: 16,
                    stock: 12,
                    image: '/images/wireless-earbuds.jpg',
                    description: 'Wireless earbuds with noise cancellation'
                },
                quantity: 1
            }
        ],
        shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main St',
            city: 'New York',
            zipCode: '10001',
            country: 'US'
        },
        paymentMethod: {
            cardEnding: '4242',
            expiryDate: '12/25'
        }
    }
];