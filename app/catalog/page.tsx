import React from 'react';
import ProductGrid from '@/components/product/ProductGrid';
import { getProducts } from '@/lib/actions';

export const revalidate = 60;

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category || 'All';
  const sort = resolvedSearchParams.sort || 'newest';
  const search = resolvedSearchParams.search || '';

  const minPrice = resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined;

  const result = await getProducts({
    category,
    sort,
    search,
    minPrice,
    maxPrice,
  });

  const products = result.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header Title */}
      <div className="space-y-2 text-center sm:text-left border-b border-gray-200 pb-6">
        <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold">
          MVS Ready-To-Wear
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#111827]">
          {category === 'All' ? 'Complete Collection Catalog' : `${category} Collection`}
        </h1>
        <p className="text-xs text-gray-500 max-w-xl">
          Discover structured overcoats, silk garments, Supima fleece, and handcrafted Italian accessories.
        </p>
      </div>

      {/* Main Grid Component */}
      <ProductGrid
        products={products}
        currentCategory={category}
        currentSort={sort}
        currentSearch={search}
      />
    </div>
  );
}
