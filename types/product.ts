import { Category } from "./category";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number | null;
    image: string;
    images?: string[];
    slug: string;
    sku: string | null;
    featured: boolean;
    onSale: boolean;
    isActive: boolean;

    stock: number;
    lowStockThreshold: number;
    soldCount: number;
    viewCount: number;

    rating: number | null;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
    categoryId: string;

    category: Category;
}