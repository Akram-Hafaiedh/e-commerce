
import { requireAdmin } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }
        const categories = await prisma.category.findMany({
            include: {
                products: {
                    where: {
                        stock: { gt: 0 }
                    },
                    take: 4
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
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
        const { name, description, image, featured, slug } = body;

        const existingCategory = await prisma.category.findUnique({ where: { slug } });
        if (existingCategory) {
            return NextResponse.json(
                { error: 'Category with this slug already exists' },
                { status: 400 }
            );
        }

        const newCategory = await prisma.category.create({
            data: {
                name,
                description,
                image,
                featured,
                slug
            },
            include: {
                products: true
            }
        });

        return NextResponse.json(
            { message: 'Category created successfully', category: newCategory },
            { status: 201 }
        );
    } catch (error) {

        console.error('Error creating category:', error);
        return NextResponse.json(
            { error: 'Error creating category' },
            { status: 500 }
        );
    }
}
