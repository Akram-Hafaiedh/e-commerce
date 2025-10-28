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
        // Create main categories first
        const mainCategoriesData = [
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

        const mainCategoriesPromises = mainCategoriesData.map(categoryData =>
            prisma.category.upsert({
                where: { slug: categoryData.slug },
                update: categoryData,
                create: categoryData,
            })
        )

        const mainCategories = await Promise.all(mainCategoriesPromises)
        console.log('Main categories created:', mainCategories.map(category => category.slug).join(', '))

        // Create a map of category slugs to IDs
        const categoryMap = new Map(
            mainCategories.map(cat => [cat.slug, cat.id])
        )

        // Create subcategories
        const subCategoriesData = [
            // Electronics subcategories
            {
                name: 'Smartphones',
                slug: 'smartphones',
                description: 'Latest smartphones and mobile devices',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/electronics-1761056281779.png',
                parentSlug: 'electronics',
                featured: false,
            },
            {
                name: 'Laptops & Computers',
                slug: 'laptops-computers',
                description: 'Laptops, desktops, and computer accessories',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/electronics-1761056281779.png',
                parentSlug: 'electronics',
                featured: false,
            },
            {
                name: 'Audio & Headphones',
                slug: 'audio-headphones',
                description: 'Headphones, speakers, and audio equipment',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/electronics-1761056281779.png',
                parentSlug: 'electronics',
                featured: true,
            },
            {
                name: 'TVs & Home Theater',
                slug: 'tvs-home-theater',
                description: 'Televisions and home entertainment systems',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/electronics-1761056281779.png',
                parentSlug: 'electronics',
                featured: false,
            },
            {
                name: 'Gaming',
                slug: 'gaming',
                description: 'Gaming consoles, accessories, and games',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/electronics-1761056281779.png',
                parentSlug: 'electronics',
                featured: false,
            },
            {
                name: 'Wearables',
                slug: 'wearables',
                description: 'Smartwatches and fitness trackers',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/electronics-1761056281779.png',
                parentSlug: 'electronics',
                featured: false,
            },
            {
                name: 'Accessories',
                slug: 'electronics-accessories',
                description: 'Cables, chargers, and other accessories',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/electronics-1761056281779.png',
                parentSlug: 'electronics',
                featured: false,
            },

            // Clothing subcategories
            {
                name: "Men's Clothing",
                slug: 'mens-clothing',
                description: 'Fashionable clothing for men',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/clothing-1761056933411.png',
                parentSlug: 'clothing',
                featured: false,
            },
            {
                name: "Women's Clothing",
                slug: 'womens-clothing',
                description: 'Stylish clothing for women',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/clothing-1761056933411.png',
                parentSlug: 'clothing',
                featured: false,
            },
            {
                name: 'Shoes',
                slug: 'shoes',
                description: 'Footwear for all occasions',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/clothing-1761056933411.png',
                parentSlug: 'clothing',
                featured: false,
            },
            {
                name: 'Accessories',
                slug: 'clothing-accessories',
                description: 'Hats, scarves, and fashion accessories',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/clothing-1761056933411.png',
                parentSlug: 'clothing',
                featured: false,
            },
            {
                name: 'Outerwear',
                slug: 'outerwear',
                description: 'Jackets, coats, and winter wear',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/clothing-1761056933411.png',
                parentSlug: 'clothing',
                featured: false,
            },
            {
                name: 'Sportswear',
                slug: 'sportswear',
                description: 'Athletic and activewear',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/clothing-1761056933411.png',
                parentSlug: 'clothing',
                featured: false,
            },

            // Home & Garden subcategories
            {
                name: 'Furniture',
                slug: 'furniture',
                description: 'Indoor and outdoor furniture',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/home-garden-1761056973203.png',
                parentSlug: 'home-garden',
                featured: false,
            },
            {
                name: 'Kitchen & Dining',
                slug: 'kitchen-dining',
                description: 'Cookware, appliances, and dining essentials',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/home-garden-1761056973203.png',
                parentSlug: 'home-garden',
                featured: false,
            },
            {
                name: 'Home Decor',
                slug: 'home-decor',
                description: 'Decorative items and artwork',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/home-garden-1761056973203.png',
                parentSlug: 'home-garden',
                featured: false,
            },
            {
                name: 'Lighting',
                slug: 'lighting',
                description: 'Lamps, fixtures, and lighting solutions',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/home-garden-1761056973203.png',
                parentSlug: 'home-garden',
                featured: false,
            },
            {
                name: 'Garden Tools',
                slug: 'garden-tools',
                description: 'Gardening equipment and supplies',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/home-garden-1761056973203.png',
                parentSlug: 'home-garden',
                featured: false,
            },
            {
                name: 'Home Appliances',
                slug: 'home-appliances',
                description: 'Vacuum cleaners, air purifiers, and more',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/home-garden-1761056973203.png',
                parentSlug: 'home-garden',
                featured: false,
            },
            {
                name: 'Bedding & Bath',
                slug: 'bedding-bath',
                description: 'Bed linens, towels, and bathroom essentials',
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/categories/home-garden-1761056973203.png',
                parentSlug: 'home-garden',
                featured: false,
            },
        ]

        const subCategoriesPromises = subCategoriesData.map(subCategoryData => {
            const parentId = categoryMap.get(subCategoryData.parentSlug)
            if (!parentId) {
                throw new Error(`Parent category not found for slug: ${subCategoryData.parentSlug}`)
            }

            const { parentSlug, ...categoryData } = subCategoryData

            return prisma.category.upsert({
                where: { slug: categoryData.slug },
                update: categoryData,
                create: {
                    ...categoryData,
                    parentId,
                },
            })
        })

        const subCategories = await Promise.all(subCategoriesPromises)
        console.log('Subcategories created:', subCategories.map(category => category.slug).join(', '))

    } catch (error) {
        console.error('Error seeding categories:', error)
        throw error
    }
}

