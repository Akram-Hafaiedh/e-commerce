// app/actions/inventory.ts

'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { Inventory, MovementType, Prisma } from "@prisma/client";
import { syncProductStock } from "@/lib/stock";
import { requireAdmin } from "@/lib/api-auth";
import { Product } from "@/types/product";
import { Warehouse } from "@/types/warehouse";

interface AdjustStockData {
    productId: string;
    warehouseId: string;
    quantity: number;
    movementType: MovementType;
    note?: string;
    referenceId?: string;
}

interface StockMovementWithRelations {
    id: string
    productId: string
    warehouseId: string
    quantity: number
    stockBefore: number
    stockAfter: number
    movementType: MovementType
    referenceId: string | null
    note: string | null
    createdBy: string
    createdAt: Date
    product: Pick<Product, 'id' | 'name'>
    warehouse: Pick<Warehouse, 'id' | 'name' | 'code'>
}

interface AdjustStockResult {
    success: boolean
    error?: string
    movement?: StockMovementWithRelations
}

/**
 * Adjust stock levels
 * Main action for admin stock management
 */
export async function adjustStock(data: AdjustStockData): Promise<AdjustStockResult> {
    try {
        await requireAdmin()

        const { productId, warehouseId, quantity, movementType, note, referenceId } = data

        // Validate inputs
        if (!productId || !warehouseId || quantity === undefined) {
            return {
                success: false,
                error: 'Missing required fields'
            }
        }

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId }
        })

        if (!product) {
            return {
                success: false,
                error: 'Product not found'
            }
        }

        // Check if warehouse exists
        const warehouse = await prisma.warehouse.findUnique({
            where: { id: warehouseId }
        })

        if (!warehouse) {
            return {
                success: false,
                error: 'Warehouse not found'
            }
        }

        // Execute stock adjustment in transaction
        const result = await prisma.$transaction(async (tx) => {
            const inventory = await tx.inventory.findUnique({
                where: {
                    productId_warehouseId: { productId, warehouseId },
                },
            })

            const curQty = inventory?.quantity ?? 0
            const curAvail = inventory?.available ?? 0
            const newQty = curQty + quantity
            const newAvail = curAvail + quantity

            // Prevent negative stock
            if (newQty < 0) {
                throw new Error(
                    `Cannot reduce stock below 0. Current: ${curQty}, Adjustment: ${quantity}`
                )
            }

            const updatedInv: Inventory = inventory
                ? await tx.inventory.update({
                    where: {
                        productId_warehouseId: { productId, warehouseId },
                    },
                    data: {
                        quantity: newQty,
                        available: newAvail,
                        lastUpdated: new Date(),
                    },
                })
                : await tx.inventory.create({
                    data: {
                        productId,
                        warehouseId,
                        quantity: Math.max(0, quantity),
                        available: Math.max(0, quantity),
                        reserved: 0,
                        lastUpdated: new Date(),
                    },
                })

            // Create stock movement record
            const movement = await tx.stockMovement.create({
                data: {
                    productId,
                    warehouseId,
                    quantity,
                    stockBefore: curQty,
                    stockAfter: newQty,
                    movementType,
                    referenceId: referenceId ?? null,
                    note: note ?? null,
                    createdBy: 'admin', // TODO: Get from session
                },
                include: {
                    product: { select: { id: true, name: true } },
                    warehouse: { select: { id: true, name: true, code: true } },
                },
            })

            return { inventory: updatedInv, stockMovement: movement }
        })

        // Sync product stock cache
        await syncProductStock(productId);

        // Revalidate relevant pages
        revalidatePath('/admin/inventory')
        revalidatePath('/admin/stock-movements')
        revalidateTag('products', {})
        revalidateTag('inventory', {})

        return {
            success: true,
            movement: result.stockMovement as StockMovementWithRelations
        }

    } catch (error) {
        console.error('Error adjusting stock:', error)
        const message =
            error instanceof Error ? error.message : 'Failed to adjust stock'
        return { success: false, error: message }
    }
}

interface InventoryWithRelations {
    id: string
    quantity: number
    reserved: number
    available: number
    reorderPoint: number | null  // ADDED
    lastUpdated: Date
    product: Pick<Product, 'id' | 'name' | 'price' | 'sku'>
    warehouse: Pick<Warehouse, 'id' | 'name' | 'code'>
}

interface GetInventoryResult {
    success: boolean
    inventory?: InventoryWithRelations | null
    error?: string
}

/**
 * Get inventory for a specific product and warehouse
 */
