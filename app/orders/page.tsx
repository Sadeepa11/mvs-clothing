import React from 'react';
import Link from 'next/link';
import { ShoppingCart, PackageCheck, Search } from 'lucide-react';
import { getOrders } from '@/lib/actions';

export const revalidate = 10;

interface OrdersPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function CustomerOrdersPage({ searchParams }: OrdersPageProps) {
  const { email } = await searchParams;
  const res = await getOrders();
  const allOrders = res.data || [];

  const filteredOrders = email
    ? allOrders.filter((o: any) => o.customerEmail.toLowerCase().includes(email.toLowerCase()))
    : allOrders;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-gray-200 pb-6 space-y-1">
        <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold">
          Client Services
        </span>
        <h1 className="text-3xl font-bold uppercase tracking-tight text-[#111827]">
          Order Tracking & History
        </h1>
      </div>

      {/* Lookup Form */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-xs uppercase tracking-wider font-bold text-gray-800">
          Find Your Order by Email
        </h3>
        <form className="flex gap-3">
          <input
            type="email"
            name="email"
            defaultValue={email || ''}
            placeholder="Enter your customer email (e.g. sophia@example.com)"
            className="flex-1 px-4 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded focus:outline-none focus:border-[#C5A880]"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#111827] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Lookup Orders
          </button>
        </form>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500 text-xs">
            No orders found matching "{email}". Please check your email address or view sample orders.
          </div>
        ) : (
          filteredOrders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between border-b border-gray-100 pb-4 gap-2">
                <div>
                  <span className="text-xs text-gray-400 font-mono">Order #{order.orderNumber}</span>
                  <h3 className="text-sm font-bold text-gray-900 mt-0.5">{order.customerName}</h3>
                </div>
                <div className="sm:text-right">
                  <span
                    className={`inline-block px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Status: {order.status}
                  </span>
                  <div className="text-xs text-gray-500 font-mono mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-gray-900">{item.title}</span>
                      <span className="text-gray-500 text-[11px] block">
                        Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                <span className="text-gray-500">
                  Shipping Address: <strong className="text-gray-800">{order.shippingAddress}, {order.city}</strong>
                </span>
                <div className="text-sm font-bold text-[#111827]">
                  Total: <span className="text-[#C5A880]">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
