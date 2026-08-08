'use client';

import React from 'react';
import Link from 'next/link';
import { DollarSign, ShoppingBag, Package, AlertTriangle, ArrowUpRight, TrendingUp } from 'lucide-react';

interface AnalyticsOverviewProps {
  analytics: {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    totalStock: number;
    lowStockCount: number;
    recentOrders: any[];
  };
}

export default function AnalyticsOverview({ analytics }: AnalyticsOverviewProps) {
  const statCards = [
    {
      title: 'Gross Revenue',
      value: `$${analytics.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: '+14.8% vs last month',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Total Customer Orders',
      value: analytics.totalOrders,
      change: 'Active demand',
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Active Products',
      value: analytics.totalProducts,
      change: 'In catalog',
      icon: Package,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      title: 'Total Stock / Low Stock',
      value: `${analytics.totalStock} units`,
      change: `${analytics.lowStockCount} items < 5 in stock`,
      icon: AlertTriangle,
      color: analytics.lowStockCount > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-700 border-gray-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-[#111827] text-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-gray-400">
            Real-time revenue metrics, order dispatch management, and catalog inventory controls.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="px-4 py-2 bg-[#C5A880] text-[#111827] text-xs uppercase tracking-widest font-bold rounded hover:bg-[#b3946b] transition-colors flex items-center gap-1.5"
        >
          + Add New Product
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-lg border bg-white shadow-sm flex flex-col justify-between space-y-4`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                  {card.title}
                </span>
                <div className={`p-2 rounded-full border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-600 inline" /> {card.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#111827]">
              Recent Orders Feed
            </h3>
            <p className="text-xs text-gray-500">Latest customer transactions and fulfillment states.</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-wider font-semibold text-[#C5A880] hover:underline flex items-center gap-1"
          >
            View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] uppercase tracking-wider text-gray-500 border-b">
              <tr>
                <th className="p-3 font-semibold">Order ID</th>
                <th className="p-3 font-semibold">Customer</th>
                <th className="p-3 font-semibold">Items</th>
                <th className="p-3 font-semibold">Total</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {analytics.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-400">
                    No recent orders found.
                  </td>
                </tr>
              ) : (
                analytics.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#111827]">
                      {order.orderNumber}
                    </td>
                    <td className="p-3">
                      <div className="text-gray-900 font-semibold">{order.customerName}</div>
                      <div className="text-gray-400 text-[11px]">{order.customerEmail}</div>
                    </td>
                    <td className="p-3 text-gray-600">
                      {order.items?.length || 1} item(s)
                    </td>
                    <td className="p-3 font-bold text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Processing'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500 font-mono text-[11px]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
