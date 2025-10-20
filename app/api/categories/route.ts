import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                products: true
            }
        })
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


