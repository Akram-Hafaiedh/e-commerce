import { HashPassword } from '@/lib/auth-utils'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedAdmin() {
    try {
        const adminUser = await prisma.user.upsert({
            where: { email: 'admin@example.com' },
            update: {},
            create: {
                email: 'admin@example.com',
                password: await HashPassword('admin123'),
                name: 'Admin User',
                role: 'ADMIN',
            },
        })

        console.log('Admin user created:', adminUser.email)

        const regularUser = await prisma.user.upsert({
            where: { email: 'user@example.com' },
            update: {},
            create: {
                email: 'user@example.com',
                password: await HashPassword('user123'),
                name: 'Regular User',
                role: 'USER',
            },
        })

        console.log('Regular user created:', regularUser.email)
    } catch (error) {
        console.error('Error seeding admin:', error)
        throw error
    }
}

async function seedCategories() {
    try {
        const categoriesData = [
            {
                name: 'Electronics',
                slug: 'electronics',
                description: 'Latest gadgets and electronics',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/electronics-1761056281779.png',
                featured: true,
                parentId: null,
            },
            {
                name: 'Clothing',
                slug: 'clothing',
                description: 'Fashionable clothing for everyone',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/clothing-1761056933411.png',
                featured: true,
                parentId: null,
            },
            {
                name: 'Home & Garden',
                slug: 'home-garden',
                description: 'Everything for your home',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/home-garden-1761056973203.png',
                featured: true,
                parentId: null,
            },
        ]

        const categoriesPromises = categoriesData.map(categoryData =>
            prisma.category.upsert({
                where: { slug: categoryData.slug },
                update: {},
                create: categoryData,
            })
        )

        const categories = await Promise.all(categoriesPromises)

        console.log('Categories created:', categories.map(category => category.slug).join(', '))
    } catch (error) {
        console.error('Error seeding categories:', error)
        throw error
    }
}

