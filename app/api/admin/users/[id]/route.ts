import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                // avatar: true,
                phone: true,
                address: true,
                isActive: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
                orders: {
                    include: {
                        items: {
                            include: {
                                product: {
                                    select: {
                                        name: true,
                                        price: true,
                                        image: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 10, // Limit recent orders
                },
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {

        const auth = await requireAdmin();
        const session = await getServerSession(authOptions);
        if (auth.error || !session) {
            return auth.error;
        }

        const body = await request.json();
        const { id } = await params;
        const { name, role, phone, address, isActive } = body;

        // Prevent admin from modifying their own role
        if (session.user.id === id && role && role !== session.user.role) {
            return NextResponse.json(
                { error: 'Cannot change your own role' },
                { status: 400 }
            );
        }

        const user = await prisma.user.update({
            where: { id: id },
            data: {
                name,
                role,
                phone,
                address,
                isActive,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                address: true,
                isActive: true,
                updatedAt: true,
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await requireAdmin();
        const session = await getServerSession(authOptions);
        if (auth.error || !session) {
            return auth.error;
        }

        const { id } = await params;

        if (session.user.id === id) {
            return NextResponse.json(
                { error: 'Cannot delete your own account' },
                { status: 400 }
            );
        }

        // Soft delete - set isActive to false
        await prisma.user.update({
            where: { id },
            data: {
                isActive: false,
            },
        });

        return NextResponse.json({ message: 'User deactivated successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}