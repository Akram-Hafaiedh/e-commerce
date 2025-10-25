import { Category } from "./category";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number | null;
    image: string;
    category: Category;
    categoryId: string;
    slug: string;
    featured: boolean;
    onSale: boolean;
    rating: number | null;
    reviewCount: number;
    // stock: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductWithStock extends Product {
    stock: number;
}