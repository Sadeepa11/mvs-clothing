import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin Portal | MVS Clothing Executive Suite',
  description: 'Manage store catalog, customer orders, and live inventory metrics.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <AdminSidebar />
      <main className="flex-1 p-8 max-w-7xl mx-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
