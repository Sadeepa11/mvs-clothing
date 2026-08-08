import React from 'react';
import ProductManagement from '@/components/admin/ProductManagement';
import { getProducts } from '@/lib/actions';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const result = await getProducts();
  const products = result.data || [];

  return <ProductManagement initialProducts={products} />;
}
