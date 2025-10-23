// import { Order } from "@/types/order";

// export const mockOrders: Order[] = [
//     {
//         id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
//         date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
//         status: 'DELIVERED',
//         total: 1459.97,
//         items: [
//             {
//                 id: '1',
//                 product: {
//                     id: '4',
//                     name: 'Bluetooth Speaker',
//                     price: 99.99,
//                     originalPrice: undefined,
//                     category: 'electronics',
//                     categoryId: '1',
//                     slug: 'bluetooth-speaker',
//                     featured: false,
//                     onSale: false,
//                     rating: 4.4,
//                     reviewCount: 24,
//                     stock: 20,
//                     image: '/images/bluetooth-speaker.jpg',
//                     description: 'Portable Bluetooth speaker with deep bass',
//                     createdAt: new Date('2024-01-18').toISOString(),
//                     updatedAt: new Date('2024-01-18').toISOString()
//                 },
//                 quantity: 1,
//                 price: 99.99
//             },
//             {
//                 id: '2',
//                 product: {
//                     id: '3',
//                     name: '4K Smart TV',
//                     price: 1299.99,
//                     originalPrice: 1599.99,
//                     category: 'electronics',
//                     categoryId: '1',
//                     slug: '4k-smart-tv',
//                     featured: true,
//                     onSale: true,
//                     rating: 4.7,
//                     reviewCount: 32,
//                     stock: 5,
//                     image: '/images/smart-tv.jpg',
//                     description: 'Ultra HD Smart TV with vibrant colors and smart features',
//                     createdAt: new Date('2024-01-17').toISOString(),
//                     updatedAt: new Date('2024-01-17').toISOString()
//                 },
//                 quantity: 1,
//                 price: 1299.99
//             }
//         ],
//         shippingAddress: {
//             firstName: 'John',
//             lastName: 'Doe',
//             address: '123 Main St',
//             city: 'New York',
//             zipCode: '10001',
//             country: 'US'
//         },
//         paymentMethod: {
//             cardEnding: '4242',
//             expiryDate: '12/25'
//         },
//         userId: 'user-123',
//         createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
//         updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
//     },
//     {
//         id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
//         date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
//         status: 'DELIVERED',
//         total: 249.99,
//         items: [
//             {
//                 id: '3',
//                 product: {
//                     id: '6',
//                     name: 'Smartwatch',
//                     price: 249.99,
//                     originalPrice: undefined,
//                     category: 'electronics',
//                     categoryId: '1',
//                     slug: 'smartwatch',
//                     featured: false,
//                     onSale: false,
//                     rating: 4.2,
//                     reviewCount: 8,
//                     stock: 30,
//                     image: '/images/smartwatch.jpg',
//                     description: 'Track your fitness and receive notifications on your wrist',
//                     createdAt: new Date('2024-01-20').toISOString(),
//                     updatedAt: new Date('2024-01-20').toISOString()
//                 },
//                 quantity: 1,
//                 price: 249.99
//             }
//         ],
//         shippingAddress: {
//             firstName: 'John',
//             lastName: 'Doe',
//             address: '123 Main St',
//             city: 'New York',
//             zipCode: '10001',
//             country: 'US'
//         },
//         paymentMethod: {
//             cardEnding: '4242',
//             expiryDate: '12/25'
//         },
//         userId: 'user-123',
//         createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
//         updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
//     }
// ];