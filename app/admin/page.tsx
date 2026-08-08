import React from 'react';
import AnalyticsOverview from '@/components/admin/AnalyticsOverview';
import { getAnalyticsOverview } from '@/lib/actions';

export const revalidate = 0; // dynamic admin metrics

export default async function AdminDashboardPage() {
  const result = await getAnalyticsOverview();
  const analytics = result.data || {
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalStock: 0,
    lowStockCount: 0,
    recentOrders: [],
  };

  return <AnalyticsOverview analytics={analytics} />;
}
