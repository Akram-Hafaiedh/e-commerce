import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
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