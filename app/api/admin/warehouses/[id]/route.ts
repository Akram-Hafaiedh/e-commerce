import { requireAdmin } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const { id } = await params;

        const warehouse = await prisma.warehouse.findUnique({
            where: { id },
            include: {
                inventory: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                image: true,
                                price: true,
                            }
                        }
                    }
                },
                OrderItem: true,
            }
        });

        if (!warehouse) {
            return NextResponse.json(
                { error: 'Warehouse not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: 'Warehouse fetched successfully',
                warehouse
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching warehouse:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const { id } = await params;
        const body = await request.json();
        const { name, code, address, city, country, postalCode, type, isActive } = body;

        // Check if warehouse exists
        const warehouse = await prisma.warehouse.findUnique({
            where: { id }
        });

        if (!warehouse) {
            return NextResponse.json(
                { error: 'Warehouse not found' },
                { status: 404 }
            );
        }

        // Validation
        if (!name || !code || !address || !city || !country || !postalCode || !type) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if new code already exists (and it's not the same warehouse)
        if (code !== warehouse.code) {
            const existingWarehouse = await prisma.warehouse.findUnique({
                where: { code }
            });

            if (existingWarehouse) {
                return NextResponse.json(
                    { error: 'Warehouse code already exists' },
                    { status: 400 }
                );
            }
        }

        // Validate warehouse type
        const validTypes = ['MAIN', 'REGIONAL', 'STORE', 'VIRTUAL'];
        if (!validTypes.includes(type)) {
            return NextResponse.json(
                { error: 'Invalid warehouse type' },
                { status: 400 }
            );
        }

        const updatedWarehouse = await prisma.warehouse.update({
            where: { id },
            data: {
                name,
                code,
                address,
                city,
                country,
                postalCode,
                type,
                isActive: isActive !== undefined ? isActive : warehouse.isActive,
            },
            select: {
                id: true,
                name: true,
                code: true,
                address: true,
                city: true,
                country: true,
                postalCode: true,
                type: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return NextResponse.json(
            {
                message: 'Warehouse updated successfully',
                warehouse: updatedWarehouse
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating warehouse:', error);
        return NextResponse.json(
            { error: 'Error updating warehouse' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const { id } = await params;

        // Check if warehouse exists
        const warehouse = await prisma.warehouse.findUnique({
            where: { id }
        });

        if (!warehouse) {
            return NextResponse.json(
                { error: 'Warehouse not found' },
                { status: 404 }
            );
        }

        // Check if warehouse has inventory items
        const inventoryCount = await prisma.inventory.count({
            where: { warehouseId: id }
        });

        if (inventoryCount > 0) {
            return NextResponse.json(
                { error: 'Cannot delete warehouse with inventory items. Please clear inventory first.' },
                { status: 400 }
            );
        }

        // Check if warehouse has orders
        const orderCount = await prisma.orderItem.count({
            where: { warehouseId: id }
        });

        if (orderCount > 0) {
            return NextResponse.json(
                { error: 'Cannot delete warehouse with order items. Please archive instead.' },
                { status: 400 }
            );
        }

        await prisma.warehouse.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Warehouse deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting warehouse:', error);
        return NextResponse.json(
            { error: 'Error deleting warehouse' },
            { status: 500 }
        );
    }
}