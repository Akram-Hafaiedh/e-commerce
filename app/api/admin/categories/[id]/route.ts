import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { put } from '@vercel/blob';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const { id } = await params;
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                products: {
                    where: {
                        Inventory: {
                            some: {
                                quantity: { gt: 0 } // Only products with total stock > 0
                            }
                        }
                    },
                    include: {
                        Inventory: {
                            select: {
                                quantity: true // Only fetch quantity for summing
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                parent: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                },
                children: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                }
            }
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        const categoryWithStock = {
            ...category,
            products: category.products.map(product => ({
                ...product,
                stock: product.Inventory.reduce((sum, inv) => sum + inv.quantity, 0),
            }))
        };

        return NextResponse.json({ message: 'Category fetched successfully', categoryWithStock }, { status: 200 });
    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const { id } = await params;

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const featured = formData.get('featured') === 'true';
        const slug = formData.get('slug') as string;
        const parentId = formData.get('parentId') as string;

        if (!name || !description || !slug) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        let imageUrl: string;
        const imageFile = formData.get('image') as File | null;
        const imageUrlFromForm = formData.get('imageUrl') as string | null;


        if (imageFile && !imageFile.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Invalid file type. Only images are allowed.' },
                { status: 400 }
            );
        }
        if (imageFile && imageFile.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File size exceeds 5MB limit.' },
                { status: 400 }
            );
        }

        // Check if category exists
        const existingCategory = await prisma.category.findUnique({
            where: { id }
        });

        if (!existingCategory) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        // Check if new slug conflicts with other categories
        if (slug !== existingCategory.slug) {
            const slugExists = await prisma.category.findUnique({
                where: { slug }
            });

            if (slugExists) {
                return NextResponse.json(
                    { error: 'Category with this slug already exists' },
                    { status: 400 }
                );
            }
        }

        if (parentId === id) {
            return NextResponse.json(
                { error: 'Category cannot be its own parent' },
                { status: 400 }
            );
        }

        // Validate parent category exists if provided
        if (parentId) {
            const parentCategory = await prisma.category.findUnique({
                where: { id: parentId }
            });
            if (!parentCategory) {
                return NextResponse.json(
                    { error: 'Parent category not found' },
                    { status: 400 }
                );
            }
        }

        if (imageFile && imageFile.size > 0) {
            const timestamp = Date.now();
            const fileExtension = imageFile.name.split('.').pop();
            const fileName = `categories/${slug}-${timestamp}.${fileExtension}`;
            const blob = await put(fileName, imageFile, {
                access: 'public',
                addRandomSuffix: false,
            });
            imageUrl = blob.url;
        } else if (imageUrlFromForm) {
            imageUrl = imageUrlFromForm;
        } else {
            imageUrl = existingCategory.image;
        }

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {
                name,
                description,
                image: imageUrl,
                featured,
                slug,
                parentId: parentId || null,
            },
            include: {
                products: true,
                parent: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                },
                children: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                }
            }
        });

        return NextResponse.json(
            { message: 'Category updated successfully', updatedCategory },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const { id } = await params;
        // Check if category exists
        const existingCategory = await prisma.category.findUnique({
            where: { id }
        });

        if (!existingCategory) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        // Check if category has products
        const categoryWithProducts = await prisma.category.findUnique({
            where: { id },
            include: {
                products: {
                    take: 1
                },
                children: {
                    take: 1
                }
            }
        });

        if (categoryWithProducts && categoryWithProducts.products.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category with products. Please remove products first.' },
                { status: 400 }
            );
        }
        if (categoryWithProducts && categoryWithProducts.children.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete category with subcategories. Please remove subcategories first.' },
                { status: 400 }
            );
        }


        await prisma.category.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}