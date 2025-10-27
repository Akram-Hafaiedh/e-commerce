import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'Already subscribed with this email' },
          { status: 400 }
        );
      } else {
        // Reactivate if previously unsubscribed
        await prisma.subscriber.update({
          where: { email: normalizedEmail },
          data: { isActive: true, subscribedAt: new Date() },
        });
        return NextResponse.json(
          { message: 'Successfully resubscribed!' },
          { status: 200 }
        );
      }
    }

    // Create new subscriber
    await prisma.subscriber.create({
      data: {
        email: normalizedEmail,
        isActive: true,
        subscribedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}