import { Product } from "./product";

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    featured?: boolean;
    products: Product[]
}