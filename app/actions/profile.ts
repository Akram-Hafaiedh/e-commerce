'use server'

import { ComparePassword, HashPassword } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
export async function updateProfile(userId: string, formData: {
    name: string
    email: string
    currentPassword?: string
    confirmPassword?: string
    newPassword?: string
    address?: string
    phone?: string
}) {
    try {

        const existingUser = await prisma.user.findUnique({
            where: { email: formData.email }
        })

        if (existingUser && existingUser.id !== userId) {
            return {
                success: false,
                error: 'Email is already taken by another account'
            }
        }

        if (formData.currentPassword && formData.newPassword) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { password: true }
            })

            if (!user) {
                return { success: false, error: 'User not found' }
            }


            const isCurrentPasswordValid = await ComparePassword(
                formData.currentPassword,
                user.password
            )

            if (!isCurrentPasswordValid) {
                return { success: false, error: 'Current password is incorrect' }
            }

            if (formData.newPassword !== formData.confirmPassword) {
                return { success: false, error: 'New passwords do not match' }
            }

            const hashedPassword = await HashPassword(formData.newPassword)

            await prisma.user.update({
                where: { id: userId },
                data: {
                    name: formData.name,
                    email: formData.email,
                    password: hashedPassword,
                    address: formData.address,
                    phone: formData.phone,
                    updatedAt: new Date(),
                },
            })

            revalidatePath('/profile')

            return { success: true, message: 'Profile and password updated successfully' }
        }

        // Update user without password change
        await prisma.user.update({
            where: { id: userId },
            data: {
                name: formData.name,
                email: formData.email,
                address: formData.address,
                phone: formData.phone,
                updatedAt: new Date(),
            },
        })
        revalidatePath('/profile')
        return { success: true, message: 'Profile updated successfully' }
    } catch (error) {
        console.error('Error updating profile:', error)
        return { success: false, error: 'Failed to update profile' }
    }
}

export async function getOrders(userId: string) {
    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                image: true,
                                slug: true,
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return orders
    } catch (error) {
        console.error('Error fetching orders:', error)
        return []
    }
}


export async function getUserProfile(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                address: true,
                avatar: true,
                isActive: true,
                lastLogin: true,
                phone: true,
            }
        })
        return user
    } catch (error) {
        console.error('Error fetching user profile:', error)
        return null
    }
}