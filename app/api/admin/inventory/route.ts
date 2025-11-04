import { requireAdmin } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const ITEMS_PER_PAGE = 10;

export async function GET(request: NextRequest) {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const { searchParams } = new URL(request.url);
        const warehouseId = searchParams.get('warehouseId');
        const productId = searchParams.get('productId');
        const search = searchParams.get('search');
        const pageParam = searchParams.get('page');
        const lowStock = searchParams.get('lowStock') === 'true';  // NEW: Optional filter for low stock

        const page = pageParam ? Math.max(1, parseInt(pageParam)) : 1;
        const skip = (page - 1) * ITEMS_PER_PAGE;

        const whereClause: Prisma.InventoryWhereInput = {};
        if (warehouseId && warehouseId !== 'all') {
            whereClause.warehouseId = warehouseId;
        }
        if (productId && productId !== 'all') {
            whereClause.productId = productId;
        }
        if (search) {
            whereClause.product = {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { slug: { contains: search, mode: 'insensitive' } }
                ]
            };
        }
        if (lowStock) {
            whereClause.available = { lt: prisma.inventory.fields.reorderPoint };  // Example: Filter low available
        }

        // Get total count for pagination metadata
        const totalCount = await prisma.inventory.count({
            where: whereClause
        });

        // Fetch paginated inventory with new fields
        const inventory = await prisma.inventory.findMany({
            where: whereClause,
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        image: true,
                        price: true,
                        stock: true,  // Cached stock from Product
                    }
                },
                warehouse: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        type: true,
                    }
                }
            },
            orderBy: {
                lastUpdated: 'desc'
            },
            skip,
            take: ITEMS_PER_PAGE
        });

        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

        return NextResponse.json(
            {
                message: 'Inventory fetched successfully',
                inventory,
                pagination: {
                    page,
                    pageSize: ITEMS_PER_PAGE,
                    totalCount,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}