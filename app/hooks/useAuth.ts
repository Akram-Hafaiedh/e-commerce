// hooks/useAuth.ts
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut, SignInResponse } from 'next-auth/react';
import { User, AuthState } from '@/types/auth';

interface UseAuthReturn extends AuthState {
    isAdmin: boolean;
    signIn: (email: string, password: string, redirectTo?: string) => Promise<SignInResponse | undefined>;
    signOut: () => Promise<void>;
    updateSession: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
    const { data: session, status, update } = useSession();

    const user: User | null = session?.user ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        createdAt: session.user.createdAt,
        updatedAt: session.user.updatedAt,
        address: session.user.address,
        avatar: session.user.avatar,
        isActive: session.user.isActive,
        lastLogin: session.user.lastLogin,
        phone: session.user.phone,
    } : null;

    const signIn = async (
        email: string,
        password: string,
        redirectTo?: string
    ): Promise<SignInResponse | undefined> => {
        return nextAuthSignIn('credentials', {
            email,
            password,
            redirect: true,
            callbackUrl: redirectTo || '/'
        });
    };

    const signOut = async (): Promise<void> => {
        await nextAuthSignOut({ callbackUrl: '/auth/login' });
    };

    const updateSession = async (): Promise<void> => {
        await update();
    };


    return {
        user,
        isAuthenticated: !!session,
        isLoading: status === 'loading',
        isAdmin: session?.user?.role === 'ADMIN',
        signIn,
        signOut,
        updateSession,
    };
}