import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        await prisma.subscriber.update({
            where: { email: email.toLowerCase().trim() },
            data: { isActive: false, unsubscribedAt: new Date() },
        });

        return NextResponse.json(
            { message: 'Successfully unsubscribed' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Newsletter unsubscribe error:', error);
        return NextResponse.json(
            { error: 'Failed to unsubscribe' },
            { status: 500 }
        );
    }
}