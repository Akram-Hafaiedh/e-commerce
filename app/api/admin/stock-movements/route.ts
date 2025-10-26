import { requireAdmin } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { MovementType } from "@prisma/client";

export async function GET(request: NextRequest) {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const { searchParams } = new URL(request.url);
        const movementType = searchParams.get('movementType');
        const warehouseId = searchParams.get('warehouseId');
        const productId = searchParams.get('productId');

        const whereClause: Prisma.StockMovementWhereInput = {};

        if (movementType && movementType !== 'all') {
            whereClause.movementType = movementType as MovementType;
        }

        if (warehouseId && warehouseId !== 'all') {
            whereClause.warehouseId = warehouseId;
        }

        if (productId && productId !== 'all') {
            whereClause.productId = productId;
        }

        const movements = await prisma.stockMovement.findMany({
            where: whereClause,
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                warehouse: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 100
        });

        return NextResponse.json(
            {
                message: 'Stock movements fetched successfully',
                movements
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching stock movements:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const body = await request.json();
        const { productId, warehouseId, quantity, movementType, note, referenceId } = body;

        // Validation
        if (!productId || !warehouseId || quantity === undefined || !movementType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Check if warehouse exists
        const warehouse = await prisma.warehouse.findUnique({
            where: { id: warehouseId }
        });

        if (!warehouse) {
            return NextResponse.json(
                { error: 'Warehouse not found' },
                { status: 404 }
            );
        }

        // Validate movement type
        const validTypes = ['SALE', 'RETURN', 'RESTOCK', 'ADJUSTMENT', 'RESERVATION', 'RELEASE', 'TRANSFER_IN', 'TRANSFER_OUT', 'DAMAGED'];
        if (!validTypes.includes(movementType)) {
            return NextResponse.json(
                { error: 'Invalid movement type' },
                { status: 400 }
            );
        }

        // Start a transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            // Find or create inventory record
            let inventory = await tx.inventory.findUnique({
                where: {
                    productId_warehouseId: {
                        productId,
                        warehouseId,
                    }
                }
            });

            const currentQuantity = inventory?.quantity || 0;
            const newQuantity = currentQuantity + quantity;

            // Update or create inventory
            if (inventory) {
                inventory = await tx.inventory.update({
                    where: {
                        productId_warehouseId: {
                            productId,
                            warehouseId,
                        }
                    },
                    data: {
                        quantity: newQuantity,
                        lastUpdated: new Date(),
                    }
                });
            } else {
                inventory = await tx.inventory.create({
                    data: {
                        productId,
                        warehouseId,
                        quantity: newQuantity,
                        lastUpdated: new Date(),
                    }
                });
            }

            // Create stock movement record
            const stockMovement = await tx.stockMovement.create({
                data: {
                    productId,
                    warehouseId,
                    quantity,
                    stockAfter: newQuantity,
                    movementType,
                    referenceId: referenceId || null,
                    note: note || null,
                    createdBy: auth.session.user?.id || 'system',
                },
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    warehouse: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                        }
                    }
                }
            });

            return { inventory, stockMovement };
        });

        return NextResponse.json(
            {
                message: 'Stock movement recorded successfully',
                movement: result.stockMovement,
                inventory: result.inventory,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating stock movement:', error);
        return NextResponse.json(
            { error: 'Error creating stock movement' },
            { status: 500 }
        );
    }
}