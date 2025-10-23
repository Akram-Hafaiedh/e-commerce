import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET( request: NextRequest,{ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                products: {
                    where: { stock: { gt: 0 } },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            { error: 'Error fetching category' },
            { status: 500 }
        );
    }
}