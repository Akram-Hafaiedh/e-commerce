import { Category } from "@/types/category";

export const categories: Category[] = [
    {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and electronics',
        image: '/images/electronics.jpg',
        featured: true,
        products: []
    },
    {
        id: '2',
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashionable clothing for everyone',
        image: '/images/clothing.jpg',
        featured: true,
        products: []
    },
    {
        id: '3',
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Everything for your home',
        image: '/images/home-garden.jpg',
        featured: true,
        products: []
    },
];