
export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    featured?: boolean;
}

// Sample data - in a real app, this would come from a database or CMS
export const categories: Category[] = [
    {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and electronics',
        image: '/images/electronics.jpg',
        featured: true,
    },
    {
        id: '2',
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashionable clothing for everyone',
        image: '/images/clothing.jpg',
        featured: true,
    },
    {
        id: '3',
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Everything for your home',
        image: '/images/home-garden.jpg',
        featured: true,
    },
];
