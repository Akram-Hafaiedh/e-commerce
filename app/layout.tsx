// app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from './context/CartContext';
import { Analytics } from "@vercel/analytics/next"
import { ToastProvider } from './context/ToastContext';
import { Providers } from './providers/providers';
import LayoutContent from './components/layout/LayoutContent';

export const metadata: Metadata = {
  title: 'Ecommerce Store',
  description: 'A modern ecommerce store built with Next.js',
  appleWebApp: {
    title: 'ShopStore',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <ToastProvider>
            <CartProvider>
              <LayoutContent>{children}</LayoutContent>
              <Analytics />
            </CartProvider>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}