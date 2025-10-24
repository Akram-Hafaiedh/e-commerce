import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    async function middleware(req) {
        const token = req.nextauth.token;
        
        if (req.nextUrl.pathname.startsWith('/admin')) {
            if (token?.role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/auth/login', req.url));
            }
        }
        
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized({ token, req }) {
                // Only require auth for admin routes
                if (req.nextUrl.pathname.startsWith('/admin')) {
                    return !!token;
                }
                // Allow all other routes
                return true;
            }
        }
    }
);

export const config = {
    matcher: [
        // Only protect admin routes, NOT public API routes
        '/admin/:path*',
        '/api/admin/:path*',
        // Don't include '/api/:path*' here!
    ],
};