import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!query) {
            return NextResponse.json({ products: [] });
        }

        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    {
                        category: {
                            name: { contains: query, mode: 'insensitive' }
                        }
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                image: true,
                slug: true,
                featured: true,
                onSale: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            },
            take: limit,
            orderBy: [
                // Prioritize featured products first
                { featured: 'desc' },
                // Then prioritize name matches over description matches
                { name: 'asc' },
                // Finally by creation date (newest first)
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}