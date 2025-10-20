import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from './auth';
import { Session as NextAuthSession } from 'next-auth';

export async function requireAuth(callback?: (session: NextAuthSession) => boolean) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    if (callback && !callback(session)) {
        return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }

    return { session };
}

export async function requireAdmin() {
    return requireAuth((session) => session.user.role === 'ADMIN');
}