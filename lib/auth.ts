import { ComparePassword } from "@/lib/auth-utils";

import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { User } from "@/types/auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'email' },
                password: { label: 'Password', type: 'password', placeholder: 'password' },
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) return null;

                const isPasswordValid = await ComparePassword(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    createdAt: user.createdAt.toISOString(),
                };
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger }) {
            console.log('JWT Callback - Trigger:', trigger);

            if (trigger === 'update') {
                console.log('Session update triggered, refetching user...');
                // Fetch fresh user data from database
                const updatedUser = await prisma.user.findUnique({
                    where: { id: token.sub },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    }
                });

                if (updatedUser) {
                    console.log('Updated user data:', updatedUser);
                    return {
                        ...token,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        role: updatedUser.role,
                    };
                }
            }

            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            return token;
        },
        session: async ({ session, token }) => {
            if (token && session.user) {
                session.user.id = token.sub!;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
                session.user.createdAt = token.createdAt as unknown as Date;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/logout',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
};