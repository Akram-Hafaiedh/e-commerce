import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

    try {
        const category = await prisma.category.findUnique({
            where: { id: params.id },
            include: {
                products: {

                    where: { stock: { gt: 0 } },
                    orderBy: { createdAt: 'desc' }
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, image, featured, slug } = body;

        const existingCategory = await prisma.category.findUnique({ where: { id: params.id } });
        if (!existingCategory) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }
        if (slug !== existingCategory.slug) {
            const slugExists = await prisma.category.findUnique({ where: { slug } });
            if (slugExists) {
                return NextResponse.json({ error: 'Category with this slug already exists' }, { status: 400 });
            }
        }

        const updatedCategory = await prisma.category.update({
            where: { id: params.id },
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
            { message: 'Category updated successfully', updatedCategory },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({ error: 'Error updating category' }, { status: 500 });
    }
}


export async function DELETE(request:NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const existingCategory = await prisma.category.findUnique({ where: { id: params.id } });
        if (!existingCategory) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }
        const categoryWithProducts  = await prisma.category.findUnique({
            where: { id: params.id },
            include: {
                products: {take: 1}
            }
        });

        if(categoryWithProducts && categoryWithProducts.products.length > 0){
            return NextResponse.json(
                { error: 'Cannot delete category with products. Please remove products first.' },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id: params.id } 
        });

        return NextResponse.json(
            { message: 'Category deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({
            error: 'Error deleting category' },
            { status: 500 }
        );
    }
}