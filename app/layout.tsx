import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext';
import { Analytics } from "@vercel/analytics/next"
import { ToastProvider } from './context/ToastContext';
import { Providers } from './providers/providers';

export const metadata: Metadata = {
  title: 'Ecommerce Store',
  description: 'A modern ecommerce store built with Next.js',
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
              <Navbar />
              <main>
                {children}
              </main>
              <Analytics />
            </CartProvider>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}