import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import './globals.css';

export const metadata: Metadata = {
  title: 'MVS Clothing | Modern High-Fashion & Luxury Apparel',
  description: 'Architectural minimalism defined by pure Italian fabrics, immaculate tailoring, and effortless modern luxury.',
  keywords: ['MVS Clothing', 'Luxury Apparel', 'Tailored Overcoats', 'Italian Fabrics', 'Minimalist Fashion'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#F9FAFB] text-[#111827] flex flex-col min-h-screen antialiased">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <CartDrawer />
        <Footer />
      </body>
    </html>
  );
}
