
import { requireAdmin } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

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

        return NextResponse.json({ message: 'Categories fetched successfully', categories }, { status: 200 });
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

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const featured = formData.get('featured') === 'true';
        const slug = formData.get('slug') as string;

        if (!name || !description || !slug) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const existingCategory = await prisma.category.findUnique({ where: { slug } });
        if (existingCategory) {
            return NextResponse.json(
                { error: 'Category with this slug already exists' },
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
            return NextResponse.json(
                { error: 'Image is required' },
                { status: 400 }
            );
        }


        const newCategory = await prisma.category.create({
            data: {
                name,
                description,
                image: imageUrl,
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
