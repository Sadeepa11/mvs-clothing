'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Layers, Store, Shield } from 'lucide-react';
import MvsLogo from '@/components/branding/MvsLogo';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Analytics Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products Catalog', href: '/admin/products', icon: Package },
    { name: 'Customer Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Inventory Control', href: '/admin/inventory', icon: Layers },
  ];

  return (
    <aside className="w-64 bg-[#111827] text-white min-h-screen flex flex-col justify-between p-6 border-r border-gray-800 flex-shrink-0">
      <div className="space-y-8">
        {/* Logo Header */}
        <div className="flex flex-col items-start gap-2 border-b border-gray-800 pb-6">
          <MvsLogo variant="light" size="md" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880] flex items-center gap-1 mt-1">
            <Shield className="w-3 h-3" /> Staff Executive Panel
          </span>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-md text-xs uppercase tracking-wider font-semibold transition-all ${
                  isActive
                    ? 'bg-[#C5A880] text-[#111827] shadow-md'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to Public Storefront */}
      <div className="pt-6 border-t border-gray-800">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-800 text-gray-200 hover:text-white hover:bg-gray-700 text-xs font-semibold uppercase tracking-wider rounded transition-colors"
        >
          <Store className="w-4 h-4 text-[#C5A880]" /> Return to Storefront
        </Link>
      </div>
    </aside>
  );
}
