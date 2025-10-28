import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const all = searchParams.get('all');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');

        const flatten = searchParams.get('flatten');
        const parent = searchParams.get('parent');
        const featured = searchParams.get('featured');

        const skip = (page - 1) * limit;

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
        if (all === 'true') {
            const whereForAll: Prisma.CategoryWhereInput = {};

            if (featured === 'true') {
                whereForAll.featured = true;
            }

            const categories = await prisma.category.findMany({
                where: whereForAll,
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

            // Only flatten if explicitly requested
            if (flatten === 'true') {
                const flattenedCategories = categories.flatMap(category => [
                    {
                        ...category,
                        isParent: true,
                        children: undefined // Remove children from flattened items
                    },
                    ...category.children.map(child => ({
                        ...child,
                        isParent: false,
                        parentName: category.name,
                        parentSlug: category.slug,
                        _count: { products: 0, children: 0 } // Add empty _count for consistency
                    }))
                ]);

                return NextResponse.json({
                    categories: flattenedCategories
                });
            }

            return NextResponse.json({
                categories
            });
        }

        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                where,
                include: {
                    children: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            description: true,
                            image: true,
                            featured: true,
                        },
                    },
                    _count: {
                        select: {
                            products: true,
                            children: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: {
                    name: "asc",
                },
            }),
            prisma.category.count({ where }),
        ]);

        return NextResponse.json({
            categories,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Error fetching categories' },
            { status: 500 }
        );
    }
}