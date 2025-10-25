import { requireAdmin } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const warehouses = await prisma.warehouse.findMany({
            orderBy: {
                createdAt: 'desc'
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
                message: 'Warehouses fetched successfully',
                warehouses
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching warehouses:', error);
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
        const { name, code, address, city, country, postalCode, type, isActive } = body;

        // Validation
        if (!name || !code || !address || !city || !country || !postalCode || !type) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if warehouse code already exists
        const existingWarehouse = await prisma.warehouse.findUnique({
            where: { code }
        });

        if (existingWarehouse) {
            return NextResponse.json(
                { error: 'Warehouse code already exists' },
                { status: 400 }
            );
        }

        // Validate warehouse type
        const validTypes = ['MAIN', 'REGIONAL', 'STORE', 'VIRTUAL'];
        if (!validTypes.includes(type)) {
            return NextResponse.json(
                { error: 'Invalid warehouse type' },
                { status: 400 }
            );
        }

        const newWarehouse = await prisma.warehouse.create({
            data: {
                name,
                code,
                address,
                city,
                country,
                postalCode,
                type,
                isActive: isActive !== undefined ? isActive : true,
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
                message: 'Warehouse created successfully',
                warehouse: newWarehouse
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating warehouse:', error);
        return NextResponse.json(
            { error: 'Error creating warehouse' },
            { status: 500 }
        );
    }
}