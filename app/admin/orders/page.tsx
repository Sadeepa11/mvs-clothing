import React from 'react';
import OrderManagement from '@/components/admin/OrderManagement';
import { getOrders } from '@/lib/actions';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const result = await getOrders();
  const orders = result.data || [];

  return <OrderManagement initialOrders={orders} />;
}
