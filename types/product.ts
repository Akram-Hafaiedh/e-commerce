import { Category } from "./category";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: Category;
    categoryId: string;
    slug: string;
    featured: boolean;
    onSale: boolean;
    rating?: number;
    reviewCount: number;
    stock: number;
    createdAt: string;
    updatedAt: string;
}