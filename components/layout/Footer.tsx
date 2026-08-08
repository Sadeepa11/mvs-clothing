'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MvsLogo from '@/components/branding/MvsLogo';

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer completely on Admin panel pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#111827] text-white border-t border-gray-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <MvsLogo variant="light" size="lg" />
            <p className="text-xs text-gray-400 leading-relaxed pt-2">
              Architectural minimalism defined by pure Italian fabrics, immaculate tailoring, and effortless modern luxury.
            </p>
            <div className="pt-2 text-xs text-[#C5A880] font-mono">
              EST. 2026 • MILAN / NEW YORK
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">Collections</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li><Link href="/catalog?category=Men" className="hover:text-white transition-colors">Men's Tailoring</Link></li>
              <li><Link href="/catalog?category=Women" className="hover:text-white transition-colors">Women's Outerwear</Link></li>
              <li><Link href="/catalog?category=Accessories" className="hover:text-white transition-colors">Leather Goods & Accessories</Link></li>
              <li><Link href="/catalog?sort=newest" className="hover:text-white transition-colors">Autumn / Winter '26 Lookbook</Link></li>
              <li><Link href="/catalog?category=Sale" className="hover:text-white transition-colors">Archive Sale</Link></li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">Client Concierge</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li><Link href="/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><span className="text-gray-400 cursor-default">Complimentary Shipping & Returns</span></li>
              <li><span className="text-gray-400 cursor-default">Bespoke Size Guide</span></li>
              <li><span className="text-gray-[#C5A880] cursor-default">concierge@mvsclothing.com</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">The MVS Journal</h4>
            <p className="text-xs text-gray-400">
              Subscribe to receive private preview access, seasonal lookbooks, and invitation-only trunk shows.
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 text-xs bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A880]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs uppercase tracking-wider font-semibold bg-[#C5A880] text-gray-900 hover:bg-[#b3946b] transition-colors"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 MVS Clothing Inc. All Rights Reserved. Crafted with precision.</p>
          <div className="flex space-x-6">
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-300 cursor-pointer">Sustainability Report</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
