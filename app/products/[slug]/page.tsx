import { products, categories } from '@/lib/category';
import { notFound } from 'next/navigation';
import ProductContent from './ProductContent';

interface ProductPageProps {
    params: {
        slug: string;
    };
}

export default function ProductPage({ params }: ProductPageProps) {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) {
        notFound();
    }

    const category = categories.find((c) => c.slug === product.category);

    return <ProductContent product={product} category={category} />;

}

// Generate static params for product pages
export async function generateStaticParams() {
    return products.map((product) => ({
        slug: product.slug,
    }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
    const product = products.find((p) => p.slug === params.slug);

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