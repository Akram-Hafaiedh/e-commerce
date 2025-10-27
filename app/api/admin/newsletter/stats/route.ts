import { requireAdmin } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {

        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const totalSubscribers = await prisma.subscriber.count();
        const activeSubscribers = await prisma.subscriber.count({
            where: { isActive: true },
        });
        const unsubscribers = totalSubscribers - activeSubscribers;

        const campaigns = await prisma.campaign.findMany({
            orderBy: { sentAt: 'desc' },
            take: 5,
        });

        return NextResponse.json({
            totalSubscribers,
            activeSubscribers,
            unsubscribers,
            campaigns,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}