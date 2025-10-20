import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma, UserRole } from '@prisma/client';
import { requireAdmin } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search');
        const role = searchParams.get('role');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.UserWhereInput = {
            isActive: true, // Only show active users by default
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (role && role !== 'ALL' && role in UserRole) {
            where.role = role as UserRole;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    avatar: true,
                    phone: true,
                    isActive: true,
                    lastLogin: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            orders: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            prisma.user.count({ where }),
        ]);

        return NextResponse.json({
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const auth = await requireAdmin();
        if (auth.error) {
            return auth.error;
        }

        const body = await request.json();
        const { email, name, role, phone, address } = body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // In a real app, you'd generate a temporary password and send it via email
        const temporaryPassword = 'temp123'; // You should generate a secure random password

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                role: role || 'USER',
                phone,
                address,
                password: temporaryPassword, // In real app, hash this password
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                isActive: true,
                createdAt: true,
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}