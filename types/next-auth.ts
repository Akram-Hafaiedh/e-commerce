import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        role: string;
        createdAt: string
    }

    interface Session {
        user: {
            id: string;
            role: string;
            createdAt?: Date;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role?: string;
        createdAt?: string
    }
}