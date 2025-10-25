import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const all = searchParams.get('all');
        const parent = searchParams.get('parent');
        const featured = searchParams.get('featured');


        const where: Prisma.CategoryWhereInput = {};

        if (parent) {
            const parentCategory = await prisma.category.findUnique({
                where: { slug: parent }
            });

            if (parentCategory) {
                where.parentId = parentCategory.id;
            } else {
                return NextResponse.json({ categories: [] });
            }
        } else {
            where.parentId = null;
        }

        if (featured === 'true') {
            where.featured = true;
        }
        const categories = await prisma.category.findMany({
            where,
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
                _count: {
                    select: {
                        products: true,
                        children: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
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