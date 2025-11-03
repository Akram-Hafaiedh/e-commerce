// app/api/orders/lookup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { email, orderNumber } = await request.json();

        if (!email || !orderNumber) {
            return NextResponse.json(
                { error: 'Email and order number are required' },
                { status: 400 }
            );
        }

        // Find orders by email (both user orders and guest orders) and order number
        const orders = await prisma.order.findMany({
            where: {
                OR: [
                    // Guest orders
                    {
                        email: email.toLowerCase(),
                        orderNumber: orderNumber.toUpperCase()
                    },
                    // User orders
                    {
                        user: {
                            email: email.toLowerCase()
                        },
                        orderNumber: orderNumber.toUpperCase()
                    }
                ]
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Don't reveal whether an email exists in the system
        if (orders.length === 0) {
            return NextResponse.json(
                { error: 'No orders found with the provided information' },
                { status: 404 }
            );
        }

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Order lookup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}