export async function getInventoryItem(productId: string, warehouseId: string): Promise<GetInventoryResult> {
    try {
        await requireAdmin()

        const inventory = await prisma.inventory.findUnique({
            where: { productId_warehouseId: { productId, warehouseId } },
            include: {
                product: { select: { id: true, name: true, price: true, sku: true } },
                warehouse: { select: { id: true, name: true, code: true } },
            },
        })

        return { success: true, inventory: inventory ?? null }

    } catch (error) {
        console.error('Error fetching inventory:', error)
        return { success: false, error: 'Failed to fetch inventory' }
    }
}

/**
 * Get all inventory items with pagination
 */
export async function getInventoryList(params: {
    page?: number
    limit?: number
    warehouseId?: string
    productId?: string
    search?: string
    lowStock?: boolean
}) {
    try {
        await requireAdmin()

        const page = params.page || 1
        const limit = params.limit || 12
        const skip = (page - 1) * limit

        const where: Prisma.InventoryWhereInput = {}

        // Warehouse filter
        if (params.warehouseId && params.warehouseId !== 'all') {
            where.warehouseId = params.warehouseId
        }

        // Product filter
        if (params.productId && params.productId !== 'all') {
            where.productId = params.productId
        }

        // Search filter
        if (params.search) {
            where.product = {
                OR: [
                    { name: { contains: params.search, mode: 'insensitive' } },
                    { sku: { contains: params.search, mode: 'insensitive' } },
                    { slug: { contains: params.search, mode: 'insensitive' } }
                ]
            }
        }

        // Low stock filter - FIXED
        if (params.lowStock) {
            where.AND = [
                {
                    reorderPoint: { not: null }
                },
                {
                    available: {
                        lte: prisma.inventory.fields.reorderPoint
                    }
                }
            ]
        }

        const [inventory, totalCount] = await Promise.all([
            prisma.inventory.findMany({
                where,
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            sku: true,
                            slug: true,
                            image: true,
                            stock: true  // ADDED for consistency with API
                        }
                    },
                    warehouse: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                            type: true  // ADDED for consistency with API
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: {
                    lastUpdated: 'desc'
                }
            }),
            prisma.inventory.count({ where })
        ])

        const totalPages = Math.ceil(totalCount / limit)

        return {
            success: true,
            inventory,
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                pageSize: limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        }

    } catch (error) {
        console.error('Error fetching inventory list:', error)
        return {
            success: false,
            error: 'Failed to fetch inventory',
            inventory: [],
            pagination: {
                totalCount: 0,
                totalPages: 0,
                currentPage: 1,
                pageSize: 12,
                hasNextPage: false,
                hasPreviousPage: false
            }
        }
    }
}

/**
 * Get low stock products
 */
export async function getLowStockProducts() {
    try {
        await requireAdmin()

        const lowStockProducts = await prisma.product.findMany({
            where: {
                isActive: true,
                stock: {
                    lte: prisma.product.fields.lowStockThreshold
                }
            },
            select: {
                id: true,
                name: true,
                sku: true,
                stock: true,
                lowStockThreshold: true
            },
            orderBy: {
                stock: 'asc'
            },
            take: 50
        })

        return {
            success: true,
            products: lowStockProducts
        }
    } catch (error) {
        console.error('Error fetching low stock products:', error)
        return {
            success: false,
            error: 'Failed to fetch low stock products',
            products: []
        }
    }
}

/**
 * Bulk stock import from CSV data
 */
export async function bulkImportStock(items: Array<{
    sku: string
    warehouseCode: string
    quantity: number
}>) {
    try {
        await requireAdmin()

        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[]
        }

        for (const item of items) {
            try {
                // Find product by SKU
                const product = await prisma.product.findUnique({
                    where: { sku: item.sku }
                })

                if (!product) {
                    results.failed++
                    results.errors.push(`Product not found: ${item.sku}`)
                    continue
                }

                // Find warehouse by code
                const warehouse = await prisma.warehouse.findUnique({
                    where: { code: item.warehouseCode }
                })

                if (!warehouse) {
                    results.failed++
                    results.errors.push(`Warehouse not found: ${item.warehouseCode}`)
                    continue
                }

                const result = await adjustStock({
                    productId: product.id,
                    warehouseId: warehouse.id,
                    quantity: item.quantity,
                    movementType: MovementType.RESTOCK,
                    note: 'Bulk import'
                })

                if (result.success) {
                    results.success++
                } else {
                    results.failed++
                    results.errors.push(`Failed ${item.sku}: ${result.error}`)
                }

            } catch (error) {
                results.failed++
                const msg = error instanceof Error ? error.message : String(error)
                results.errors.push(`Error ${item.sku}: ${msg}`)
            }
        }

        return {
            success: true,
            results
        }

    } catch (error) {
        console.error('Error in bulk import:', error)
        return {
            success: false,
            error: 'Bulk import failed'
        }
    }
}