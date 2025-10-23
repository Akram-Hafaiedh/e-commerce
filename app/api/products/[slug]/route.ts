import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                category: true
            }
        });

        if (!product) {
            return NextResponse.json(({ error: 'Product not found' }), { status: 404 });
        }

        return NextResponse.json({ message: 'Product fetched successfully', product }, { status: 200 });

    } catch (error) {
        console.error('Error fetching product by slug:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}