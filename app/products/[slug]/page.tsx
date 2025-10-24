export const dynamicParams = true;
export const revalidate = 3600; // 1 hour

import { notFound } from 'next/navigation';
import ProductContent from './ProductContent';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface ProductPageProps {
    params: { slug: string };
}

type ProductWithCategory = Prisma.ProductGetPayload<{
    include: { category: true }
}>;

async function getProduct(slug: string): Promise<ProductWithCategory | null> {
    console.log('[SERVER] Starting getProduct for slug:', slug);
    try {
        console.log('[SERVER] Attempting Prisma query...');
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                category: true
            }
        });

        if (product) {
            console.log('[SERVER] Product found:', product.id, product.name);
        } else {
            console.log('[SERVER] No product found for slug:', slug);
        }

        return product;
    } catch (error) {
        console.error('[SERVER] Error fetching product:', error);
        console.error('[SERVER] Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });
        return null;
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    console.log('[SERVER] ProductPage rendering for params:', params);
    const product = await getProduct(params.slug);

    console.log('[SERVER] Product result:', product ? 'Found' : 'Not found');
    if (!product) {
        console.log('[SERVER] Calling notFound()');
        notFound();
    }
    console.log('[SERVER] Rendering ProductContent component');
    return <ProductContent product={product} category={product.category} />;
}

export async function generateMetadata({ params }: ProductPageProps) {
    const product = await getProduct(params.slug);
    if (!product) return { title: 'Product Not Found' };

    return {
        title: `${product.name} - ShopStore`,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: product.image
                ? [{ url: product.image, width: 800, height: 600, alt: product.name }]
                : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description,
            images: product.image ? [product.image] : [],
        },
    };
}