async function seedProducts() {
    try {
        // Get all categories to map slugs to IDs
        const categories = await prisma.category.findMany()
        const categoryMap = new Map(
            categories.map(cat => [cat.slug, cat.id])
        )

        const productsData = [
            // Electronics - Audio & Headphones
            {
                name: 'Wireless Headphones',
                description: 'High-quality wireless headphones with noise cancellation',
                price: 199.99,
                originalPrice: 249.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/wireless-headphones-1761067924663.png',
                categorySlug: 'audio-headphones',
                slug: 'wireless-headphones',
                featured: true,
                onSale: true,
                rating: 4.8,
                reviewCount: 124,
            },
            {
                name: 'Bluetooth Speaker',
                description: 'Portable Bluetooth speaker with deep bass',
                price: 99.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/bluetooth-speaker-1761069197259.png',
                categorySlug: 'audio-headphones',
                slug: 'bluetooth-speaker',
                featured: false,
                onSale: false,
                rating: 4.4,
                reviewCount: 24,
            },

            // Electronics - Smartphones
            {
                name: 'Smartphone',
                description: 'Latest smartphone with advanced features',
                price: 899.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/smartphone-pro-1761068995933.png',
                categorySlug: 'smartphones',
                slug: 'smartphone-pro',
                featured: true,
                onSale: false,
                rating: 4.9,
                reviewCount: 78,
            },

            // Electronics - TVs & Home Theater
            {
                name: '4K Smart TV',
                description: 'Ultra HD Smart TV with vibrant colors and smart features',
                price: 1299.99,
                originalPrice: 1599.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/smart-tv-1761069106418.png',
                categorySlug: 'tvs-home-theater',
                slug: '4k-smart-tv',
                featured: true,
                onSale: true,
                rating: 4.7,
                reviewCount: 32,
            },

            // Electronics - Laptops & Computers
            {
                name: 'Laptop',
                description: 'Lightweight laptop with powerful performance',
                price: 1199.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/laptop-1761069249994.png',
                categorySlug: 'laptops-computers',
                slug: 'laptop',
                featured: true,
                onSale: false,
                rating: 4.6,
                reviewCount: 16,
            },
            {
                name: 'Wireless Mouse',
                description: 'Ergonomic wireless mouse with long battery life',
                price: 39.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/wireless-mouse-1761069396597.png',
                categorySlug: 'electronics-accessories',
                slug: 'wireless-mouse',
                featured: false,
                onSale: false,
                rating: 4.1,
                reviewCount: 6,
            },
            {
                name: 'Mechanical Keyboard',
                description: 'RGB backlit mechanical keyboard for gamers',
                price: 129.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/mechanical-keyboard-1761069453475.png',
                categorySlug: 'electronics-accessories',
                slug: 'mechanical-keyboard',
                featured: true,
                onSale: false,
                rating: 4.5,
                reviewCount: 12,
            },

            // Electronics - Wearables
            {
                name: 'Smartwatch',
                description: 'Track your fitness and receive notifications on your wrist',
                price: 249.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/smartwatch-1761069349297.png',
                categorySlug: 'wearables',
                slug: 'smartwatch',
                featured: false,
                onSale: false,
                rating: 4.2,
                reviewCount: 8,
            },

            // Electronics - Gaming
            {
                name: 'Gaming Console',
                description: 'Next-gen gaming console with immersive graphics',
                price: 599.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/gaming-console-1761069524315.png',
                categorySlug: 'gaming',
                slug: 'gaming-console',
                featured: true,
                onSale: false,
                rating: 4.9,
                reviewCount: 36,
            },

            // Clothing - Men's Clothing
            {
                name: 'Cotton T-Shirt',
                description: 'Comfortable cotton t-shirt in various colors',
                price: 29.99,
                originalPrice: 39.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/cotton-t-shirt-1761069585749.png',
                categorySlug: 'mens-clothing',
                slug: 'cotton-tshirt',
                featured: false,
                onSale: true,
                rating: 4.3,
                reviewCount: 18,
            },
            {
                name: 'Denim Jeans',
                description: 'Classic slim-fit denim jeans',
                price: 59.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/denim-jeans-1761069639936.png',
                categorySlug: 'mens-clothing',
                slug: 'denim-jeans',
                featured: true,
                onSale: false,
                rating: 4.7,
                reviewCount: 12,
            },
            {
                name: 'Designer Hoodie',
                description: 'Premium quality hoodie with unique design',
                price: 79.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/designer-hoodie-1761069693216.png',
                categorySlug: 'mens-clothing',
                slug: 'designer-hoodie',
                featured: true,
                onSale: false,
                rating: 4.7,
                reviewCount: 12,
            },

            // Clothing - Outerwear
            {
                name: 'Leather Jacket',
                description: 'Stylish leather jacket with modern fit',
                price: 199.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/leather-jacket-1761069757859.png',
                categorySlug: 'outerwear',
                slug: 'leather-jacket',
                featured: false,
                onSale: false,
                rating: 4.8,
                reviewCount: 8,
            },
            {
                name: 'Winter Coat',
                description: 'Insulated winter coat with hood',
                price: 179.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/winter-coat-1761070143807.png',
                categorySlug: 'outerwear',
                slug: 'winter-coat',
                featured: true,
                onSale: false,
                rating: 4.6,
                reviewCount: 8,
            },

            // Clothing - Shoes
            {
                name: 'Sneakers',
                description: 'Lightweight sneakers for everyday comfort',
                price: 89.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/sneakers-1761069807177.png',
                categorySlug: 'shoes',
                slug: 'sneakers',
                featured: true,
                onSale: false,
                rating: 4.5,
                reviewCount: 14,
            },

            // Clothing - Women's Clothing
            {
                name: 'Summer Dress',
                description: 'Elegant floral summer dress for women',
                price: 69.99,
                originalPrice: 89.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/summer-dress-1761069872219.png',
                categorySlug: 'womens-clothing',
                slug: 'summer-dress',
                featured: true,
                onSale: true,
                rating: 4.5,
                reviewCount: 16,
            },

            // Clothing - Accessories
            {
                name: 'Wool Scarf',
                description: 'Soft wool scarf to keep you warm in winter',
                price: 24.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/wool-scarf-1761069926532.png',
                categorySlug: 'clothing-accessories',
                slug: 'wool-scarf',
                featured: false,
                onSale: false,
                rating: 4.3,
                reviewCount: 10,
            },
            {
                name: 'Baseball Cap',
                description: 'Adjustable cotton cap for casual wear',
                price: 19.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/baseball-cap-1761069976129.png',
                categorySlug: 'clothing-accessories',
                slug: 'baseball-cap',
                featured: false,
                onSale: false,
                rating: 4.0,
                reviewCount: 6,
            },

            // Home & Garden - Garden Tools
            {
                name: 'Garden Tools Set',
                description: 'Complete set of gardening tools',
                price: 149.99,
                originalPrice: 199.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/garden-tools-set-1761070205143.png',
                categorySlug: 'garden-tools',
                slug: 'garden-tools-set',
                featured: true,
                onSale: true,
                rating: 4.8,
                reviewCount: 12,
            },

            // Home & Garden - Home Decor
            {
                name: 'Scented Candle Set',
                description: 'Luxury scented candles in elegant packaging',
                price: 34.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/scented-candle-set-1761082335982.png',
                categorySlug: 'home-decor',
                slug: 'scented-candle-set',
                featured: true,
                onSale: false,
                rating: 4.6,
                reviewCount: 10,
            },
            {
                name: 'Decorative Plant',
                description: 'Artificial decorative plant in ceramic pot',
                price: 29.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/decorative-plant-1761082410496.png',
                categorySlug: 'home-decor',
                slug: 'decorative-plant',
                featured: false,
                onSale: false,
                rating: 4.2,
                reviewCount: 8,
            },
            {
                name: 'Wall Clock',
                description: 'Minimalist wall clock for living room',
                price: 39.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/wall-clock-1761082459357.png',
                categorySlug: 'home-decor',
                slug: 'wall-clock',
                featured: false,
                onSale: false,
                rating: 4.3,
                reviewCount: 9,
            },
            {
                name: 'Rug Carpet',
                description: 'Soft rug carpet for your living space',
                price: 99.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/rug-carpet-1761082936578.png',
                categorySlug: 'home-decor',
                slug: 'rug-carpet',
                featured: true,
                onSale: false,
                rating: 4.6,
                reviewCount: 13,
            },

            // Home & Garden - Kitchen & Dining
            {
                name: 'Coffee Maker Deluxe',
                description: 'Automatic drip coffee maker with timer and grinder',
                price: 89.99,
                originalPrice: 129.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/coffee-maker-deluxe-1761082655586.png',
                categorySlug: 'kitchen-dining',
                slug: 'coffee-maker-deluxe',
                featured: false,
                onSale: true,
                rating: 4.4,
                reviewCount: 11,
            },
            {
                name: 'Cookware Set',
                description: 'Non-stick cookware set for everyday use',
                price: 179.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/cookware-set-1761082818646.png',
                categorySlug: 'kitchen-dining',
                slug: 'cookware-set',
                featured: true,
                onSale: false,
                rating: 4.7,
                reviewCount: 16,
            },

            // Home & Garden - Home Appliances
            {
                name: 'Vacuum Cleaner',
                description: 'Powerful cordless vacuum cleaner',
                price: 249.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/vacuum-cleaner-1761082701440.png',
                categorySlug: 'home-appliances',
                slug: 'vacuum-cleaner',
                featured: true,
                onSale: false,
                rating: 4.5,
                reviewCount: 14,
            },

            // Home & Garden - Lighting
            {
                name: 'Table Lamp',
                description: 'Modern LED table lamp with adjustable brightness',
                price: 49.99,
                image: 'https://efozrlihldf284c2.public.blob.vercel-storage.com/products/table-lamp-1761082859609.png',
                categorySlug: 'lighting',
                slug: 'table-lamp',
                featured: false,
                onSale: false,
                rating: 4.3,
                reviewCount: 7,
            },
        ]

        const productsPromises = productsData.map(product => {
            const categoryId = categoryMap.get(product.categorySlug)
            if (!categoryId) {
                throw new Error(`Category not found for slug: ${product.categorySlug}`)
            }

            const { categorySlug, ...productData } = product

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

async function seedWarehouses() {
    try {
        console.log('Seeding warehouses...');

        const warehousesData = [
            {
                name: 'Main Distribution Center',
                code: 'WH-MAIN-001',
                address: '123 Distribution Drive',
                city: 'Chicago',
                country: 'United States',
                postalCode: '60601',
                type: 'MAIN' as const,
                isActive: true,
            },
            {
                name: 'East Coast Regional',
                code: 'WH-EAST-001',
                address: '456 Coastal Avenue',
                city: 'New York',
                country: 'United States',
                postalCode: '10001',
                type: 'REGIONAL' as const,
                isActive: true,
            },
            {
                name: 'West Coast Regional',
                code: 'WH-WEST-001',
                address: '789 Pacific Boulevard',
                city: 'Los Angeles',
                country: 'United States',
                postalCode: '90001',
                type: 'REGIONAL' as const,
                isActive: true,
            },
            {
                name: 'Downtown Store',
                code: 'WH-STORE-001',
                address: '321 Main Street',
                city: 'Chicago',
                country: 'United States',
                postalCode: '60602',
                type: 'STORE' as const,
                isActive: true,
            },
            {
                name: 'Online Fulfillment Center',
                code: 'WH-VIRTUAL-001',
                address: 'Digital Warehouse',
                city: 'Virtual',
                country: 'United States',
                postalCode: '00000',
                type: 'VIRTUAL' as const,
                isActive: true,
            }
        ];

        const warehousesPromises = warehousesData.map(warehouseData =>
            prisma.warehouse.upsert({
                where: { code: warehouseData.code },
                update: {},
                create: warehouseData,
            })
        );

        const warehouses = await Promise.all(warehousesPromises);
        console.log('Warehouses created:', warehouses.map(warehouse => warehouse.name).join(', '));

        return warehouses;
    } catch (error) {
        console.error('Error seeding warehouses:', error);
        throw error;
    }
}

async function seedInventory() {
    try {
        console.log('Seeding inventory...');

        const products = await prisma.product.findMany();
        const warehouses = await prisma.warehouse.findMany();

        const mainWarehouse = warehouses.find(w => w.type === 'MAIN');

        if (!mainWarehouse) {
            console.log('No main warehouse found, skipping inventory seeding');
            return;
        }

        const inventoryPromises = products.map(product =>
            prisma.inventory.upsert({
                where: {
                    productId_warehouseId: {
                        productId: product.id,
                        warehouseId: mainWarehouse.id,
                    }
                },
                update: {},
                create: {
                    productId: product.id,
                    warehouseId: mainWarehouse.id,
                    quantity: Math.floor(Math.random() * 50) + 10,
                    minStock: 10,
                    reorderPoint: 20,
                },
            })
        );

        await Promise.all(inventoryPromises);
        console.log(`Inventory created for ${products.length} products in main warehouse`);
    } catch (error) {
        console.error('Error seeding inventory:', error);
        throw error;
    }
}

async function main() {
    console.log('Starting database seeding...')

    await seedAdmin()
    console.log('✓ Users seeded')

    await seedCategories()
    console.log('✓ Categories and subcategories seeded')

    await seedProducts()
    console.log('✓ Products seeded')

    await seedWarehouses()
    console.log('✓ Warehouses seeded')

    await seedInventory()
    console.log('✓ Inventory seeded')

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