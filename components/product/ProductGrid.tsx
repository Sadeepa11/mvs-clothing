'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, X, RefreshCw } from 'lucide-react';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: any[];
  currentCategory?: string;
  currentSort?: string;
  currentSearch?: string;
}

export default function ProductGrid({
  products,
  currentCategory = 'All',
  currentSort = 'newest',
  currentSearch = '',
}: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [selectedSort, setSelectedSort] = useState(currentSort);
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const categories = ['All', 'Men', 'Women', 'Accessories', 'Sale'];

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    updateQueryParams({ category: cat === 'All' ? undefined : cat });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedSort(val);
    updateQueryParams({ sort: val });
  };

  const updateQueryParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val) {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });
    router.push(`/catalog?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedSort('newest');
    setMaxPrice(600);
    router.push('/catalog');
  };

  // Filter products locally by max price if needed
  const filteredProducts = products.filter((p) => p.price <= maxPrice);

  return (
    <div className="space-y-8">
      {/* Top Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-full transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:text-[#111827] border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right Sort & Filters trigger */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Active Search Badge */}
          {currentSearch && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A880]/15 text-[#111827] text-xs rounded-full border border-[#C5A880]/30">
              <span>Query: "{currentSearch}"</span>
              <button onClick={() => updateQueryParams({ search: undefined })}>
                <X className="w-3.5 h-3.5 hover:text-red-600" />
              </button>
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="relative flex items-center bg-white border border-gray-200 rounded px-3 py-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 mr-2" />
            <select
              value={selectedSort}
              onChange={handleSortChange}
              className="bg-transparent text-gray-800 font-medium focus:outline-none cursor-pointer pr-2"
            >
              <option value="newest">Sort: Newest Arrivals</option>
              <option value="price-asc">Sort: Price Low to High</option>
              <option value="price-desc">Sort: Price High to Low</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          </button>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className={`md:block space-y-6 ${showFiltersMobile ? 'block' : 'hidden'} bg-white md:bg-transparent p-6 md:p-0 rounded-lg border md:border-none shadow-md md:shadow-none`}>
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#111827] flex items-center justify-between">
              <span>Refine Catalog</span>
              {(selectedCategory !== 'All' || currentSearch || maxPrice < 600) && (
                <button
                  onClick={handleClearFilters}
                  className="text-[10px] text-[#C5A880] hover:underline font-normal flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              )}
            </h3>

            {/* Price Filter */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex justify-between text-xs font-medium text-gray-700">
                <span>Max Price:</span>
                <span className="font-semibold text-[#111827]">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="600"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#111827] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>$50</span>
                <span>$300</span>
                <span>$600+</span>
              </div>
            </div>

            {/* Category Quick Selector list */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">
                Departments
              </span>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCategoryChange(c)}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                    selectedCategory === c
                      ? 'bg-gray-100 font-semibold text-[#111827]'
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  <span>{c}</span>
                  {selectedCategory === c && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center space-y-4">
              <p className="text-sm font-semibold text-gray-900">No products match your criteria</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try expanding your price range or switching categories to view more pieces.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 bg-[#111827] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-gray-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
