import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        let orders;

        if (session.user.role === 'ADMIN') {
            orders = await prisma.order.findMany({
                include: {
                    items: true,
                    user: true,
                },
            });
        } else {
            orders = await prisma.order.findMany({
                where: { userId: session.user.id },
                include: {
                    items: true,
                },
            })
        }

        return NextResponse.json(orders);

    } catch (error) {

        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Error fetching orders' },
            { status: 500 }
        );
    }
}


export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const orderData = await request.json();

        const order = await prisma.order.create({
            data: {
                ...orderData,
                userId: session.user.id,
            },
            include: {
                items: true
            }
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Error creating order' },
            { status: 500 }
        );
    }
}    