import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getAvailableStock } from '@/lib/stock';

// Optional: define response type
// import type { Product } from '@/types/product';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const all = searchParams.get('all');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const categories = searchParams.get('categories');
    const featured = searchParams.get('featured');
    const onSale = searchParams.get('onSale');
    const search = searchParams.get('search');

    // === SINGLE PRODUCT BY SLUG ===
    if (slug) {
      const product = await prisma.product.findUnique({
        where: { slug },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          originalPrice: true,
          image: true,
          slug: true,
          sku: true,
          featured: true,
          onSale: true,
          isActive: true,
          lowStockThreshold: true,
          soldCount: true,
          viewCount: true,
          rating: true,
          reviewCount: true,
          createdAt: true,
          updatedAt: true,
          categoryId: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              image: true,
              featured: true,
              parentId: true
            }
          }
        }
      });

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      // Get real-time stock
      const availableStock = await getAvailableStock(product.id);

      const productResponse = {
        ...product,
        stock: availableStock,
      };

      return NextResponse.json({ product: productResponse });
    }

    // === BUILD FILTERS ===
    const where: Prisma.ProductWhereInput = {};

    if (categories) {
      const categorySlugs = categories.split(',');
      where.category = { slug: { in: categorySlugs } };
    }
    if (featured === 'true') where.featured = true;
    if (onSale === 'true') where.onSale = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (page - 1) * limit;

    // === ALL PRODUCTS (no pagination) ===
    if (all === 'true') {
      const products = await prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          originalPrice: true,
          image: true,
          slug: true,
          sku: true,
          featured: true,
          onSale: true,
          isActive: true,
          lowStockThreshold: true,
          soldCount: true,
          viewCount: true,
          rating: true,
          reviewCount: true,
          createdAt: true,
          updatedAt: true,
          categoryId: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      const productsWithStock = await Promise.all(
        products.map(async (p) => ({
          ...p,
          stock: await getAvailableStock(p.id),
        }))
      );

      return NextResponse.json(productsWithStock);
    }

    // === PAGINATED PRODUCTS ===
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          originalPrice: true,
          image: true,
          slug: true,
          sku: true,
          featured: true,
          onSale: true,
          isActive: true,
          lowStockThreshold: true,
          soldCount: true,
          viewCount: true,
          rating: true,
          reviewCount: true,
          createdAt: true,
          updatedAt: true,
          categoryId: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    const productsWithStock = await Promise.all(
      products.map(async (p) => ({
        ...p,
        stock: await getAvailableStock(p.id),
      }))
    );

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