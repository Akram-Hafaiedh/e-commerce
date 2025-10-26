import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { Prisma } from '@prisma/client';
import { put } from '@vercel/blob';

export async function GET(request: NextRequest) {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const simple = searchParams.get('simple'); // Add this line

        // If simple=true, return only basic product info for dropdowns
        if (simple === 'true') {
            const products = await prisma.product.findMany({
                orderBy: { name: 'asc' },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                }
            });

            return NextResponse.json({ products });
        }

        const skip = (page - 1) * limit;

        const where: Prisma.ProductWhereInput = search ?
            {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ]
            } : {};
        if (category) {
            where.categoryId = category;
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.product.count({ where })
        ]);

        return NextResponse.json({
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        });
    } catch (error) {
        console.error('Error fetching products:', error);
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


        // Check if slug already exists
        const existingProduct = await prisma.product.findUnique({
            where: { slug }
        });

        if (existingProduct) {
            return NextResponse.json(
                { error: 'Product with this slug already exists' },
                { status: 400 }
            );
        }

        // Check if category exists
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 400 }
            );
        }

        // Handle image upload
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
        } else if (imageUrlFromForm) {
            imageUrl = imageUrlFromForm;
        } else {
            return NextResponse.json(
                { error: 'Image is required' },
                { status: 400 }
            );
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price,
                originalPrice,
                image: imageUrl,
                categoryId,
                slug,
                featured: featured || false,
                onSale: onSale || false,
                rating,
                reviewCount: reviewCount || 0,
            },
            include: {
                category: true
            }
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}