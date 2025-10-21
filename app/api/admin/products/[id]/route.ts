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
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true
            }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product fetched successfully', product }, { status: 200 });
    } catch (error) {
        console.error('Error fetching product:', error);
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
        // Extract form fields
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = parseFloat(formData.get('price') as string);
        const originalPrice = formData.get('originalPrice')
            ? parseFloat(formData.get('originalPrice') as string)
            : undefined;
        const categoryId = formData.get('categoryId') as string;
        const slug = formData.get('slug') as string;
        const featured = formData.get('featured') === 'true';
        const onSale = formData.get('onSale') === 'true';
        const rating = formData.get('rating')
            ? parseFloat(formData.get('rating') as string)
            : undefined;
        const reviewCount = formData.get('reviewCount')
            ? parseInt(formData.get('reviewCount') as string)
            : 0;
        const stock = formData.get('stock')
            ? parseInt(formData.get('stock') as string)
            : 0;

        if (!name || !description || !slug || !categoryId || isNaN(price)) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });

        if (!existingProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        if (slug !== existingProduct.slug) {
            const slugExists = await prisma.product.findUnique({
                where: { slug }
            });

            if (slugExists) {
                return NextResponse.json(
                    { error: 'Product with this slug already exists' },
                    { status: 400 }
                );
            }
        }


        // Check if category exists
        if (categoryId !== existingProduct.categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: categoryId }
            });

            if (!category) {
                return NextResponse.json(
                    { error: 'Category not found' },
                    { status: 400 }
                );
            }
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

        if (imageFile && imageFile.size > 0) {
            const timestamp = Date.now();
            const fileExtension = imageFile.name.split('.').pop();
            const fileName = `products/${slug}-${timestamp}.${fileExtension}`;
            const blob = await put(fileName, imageFile, {
                access: 'public',
                addRandomSuffix: false,
            });
            imageUrl = blob.url;
        } else if (imageUrlFromForm && imageUrlFromForm !== existingProduct.image) {
            imageUrl = imageUrlFromForm;
        } else {
            imageUrl = existingProduct.image;
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                originalPrice,
                image: imageUrl,
                categoryId,
                slug,
                featured,
                onSale,
                rating,
                reviewCount,
                stock,
            },
            include: {
                category: true
            }
        });

        return NextResponse.json(
            { message: 'Product updated successfully', updatedProduct },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating product:', error);
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
        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });

        if (!existingProduct) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'Product deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}