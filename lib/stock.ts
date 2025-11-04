//lib/stock.ts

import { prisma } from '@/lib/prisma'
import { MovementType } from '@prisma/client'

/**
 * Get real-time available stock across all warehouses
 * Use this for critical operations (checkout, reservations)
 */
export async function getAvailableStock(productId: string): Promise<number> {

    const result = await prisma.inventory.aggregate({
        where: { productId },
        _sum: { available: true }
    })

    return result._sum.available || 0

}

/**
 * Get total stock (including reserved)
 */

export async function getTotalStock(productId: string): Promise<number> {
    const result = await prisma.inventory.aggregate({
        where: { productId },
        _sum: { quantity: true }
    })

    return result._sum.quantity || 0
}



/**
 * Check if products are in stock
 * Returns which items are out of stock
 */
export async function checkStockAvailability(
    items: { productId: string, quantity: number }[]): Promise<{ available: boolean, outOfStock?: string[] }> {

    const outOfStock: string[] = [];

    for (const item of items) {
        const available = await getAvailableStock(item.productId)

        if (available < item.quantity) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
                select: { name: true }
            })
            outOfStock.push(product?.name || item.productId)
        }
    }

    return {
        available: outOfStock.length === 0,
        outOfStock: outOfStock.length > 0 ? outOfStock : undefined
    }
}


/**
 * Reserve stock for an order (doesn't decrease quantity yet)
 * Call this when order is created but not paid
 */
export async function reserveStock(productId: string, quantity: number, orderId: string): Promise<boolean> {

    try {

        // Find warehouse with enough available stock
        const warehouse = await prisma.inventory.findFirst({
            where: {
                productId,
                available: { gte: quantity }
            },
            orderBy: { available: 'desc' }
        })

        if (!warehouse) {
            return false // Not enough stock
        }

        // Reserve stock atomically
        await prisma.$transaction([
            // Update inventory
            prisma.inventory.update({
                where: { id: warehouse.id },
                data: {
                    reserved: { increment: quantity },
                    available: { decrement: quantity }
                }
            }),
            // Log movement
            prisma.stockMovement.create({
                data: {
                    productId,
                    warehouseId: warehouse.warehouseId,
                    quantity: -quantity,
                    stockBefore: warehouse.available,
                    stockAfter: warehouse.available - quantity,
                    movementType: MovementType.RESERVATION,
                    referenceId: orderId
                }
            })
        ])

        return true
    } catch (error) {
        console.log('Error reserving stock:', error)
        return false
    }
}

/**
 * Confirm sale - convert reservation to actual sale
 * Call this when payment is confirmed
 */
export async function confirmSale(productId: string, quantity: number, orderId: string): Promise<void> {
    const warehouse = await prisma.inventory.findFirst({
        where: {
            productId,
            reserved: { gte: quantity }
        }
    })

    if (!warehouse) {
        throw new Error('Not enough reserved stock')
    }

    await prisma.$transaction([
        // Update inventory - decrease quantity and reserved
        prisma.inventory.update({
            where: { id: warehouse.id },
            data: {
                reserved: { decrement: quantity },
                quantity: { decrement: quantity }
            }
        }),

        // Update product cache
        prisma.product.update({
            where: { id: productId },
            data: {
                stock: { decrement: quantity },
                soldCount: { increment: quantity }
            }
        }),

        // Log movement
        prisma.stockMovement.create({
            data: {
                productId,
                warehouseId: warehouse.warehouseId,
                quantity: -quantity,
                stockBefore: warehouse.quantity,
                stockAfter: warehouse.quantity - quantity,
                movementType: MovementType.SALE,
                referenceId: orderId
            }
        })
    ])
}

/**
 * Release reserved stock if order is cancelled
 */

export async function releaseReservation(productId: string, quantity: number, orderId: string): Promise<void> {
    const warehouse = await prisma.inventory.findFirst({
        where: {
            productId,
            reserved: { gte: quantity }
        }
    })


    if (!warehouse) {
        console.warn('No reservation found to release')
        return
    }

    await prisma.$transaction([
        // Release reservation
        prisma.inventory.update({
            where: { id: warehouse.id },
            data: {
                reserved: { decrement: quantity },
                available: { increment: quantity }
            }
        }),

        // Log movement
        prisma.stockMovement.create({
            data: {
                productId,
                warehouseId: warehouse.warehouseId,
                quantity: quantity,
                stockBefore: warehouse.available,
                stockAfter: warehouse.available + quantity,
                movementType: MovementType.RELEASE,
                referenceId: orderId
            }
        })
    ])
}

/**
 * Direct sale without reservation (for immediate payment)
 */
export async function directSale(productId: string, quantity: number, orderId: string): Promise<boolean> {
    try {

        const warehouse = await prisma.inventory.findFirst({
            where: {
                productId,
                available: { gte: quantity }
            },
            orderBy: { available: 'desc' }
        })

        if (!warehouse) {
            return false // Not enough stock
        }

        await prisma.$transaction([
            // Update inventory
            prisma.inventory.update({
                where: { id: warehouse.id },
                data: {
                    quantity: { decrement: quantity },
                    available: { decrement: quantity }
                }
            }),

            // Update product cache
            prisma.product.update({
                where: { id: productId },
                data: {
                    stock: { decrement: quantity },
                    soldCount: { increment: quantity }
                }
            }),

            // Log movement
            prisma.stockMovement.create({
                data: {
                    productId,
                    warehouseId: warehouse.warehouseId,
                    quantity: -quantity,
                    stockBefore: warehouse.available,
                    stockAfter: warehouse.available - quantity,
                    movementType: MovementType.SALE,
                    referenceId: orderId
                }
            })
        ])

        return true

    } catch (error) {
        console.log('Error reserving stock:', error)
        return false
    }
}

/**
 * Sync product stock cache from inventory
 * Run this periodically or after batch operations
 */
export async function syncProductStock(productId: string): Promise<void> {

    const total = await getTotalStock(productId)

    await prisma.product.update({
        where: { id: productId },
        data: { stock: total }
    })
}

export async function getLowStockProducts(): Promise<{ id: string, name: string, stock: number, threshold: number }[]> {
    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            stock: {
                lte: prisma.product.fields.lowStockThreshold
            }
        },
        select: {
            id: true,
            name: true,
            stock: true,
            lowStockThreshold: true
        },
        orderBy: { stock: 'asc' }
    })

    return products.map(p => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        threshold: p.lowStockThreshold
    }))
}