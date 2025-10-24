import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                image: true,
                featured: true,
                createdAt: true,
                updatedAt: true,
                // Don't include products to reduce payload size
                _count: {
                    select: {
                        products: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({
            categories
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Error fetching categories' },
            { status: 500 }
        );
    }
}