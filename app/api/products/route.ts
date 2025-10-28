import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const all = searchParams.get('all');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const onSale = searchParams.get('onSale');
    const search = searchParams.get('search');

    // Handle single product fetch by slug
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
          featured: true,
          onSale: true,
          rating: true,
          reviewCount: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              image: true
            }
          },
          Inventory: {
            select: {
              id: true,
              quantity: true,
              warehouseId: true,
              warehouse: {
                select: {
                  name: true,
                  code: true,
                  city: true
                }
              }
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

      // Compute total stock
      const productWithStock = {
        ...product,
        stock: product.Inventory.reduce((sum, inv) => sum + inv.quantity, 0),
        Inventory: undefined // Remove if not needed in response
      };

      return NextResponse.json({ product: productWithStock });
    }

    const skip = (page - 1) * limit;

    // Build where clause with proper Prisma type
    const where: Prisma.ProductWhereInput = {};

    if (category) {
      const categorySlugs = category.split(',');
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
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          originalPrice: true,
          image: true,
          slug: true,
          featured: true,
          onSale: true,
          rating: true,
          reviewCount: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          _count: {
            select: {
              Inventory: true
            }
          },
          Inventory: {
            select: {
              quantity: true
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
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          originalPrice: true,
          image: true,
          slug: true,
          featured: true,
          onSale: true,
          rating: true,
          reviewCount: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          Inventory: {
            select: {
              quantity: true
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