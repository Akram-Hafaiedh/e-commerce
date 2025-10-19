import { User as NextAuthUser } from "next-auth";

export interface User extends NextAuthUser {
    id: string;
    name: string | null;
    email: string;
    // image?: string;
    role: 'USER' | 'ADMIN' | string;
    createdAt: string;
}

export interface UserInDB extends User {
    password: string; // Hashed password
}


export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    name: string;
}