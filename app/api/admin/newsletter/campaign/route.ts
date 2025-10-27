import { requireAdmin } from '@/lib/api-auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const { title, message } = await request.json();

        // Get all active subscribers
        const activeSubscribers = await prisma.subscriber.findMany({
            where: { isActive: true },
            select: { email: true },
        });

        // Send emails (using your email service)
        // Example with Resend:
        /*
        const emails = activeSubscribers.map(s => s.email);
        await resend.emails.send({
          from: 'newsletter@yourstore.com',
          to: emails,
          subject: title,
          html: `<h1>${title}</h1><p>${message}</p>`,
        });
        */

        // For now, just log it
        console.log(`Campaign "${title}" sent to ${activeSubscribers.length} subscribers`);

        // Save campaign to database (optional)
        await prisma.campaign.create({
            data: {
                title,
                message,
                recipientCount: activeSubscribers.length,
                sentAt: new Date(),
            },
        });

        return NextResponse.json(
            {
                message: `Campaign sent to ${activeSubscribers.length} subscribers`,
                count: activeSubscribers.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending campaign:', error);
        return NextResponse.json(
            { error: 'Failed to send campaign' },
            { status: 500 }
        );
    }
}