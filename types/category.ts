export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    featured: boolean;
    parentId?: string;
    parent?: Category; // Optional parent category
    children?: Category[]; // Optional subcategories
    createdAt: Date;
    updatedAt: Date;
}