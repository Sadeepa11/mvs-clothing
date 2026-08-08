'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Check, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { updateOrderStatus } from '@/lib/actions';

interface OrderManagementProps {
  initialOrders: any[];
}

export default function OrderManagement({ initialOrders }: OrderManagementProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders =
    statusFilter === 'All'
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === statusFilter.toLowerCase());

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders(
          orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Error updating order:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Tabs */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#C5A880]" /> Customer Orders Portal
            </h1>
            <p className="text-xs text-gray-500">
              Track customer purchases, update fulfillment status, and inspect shipping addresses.
            </p>
          </div>
          <div className="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded">
            Total Orders: {orders.length}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-full transition-all ${
                statusFilter === s
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] uppercase tracking-wider text-gray-500 border-b">
              <tr>
                <th className="p-4 font-semibold">Order Ref</th>
                <th className="p-4 font-semibold">Customer Details</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold">Total Amount</th>
                <th className="p-4 font-semibold">Fulfillment Status</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No customer orders found in status "{statusFilter}".
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;

                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#111827]">
                          {order.orderNumber}
                          <div className="text-[10px] text-gray-400 font-sans font-normal mt-0.5">
                            {new Date(order.createdAt).toLocaleString()}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-bold text-gray-900">{order.customerName}</div>
                          <div className="text-gray-500 text-[11px]">{order.customerEmail}</div>
                          <div className="text-gray-400 text-[10px] truncate max-w-xs">
                            {order.shippingAddress}, {order.city}
                          </div>
                        </td>

                        <td className="p-4 text-gray-700">
                          {order.items?.length || 0} product(s)
                        </td>

                        <td className="p-4 font-bold text-gray-900">
                          ${order.total.toFixed(2)}
                        </td>

                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={updatingId === order.id}
                            className={`p-1.5 text-[11px] font-bold uppercase tracking-wider rounded border cursor-pointer ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : order.status === 'Shipped'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : order.status === 'Processing'
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 rounded">
                            {order.paymentStatus} ({order.paymentMethod})
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <button
                            onClick={() => toggleExpand(order.id)}
                            className="p-1 text-gray-500 hover:text-black"
                          >
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Order Items Row */}
                      {isExpanded && (
                        <tr className="bg-gray-50/90">
                          <td colSpan={7} className="p-4 space-y-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b pb-2">
                              Order Items Summary
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {order.items?.map((item: any) => (
                                <div
                                  key={item.id}
                                  className="flex gap-3 bg-white p-3 rounded border border-gray-200 text-xs"
                                >
                                  {item.imageUrl && (
                                    <div className="relative w-12 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0 border">
                                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                                    </div>
                                  )}
                                  <div className="flex-1 space-y-0.5">
                                    <div className="font-bold text-gray-900">{item.title}</div>
                                    <div className="text-[11px] text-gray-500">
                                      Size: {item.size} • Color: {item.color}
                                    </div>
                                    <div className="font-semibold text-gray-800">
                                      ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="pt-2 text-xs text-gray-600 flex justify-between">
                              <span>Shipping Address: <strong>{order.shippingAddress}, {order.city} {order.postalCode}, {order.country}</strong></span>
                              <span>Subtotal: ${order.subtotal.toFixed(2)} | Tax: ${order.tax.toFixed(2)}</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
