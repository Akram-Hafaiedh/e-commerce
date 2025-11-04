
export interface User {
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