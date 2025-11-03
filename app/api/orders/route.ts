import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderItem } from "@/types/order";


export async function GET(req: NextRequest) {
    try {
        const email = req.nextUrl.searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }

        const orders = await prisma.order.findMany({
            where: { email: email },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            items,
            subtotal,
            shippingCost,
            tax,
            total,
            shippingFirstName,
            shippingLastName,
            shippingAddress,
            shippingCity,
            shippingZipCode,
            shippingCountry,
            paymentCardEnding,
            paymentExpiryDate,
            email,
            userId, // Optional - only for logged-in users
        } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in order' }, { status: 400 });
        }

        // Generate order number (better format)
        const year = new Date().getFullYear();
        const count = await prisma.order.count({
            where: {
                orderNumber: { startsWith: `ORD-${year}-` }
            }
        });
        const orderNumber = `ORD-${year}-${String(count + 1).padStart(6, '0')}`;

        // Create order with items
        const order = await prisma.order.create({
            data: {
                orderNumber,
                email,

                status: 'PROCESSING',
                paymentStatus: 'PAID',

                subtotal: subtotal || total,
                shippingCost: shippingCost || 0,
                tax: tax || 0,
                discount: 0,
                total,

                shippingFirstName,
                shippingLastName,
                shippingAddress,
                shippingCity,
                shippingZipCode,
                shippingCountry,

                paymentMethod: 'card',
                paymentCardEnding,
                paymentExpiryDate,
                paidAt: new Date(),

                userId: userId || null,

                items: {
                    create: items.map((item: OrderItem) => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                        price: item.product.price,
                        productName: item.product.name,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}  