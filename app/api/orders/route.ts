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
            where: { guestEmail: email },
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
            total,
            shippingFirstName,
            shippingLastName,
            shippingAddress,
            shippingCity,
            shippingZipCode,
            shippingCountry,
            paymentCardEnding,
            paymentExpiryDate,
            guestEmail,
            userId, // Optional - only for logged-in users
        } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in order' }, { status: 400 });
        }

        // Generate human-readable order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create order with items
        const order = await prisma.order.create({
            data: {
                orderNumber,
                total,
                status: 'PROCESSING',
                shippingFirstName,
                shippingLastName,
                shippingAddress,
                shippingCity,
                shippingZipCode,
                shippingCountry,
                paymentCardEnding,
                paymentExpiryDate,
                guestEmail: guestEmail || null,
                userId: userId || null,
                items: {
                    create: items.map((item: OrderItem) => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                        price: item.product.price,
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