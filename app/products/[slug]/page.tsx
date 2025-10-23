import { notFound } from 'next/navigation';
import ProductContent from './ProductContent';
import { Product } from '@/types/product';

interface ProductPageProps {
    params: {
        slug: string;
    };
}


async function getProduct(slug: string) {
    try {
        const response = await fetch(`/api/products/slug/${slug}`, {
            next: { revalidate: 60 } // Cache for 60 seconds
        });

        if (!response.ok) {
            return null;
        }
        const reponse = await response.json();
        return reponse.product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export default async function ProductPage({ params }: ProductPageProps) {

    const product = await getProduct(params.slug);
    if (!product) {
        notFound();
    }

    return <ProductContent product={product} category={product.category} />;

}

// Generate static params for product pages
export async function generateStaticParams() {
    try {
        const res = await fetch('/api/products?all=true', { cache: 'no-store' });
        if (!res.ok) {
            return [];
        }
        const products = await res.json();

        return products.map((product: Product) => ({
            slug: product.slug,
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
    const product = await getProduct(params.slug);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: `${product.name} - ShopStore`,
        description: product.description,
    };
}