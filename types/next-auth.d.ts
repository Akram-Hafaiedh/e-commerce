// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        name: string;
        email: string;
        role: 'USER' | 'ADMIN';
        createdAt: string;
        updatedAt: string;
        address?: string | null;
        avatar?: string | null;
        isActive: boolean;
        lastLogin?: string | null;
        phone?: string | null;
    }

    interface Session {
        user: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: 'USER' | 'ADMIN';
        createdAt: string;
        updatedAt: string;
        address?: string | null;
        avatar?: string | null;
        isActive: boolean;
        lastLogin?: string | null;
        phone?: string | null;
    }
}