import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { orderNumber, email } = await request.json();

        const order = await prisma.order.findFirst({
            where: {
                orderNumber,
                email: {
                    equals: email,
                    mode: 'insensitive' // Case-insensitive
                }
            },
            select: { id: true }
        });

        if (order) {
            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { success: false, error: 'Order not found' },
            { status: 404 }
        );
    } catch (error) {
        console.error('Order verification error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}