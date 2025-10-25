import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                children: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        image: true,
                        featured: true
                    }
                },
                parent: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        image: true,
                        featured: true
                    }
                },
                products: {
                    include: {
                        Inventory: {
                            select: {
                                quantity: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        products: true,
                        children: true
                    }
                }
            }
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Category fetched successfully', category }, { status: 200 });

    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json({ error: 'Error fetching category' }, { status: 500 });
    }
}