async function seedProducts() {
    try {
        // First, get the categories to map slugs to IDs
        const categories = await prisma.category.findMany()
        const categoryMap = new Map(
            categories.map(cat => [cat.slug, cat.id])
        )

        const productsData = [
            {
                name: 'Wireless Headphones',
                description: 'High-quality wireless headphones with noise cancellation',
                price: 199.99,
                originalPrice: 249.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/wireless-headphones-1761067924663.png',
                categorySlug: 'electronics',
                slug: 'wireless-headphones',
                featured: true,
                onSale: true,
                rating: 4.8,
                reviewCount: 124,
                // stock: 15,
            },
            {
                name: 'Smartphone',
                description: 'Latest smartphone with advanced features',
                price: 899.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/smartphone-pro-1761068995933.png',
                categorySlug: 'electronics',
                slug: 'smartphone-pro',
                featured: true,
                onSale: false,
                rating: 4.9,
                reviewCount: 78,
                // stock: 8,
            },
            {
                name: '4K Smart TV',
                description: 'Ultra HD Smart TV with vibrant colors and smart features',
                price: 1299.99,
                originalPrice: 1599.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/smart-tv-1761069106418.png',
                categorySlug: 'electronics',
                slug: '4k-smart-tv',
                featured: true,
                onSale: true,
                rating: 4.7,
                reviewCount: 32,
                // stock: 5,
            },
            {
                name: 'Bluetooth Speaker',
                description: 'Portable Bluetooth speaker with deep bass',
                price: 99.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/bluetooth-speaker-1761069197259.png',
                categorySlug: 'electronics',
                slug: 'bluetooth-speaker',
                featured: false,
                onSale: false,
                rating: 4.4,
                reviewCount: 24,
                // stock: 20,
            },
            {
                name: 'Laptop',
                description: 'Lightweight laptop with powerful performance',
                price: 1199.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/laptop-1761069249994.png',
                categorySlug: 'electronics',
                slug: 'laptop',
                featured: true,
                onSale: false,
                rating: 4.6,
                reviewCount: 16,
                // stock: 12,
            },
            {
                name: 'Smartwatch',
                description: 'Track your fitness and receive notifications on your wrist',
                price: 249.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/smartwatch-1761069349297.png',
                categorySlug: 'electronics',
                slug: 'smartwatch',
                featured: false,
                onSale: false,
                rating: 4.2,
                reviewCount: 8,
                // stock: 30,
            },
            {
                name: 'Wireless Mouse',
                description: 'Ergonomic wireless mouse with long battery life',
                price: 39.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/wireless-mouse-1761069396597.png',
                categorySlug: 'electronics',
                slug: 'wireless-mouse',
                featured: false,
                onSale: false,
                rating: 4.1,
                reviewCount: 6,
                // stock: 40,
            },
            {
                name: 'Mechanical Keyboard',
                description: 'RGB backlit mechanical keyboard for gamers',
                price: 129.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/mechanical-keyboard-1761069453475.png',
                categorySlug: 'electronics',
                slug: 'mechanical-keyboard',
                featured: true,
                onSale: false,
                rating: 4.5,
                reviewCount: 12,
                // stock: 22,
            },
            {
                name: 'Gaming Console',
                description: 'Next-gen gaming console with immersive graphics',
                price: 599.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/gaming-console-1761069524315.png',
                categorySlug: 'electronics',
                slug: 'gaming-console',
                featured: true,
                onSale: false,
                rating: 4.9,
                reviewCount: 36,
                // stock: 7,
            },
            {
                name: 'Cotton T-Shirt',
                description: 'Comfortable cotton t-shirt in various colors',
                price: 29.99,
                originalPrice: 39.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/cotton-t-shirt-1761069585749.png',
                categorySlug: 'clothing',
                slug: 'cotton-tshirt',
                featured: false,
                onSale: true,
                rating: 4.3,
                reviewCount: 18,
                // stock: 50,
            },
            {
                name: 'Denim Jeans',
                description: 'Classic slim-fit denim jeans',
                price: 59.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/denim-jeans-1761069639936.png',
                categorySlug: 'clothing',
                slug: 'denim-jeans',
                featured: true,
                onSale: false,
                rating: 4.7,
                reviewCount: 12,
                // stock: 25,
            },
            {
                name: 'Designer Hoodie',
                description: 'Premium quality hoodie with unique design',
                price: 79.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/designer-hoodie-1761069693216.png',
                categorySlug: 'clothing',
                slug: 'designer-hoodie',
                featured: true,
                onSale: false,
                rating: 4.7,
                reviewCount: 12,
                // stock: 25,
            },
            {
                name: 'Leather Jacket',
                description: 'Stylish leather jacket with modern fit',
                price: 199.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/leather-jacket-1761069757859.png',
                categorySlug: 'clothing',
                slug: 'leather-jacket',
                featured: false,
                onSale: false,
                rating: 4.8,
                reviewCount: 8,
                // stock: 10,
            },
            {
                name: 'Sneakers',
                description: 'Lightweight sneakers for everyday comfort',
                price: 89.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/sneakers-1761069807177.png',
                categorySlug: 'clothing',
                slug: 'sneakers',
                featured: true,
                onSale: false,
                rating: 4.5,
                reviewCount: 14,
                // stock: 35,
            },
            {
                name: 'Summer Dress',
                description: 'Elegant floral summer dress for women',
                price: 69.99,
                originalPrice: 89.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/summer-dress-1761069872219.png',
                categorySlug: 'clothing',
                slug: 'summer-dress',
                featured: true,
                onSale: true,
                rating: 4.5,
                reviewCount: 16,
                // stock: 18,
            },
            {
                name: 'Wool Scarf',
                description: 'Soft wool scarf to keep you warm in winter',
                price: 24.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/wool-scarf-1761069926532.png',
                categorySlug: 'clothing',
                slug: 'wool-scarf',
                featured: false,
                onSale: false,
                rating: 4.3,
                reviewCount: 10,
                // stock: 40,
            },
            {
                name: 'Baseball Cap',
                description: 'Adjustable cotton cap for casual wear',
                price: 19.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/baseball-cap-1761069976129.png',
                categorySlug: 'clothing',
                slug: 'baseball-cap',
                featured: false,
                onSale: false,
                rating: 4.0,
                reviewCount: 6,
                // stock: 60,
            },
            {
                name: 'Winter Coat',
                description: 'Insulated winter coat with hood',
                price: 179.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/winter-coat-1761070143807.png',
                categorySlug: 'clothing',
                slug: 'winter-coat',
                featured: true,
                onSale: false,
                rating: 4.6,
                reviewCount: 8,
                // stock: 14,
            },
            {
                name: 'Garden Tools Set',
                description: 'Complete set of gardening tools',
                price: 149.99,
                originalPrice: 199.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/garden-tools-set-1761070205143.png',
                categorySlug: 'home-garden',
                slug: 'garden-tools-set',
                featured: true,
                onSale: true,
                rating: 4.8,
                reviewCount: 12,
                // stock: 10,
            },
            {
                name: 'Scented Candle Set',
                description: 'Luxury scented candles in elegant packaging',
                price: 34.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/scented-candle-set-1761082335982.png',
                categorySlug: 'home-garden',
                slug: 'scented-candle-set',
                featured: true,
                onSale: false,
                rating: 4.6,
                reviewCount: 10,
                // stock: 30,
            },
            {
                name: 'Decorative Plant',
                description: 'Artificial decorative plant in ceramic pot',
                price: 29.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/decorative-plant-1761082410496.png',
                categorySlug: 'home-garden',
                slug: 'decorative-plant',
                featured: false,
                onSale: false,
                rating: 4.2,
                reviewCount: 8,
                // stock: 25,
            },
            {
                name: 'Wall Clock',
                description: 'Minimalist wall clock for living room',
                price: 39.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/wall-clock-1761082459357.png',
                categorySlug: 'home-garden',
                slug: 'wall-clock',
                featured: false,
                onSale: false,
                rating: 4.3,
                reviewCount: 9,
                // stock: 20,
            },
            {
                name: 'Coffee Maker Deluxe',
                description: 'Automatic drip coffee maker with timer and grinder',
                price: 89.99,
                originalPrice: 129.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/coffee-maker-deluxe-1761082655586.png',
                categorySlug: 'home-garden',
                slug: 'coffee-maker-deluxe',
                featured: false,
                onSale: true,
                rating: 4.4,
                reviewCount: 11,
                // stock: 15,
            },
            {
                name: 'Vacuum Cleaner',
                description: 'Powerful cordless vacuum cleaner',
                price: 249.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/vacuum-cleaner-1761082701440.png',
                categorySlug: 'home-garden',
                slug: 'vacuum-cleaner',
                featured: true,
                onSale: false,
                rating: 4.5,
                reviewCount: 14,
                // stock: 18,
            },
            {
                name: 'Cookware Set',
                description: 'Non-stick cookware set for everyday use',
                price: 179.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/cookware-set-1761082818646.png',
                categorySlug: 'home-garden',
                slug: 'cookware-set',
                featured: true,
                onSale: false,
                rating: 4.7,
                reviewCount: 16,
                // stock: 12,
            },
            {
                name: 'Table Lamp',
                description: 'Modern LED table lamp with adjustable brightness',
                price: 49.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/table-lamp-1761082859609.png',
                categorySlug: 'home-garden',
                slug: 'table-lamp',
                featured: false,
                onSale: false,
                rating: 4.3,
                reviewCount: 7,
                // stock: 28,
            },
            {
                name: 'Rug Carpet',
                description: 'Soft rug carpet for your living space',
                price: 99.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/rug-carpet-1761082936578.png',
                categorySlug: 'home-garden',
                slug: 'rug-carpet',
                featured: true,
                onSale: false,
                rating: 4.6,
                reviewCount: 13,
                // stock: 10,
            },
        ]

        const productsPromises = productsData.map(product => {
            const categoryId = categoryMap.get(product.categorySlug)
            if (!categoryId) {
                throw new Error(`Category not found for slug: ${product.categorySlug}`)
            }

            // Remove categorySlug before passing to Prisma
            const { categorySlug, ...productData } = product

            console.log('Category Slug:', categorySlug) // Use categorySlug here


            return prisma.product.upsert({
                where: { slug: product.slug },
                update: {},
                create: {
                    ...productData,
                    categoryId,
                },
            })
        })

        const createdProducts = await Promise.all(productsPromises)
        console.log(`Created ${createdProducts.length} products`)
    } catch (error) {
        console.error('Error seeding products:', error)
        throw error
    }
}

async function main() {
    console.log('Starting database seeding...')

    await seedAdmin()
    console.log('✓ Users seeded')

    await seedCategories()
    console.log('✓ Categories seeded')

    await seedProducts()
    console.log('✓ Products seeded')

    console.log('Database seeding completed successfully!')
}

main()
    .catch((e) => {
        console.error('Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })