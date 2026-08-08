'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Search, Menu, X, ShieldCheck } from 'lucide-react';
import MvsLogo from '@/components/branding/MvsLogo';
import { useStore } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, wishlist, toggleCart, searchQuery, setSearchQuery } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalWishlistItems = wishlist.length;

  const categories = [
    { name: 'New Arrivals', href: '/catalog?sort=newest' },
    { name: 'Men', href: '/catalog?category=Men' },
    { name: 'Women', href: '/catalog?category=Women' },
    { name: 'Accessories', href: '/catalog?category=Accessories' },
    { name: 'Sale', href: '/catalog?category=Sale' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F9FAFB]/90 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-[#111827] text-[#F9FAFB] text-xs py-1.5 px-4 text-center tracking-widest uppercase font-medium flex items-center justify-center gap-2">
        <span>Complimentary Express Shipping on Orders Over $250</span>
        <span className="text-[#C5A880] font-bold">•</span>
        <Link href="/catalog" className="text-[#C5A880] hover:underline underline-offset-4">
          Shop Autumn/Winter '26
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-[#111827] focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-[#C5A880] ${
                  pathname === cat.href ? 'text-[#111827] font-semibold border-b-2 border-[#C5A880] pb-1' : 'text-gray-600'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Logo Center */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <Link href="/" className="group flex items-center gap-2">
              <MvsLogo size="md" variant="dark" />
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-5">
            {/* Quick Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-40 sm:w-56 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-full focus:outline-none focus:border-[#C5A880]"
                  />
                  <button type="submit" className="p-1.5 ml-1 text-gray-700 hover:text-[#111827]">
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 ml-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-700 hover:text-[#C5A880] transition-colors"
                  title="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2 text-gray-700 hover:text-[#C5A880] transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {mounted && totalWishlistItems > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#C5A880] rounded-full">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-[#111827] hover:text-[#C5A880] transition-colors flex items-center"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && totalCartItems > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#111827] rounded-full">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Admin Switch Link */}
            <Link
              href={isAdminRoute ? '/' : '/admin'}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-md border border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {isAdminRoute ? 'Storefront' : 'Admin Panel'}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm uppercase tracking-widest font-medium text-gray-800 hover:text-[#C5A880]"
            >
              {cat.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs uppercase tracking-wider font-semibold text-[#111827] flex items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4" /> Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
