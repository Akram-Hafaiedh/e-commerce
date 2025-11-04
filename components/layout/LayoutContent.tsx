'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');

    return (
        <>
            {!isAdminRoute && <Navbar />}
            <main className={isAdminRoute ? 'admin-layout' : ''}>
                {children}
            </main>
            {!isAdminRoute && <Footer />}
        </>
    );
}