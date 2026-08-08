import React from 'react';
import InventoryControl from '@/components/admin/InventoryControl';
import { getProducts } from '@/lib/actions';

export const revalidate = 0;

export default async function AdminInventoryPage() {
  const result = await getProducts();
  const products = result.data || [];

  return <InventoryControl products={products} />;
}
