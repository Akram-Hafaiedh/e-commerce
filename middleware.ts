import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    async function middleware(req) {
        if (req.nextUrl.pathname.startsWith('/admin')) {
            if (req.nextauth.token?.role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/auth/login', req.url));
            }
        }
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized({ token, req }) {
                if (req.nextUrl.pathname.startsWith('/admin')) {
                    return !!token
                }
                return true;
            }
        }
    }
)

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*',
        '/api/categories/:path*',
        '/api/products/:path*',
    ],
}