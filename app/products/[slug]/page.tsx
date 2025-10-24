export const dynamicParams = true;
export const revalidate = 3600; // 1 hour

import { notFound } from 'next/navigation';
import ProductContent from './ProductContent';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface ProductPageProps {
    params: { slug: string };
}

// Define the return type for getProduct
type ProductWithCategory = Prisma.ProductGetPayload<{
    include: { category: true }
}>;

async function getProduct(slug: string): Promise<ProductWithCategory | null> {
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                category: true
            }
        });

        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const product = await getProduct(params.slug);
    if (!product) notFound();
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