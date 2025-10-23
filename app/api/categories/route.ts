import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const all = searchParams.get('all');

        if (all === 'true') {
            const categories = await prisma.category.findMany({
                orderBy: { name: 'asc' }
            });

            return NextResponse.json(categories);
        }

        // Regular response with products included
        const categories = await prisma.category.findMany({
            include: {
                products: true
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(
            { message: 'Categories fetched successfully', categories },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Error fetching categories' },
            { status: 500 }
        );
    }
}