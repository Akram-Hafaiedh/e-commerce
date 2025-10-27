import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

// GET all subscribers
export async function GET() {
    try {

        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const subscribers = await prisma.subscriber.findMany({
            select: {
                email: true,
                subscribedAt: true,
                unsubscribedAt: true,
                isActive: true,
            },
            orderBy: { subscribedAt: 'desc' },
        });

        return NextResponse.json(subscribers);
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subscribers' },
            { status: 500 }
        );
    }
}

// DELETE subscriber
export async function DELETE(request: NextRequest) {
    try {
        // Add auth check here
        const { email } = await request.json();

        await prisma.subscriber.delete({
            where: { email: email.toLowerCase().trim() },
        });

        return NextResponse.json(
            { message: 'Subscriber deleted' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting subscriber:', error);
        return NextResponse.json(
            { error: 'Failed to delete subscriber' },
            { status: 500 }
        );
    }
}