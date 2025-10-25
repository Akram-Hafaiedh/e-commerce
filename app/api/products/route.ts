import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const categories = searchParams.get('categories');
    const featured = searchParams.get('featured');
    const onSale = searchParams.get('onSale');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause with proper Prisma type
    const where: Prisma.ProductWhereInput = {
      Inventory: {
        some: {
          quantity: { gt: 0 } // Only products with total stock > 0
        }
      }
    };

    if (categories) {
      const categorySlugs = categories.split(',');
      where.category = {
        slug: { in: categorySlugs }
      };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (onSale === 'true') {
      where.onSale = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (all === 'true') {
      const allProducts = await prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          Inventory: {
            select: {
              quantity: true // Only fetch what we need for summing stock
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Compute stock for each product
      const allProductsWithStock = allProducts.map(product => ({
        ...product,
        stock: product.Inventory.reduce((sum, inv) => sum + inv.quantity, 0),
        Inventory: undefined // Optional: remove if not needed in response
      }));

      return NextResponse.json(allProductsWithStock);
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          Inventory: {
            select: {
              quantity: true // Only fetch what we need for summing stock
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.product.count({ where })
    ]);

    // Compute stock for each product
    const productsWithStock = products.map(product => ({
      ...product,
      stock: product.Inventory.reduce((sum, inv) => sum + inv.quantity, 0),
      Inventory: undefined // Optional: remove if not needed in response
    }));

    return NextResponse.json({
      products: productsWithStock,
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