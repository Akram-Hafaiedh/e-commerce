import { authOptions } from "@/lib/auth";
import { ComparePassword, HashPassword } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, email, currentPassword, newPassword } = body;

        const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });

        if (!currentUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const updateData: { name?: string, email?: string, password?: string } = {};

        if (name) {
            updateData.name = name;
        }

        if (email && email !== currentUser.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser && existingUser.id !== currentUser.id) {
                return NextResponse.json(
                    { error: 'Email already in use' },
                    { status: 400 }
                );
            }
            updateData.email = email;
        }

        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json(
                    { error: 'Current password is required to set new password' },
                    { status: 400 }
                );
            }

            const isCurrentPasswordValid = await ComparePassword(currentPassword, currentUser.password);
            if (!isCurrentPasswordValid) {
                return NextResponse.json(
                    { error: 'Current password is incorrect' },
                    { status: 400 }
                );
            }

            updateData.password = await HashPassword(newPassword);
        }

        const updatedUser = await prisma.user.update({
            where: { id: currentUser.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
        });

        return NextResponse.json(
            {
                user: updatedUser,
                message: 'Profile updated successfully'
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Error updating profile' },
            { status: 500 }
        );
    }
}