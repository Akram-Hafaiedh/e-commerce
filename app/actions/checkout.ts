'use server'


import { prisma } from '@/lib/prisma'
import { z, ZodError } from 'zod'
import { revalidateTag } from 'next/cache';
import { checkStockAvailability, confirmSale, releaseReservation, reserveStock } from '@/lib/stock';

const checkoutSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    address: z.string().min(5),
    city: z.string().min(2),
    zipCode: z.string().min(3),
    country: z.string().min(2),
    cardNumber: z.string().length(16),
    cardName: z.string().min(3),
    expiryDate: z.string().regex(/^\d{2}\/\d{2}$/),
    cvv: z.string().length(3),
})

interface CheckoutData {
    email: string
    firstName: string
    lastName: string
    address: string
    city: string
    zipCode: string
    country: string
    cardNumber: string
    cardName: string
    expiryDate: string
    cvv: string
    cartItems: Array<{
        product: { id: string; name: string; price: number }
        quantity: number
    }>
    subtotal: number
    shippingCost: number
    tax: number
    total: number
}

interface CheckoutResult {
    success: boolean
    orderId?: string
    orderNumber?: string
    error?: string
    errors?: Array<{ path: string[]; message: string }>
}

export async function processCheckout(data: CheckoutData): Promise<CheckoutResult> {
    try {
        // 1. Validate
        const validated = checkoutSchema.parse(data)

        // 2. Check stock availability FIRST
        const stockCheck = await checkStockAvailability(
            data.cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity
            }))
        )

        if (!stockCheck.available) {
            return { success: false, error: `Not enough stock for ${stockCheck.outOfStock?.join(', ')}` }
        }

        // 3. Generate order number
        const orderNumber = await generateOrderNumber()

        // 4. Create order with PENDING status
        const order = await prisma.order.create({
            data: {
                orderNumber,
                email: validated.email,

                // Status tracking
                status: 'PENDING',
                paymentStatus: 'PENDING',

                // Pricing breakdown
                subtotal: data.subtotal,
                shippingCost: data.shippingCost,
                tax: data.tax,
                discount: 0,
                total: data.total,

                // Shipping info
                shippingFirstName: validated.firstName,
                shippingLastName: validated.lastName,
                shippingAddress: validated.address,
                shippingCity: validated.city,
                shippingZipCode: validated.zipCode,
                shippingCountry: validated.country,

                // Payment info (masked)
                paymentMethod: 'card',
                paymentCardEnding: validated.cardNumber.slice(-4),
                paymentExpiryDate: validated.expiryDate,

                // Order items
                items: {
                    create: data.cartItems.map(item => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                        price: item.product.price,
                        productName: item.product.name,
                    }))
                }
            }
        })

        // 5. Reserve stock for each item
        const reservations = await Promise.all(
            data.cartItems.map(item =>
                reserveStock(item.product.id, item.quantity, order.id)
            )
        )

        if (reservations.some(r => !r)) {
            // If any reservation fails, delete order
            await prisma.order.delete({ where: { id: order.id } })
            return {
                success: false,
                error: 'Failed to reserve stock. Some items may have sold out.'
            }
        }


        // 6. Process payment
        const paymentResult = await processPayment({
            amount: data.total,
            orderId: order.id,
            cardNumber: validated.cardNumber,
        })

        if (!paymentResult.success) {
            // Payment failed - release reservations and delete order

            await Promise.all([
                ...data.cartItems.map(item =>
                    releaseReservation(item.product.id, item.quantity, order.id)
                ),
                prisma.order.delete({ where: { id: order.id } })
            ])

            return {
                success: false,
                error: 'Payment failed. Please check your card details and try again.'
            }
        }

        // 7. Payment successful - confirm sales
        await Promise.all([
            // Update order status
            prisma.order.update({
                where: { id: order.id },
                data: {
                    status: 'PROCESSING',
                    paymentStatus: 'PAID',
                    paymentId: paymentResult.paymentId,
                    paidAt: new Date()
                }
            }),

            // Confirm all sales (convert reservations to actual sales)
            ...data.cartItems.map(item =>
                confirmSale(item.product.id, item.quantity, order.id)
            )
        ])

        // 8. Revalidate cache
        revalidateTag('orders', {})
        revalidateTag('products', {}) // Stock changed

        return {
            success: true,
            orderId: order.id,
            orderNumber: order.orderNumber
        }

    } catch (error) {
        console.error('Checkout error:', error)

        if (error instanceof ZodError) {
            return {
                success: false,
                error: 'Invalid form data',
                errors: error.issues.map((issue) => ({
                    path: issue.path.map(String),
                    message: issue.message
                }))
            }
        }

        return {
            success: false,
            error: 'An unexpected error occurred'
        }
    }
}

async function generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.order.count({
        where: {
            orderNumber: { startsWith: `ORD-${year}-` }
        }
    })

    return `ORD-${year}-${String(count + 1).padStart(6, '0')}`;
}

interface PaymentResult {
    success: boolean
    paymentId?: string
}

async function processPayment(data: { amount: number, orderId: string, cardNumber: string }): Promise<PaymentResult> {
    // Simulate payment processing

    console.log('Processing payment for order', data.orderId, 'with card number', data.cardNumber)

    await new Promise(resolve => setTimeout(resolve, 2000))

    if (Math.random() < 0.05) {
        return { success: false }
    }

    return {
        success: true,
        paymentId: `pay_${Math.random().toString(36).substr(2, 9)}`
    }
}