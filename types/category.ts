export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    featured: boolean;
    parentId: string | null;
    parent?: Category; // Optional parent category
    children?: Category[]; // Optional subcategories
    createdAt: Date;
    updatedAt: Date;
}

export interface CategoryWithCount extends Category {
    _count?: {
        products: number;
        children: number;
    };
}