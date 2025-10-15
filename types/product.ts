export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    slug: string;
    featured: boolean;
    onSale: boolean;
    rating?: number;
    stock: number;
}