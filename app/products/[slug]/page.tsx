export const dynamicParams = true;
export const revalidate = 3600; // 1 hour

import { notFound } from 'next/navigation';
import ProductContent from './ProductContent';

interface ProductPageProps {
    params: { slug: string };
}

function getBaseUrl() {
    if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
}

async function getProduct(slug: string) {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/products/slug/${slug}`, {
            next: { revalidate: 3600 },
        });

        if (!response.ok) return null;
        const data = await response.json();
        return data.product;
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
