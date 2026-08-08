'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Layers, Plus, Minus, AlertTriangle, Save, Check } from 'lucide-react';
import { updateVariantStock } from '@/lib/actions';

interface InventoryControlProps {
  products: any[];
}

export default function InventoryControl({ products }: InventoryControlProps) {
  // Flatten all variants with parent product information
  const initialVariants = products.flatMap((product: any) => {
    let img = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop';
    try {
      const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      if (parsed[0]) img = parsed[0];
    } catch {}

    return (product.variants || []).map((v: any) => ({
      id: v.id,
      productId: product.id,
      productTitle: product.title,
      category: product.category,
      imageUrl: img,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex,
      stock: v.stock,
    }));
  });

  const [variantsList, setVariantsList] = useState(initialVariants);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successAnimation, setSuccessAnimation] = useState<string | null>(null);

  const handleStockChange = (variantId: string, delta: number) => {
    setVariantsList(
      variantsList.map((v) =>
        v.id === variantId ? { ...v, stock: Math.max(0, v.stock + delta) } : v
      )
    );
  };

  const handleCustomStockInput = (variantId: string, value: number) => {
    setVariantsList(
      variantsList.map((v) =>
        v.id === variantId ? { ...v, stock: Math.max(0, value) } : v
      )
    );
  };

  const handleSaveStock = async (variantId: string, currentStock: number) => {
    setUpdatingId(variantId);
    try {
      const res = await updateVariantStock(variantId, currentStock);
      if (res.success) {
        setSuccessAnimation(variantId);
        setTimeout(() => setSuccessAnimation(null), 1500);
      }
    } catch (err) {
      console.error('Save stock error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const lowStockItems = variantsList.filter((v) => v.stock < 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C5A880]" /> Quick Inventory Adjustment
          </h1>
          <p className="text-xs text-gray-500">
            Real-time stock controls per variant size and color. Adjust values instantly.
          </p>
        </div>

        {lowStockItems.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{lowStockItems.length} variant(s) below 5 units</span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] uppercase tracking-wider text-gray-500 border-b">
              <tr>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Size</th>
                <th className="p-4 font-semibold">Color</th>
                <th className="p-4 font-semibold">Current Stock Level</th>
                <th className="p-4 font-semibold">Status Badge</th>
                <th className="p-4 font-semibold text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {variantsList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No product variants found.
                  </td>
                </tr>
              ) : (
                variantsList.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative w-10 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0 border">
                        <Image src={v.imageUrl} alt={v.productTitle} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 line-clamp-1">{v.productTitle}</div>
                        <div className="text-[10px] text-gray-400 uppercase">{v.category}</div>
                      </div>
                    </td>

                    <td className="p-4 font-bold text-gray-800">
                      <span className="px-2.5 py-1 bg-gray-100 rounded text-[11px]">
                        {v.size}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block shadow-xs"
                          style={{ backgroundColor: v.colorHex || '#111827' }}
                        />
                        <span className="text-gray-700">{v.color}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center border border-gray-300 rounded bg-white w-32">
                        <button
                          onClick={() => handleStockChange(v.id, -1)}
                          className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => handleCustomStockInput(v.id, Number(e.target.value))}
                          className="w-full text-center text-xs font-bold text-gray-900 focus:outline-none"
                        />
                        <button
                          onClick={() => handleStockChange(v.id, 1)}
                          className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    <td className="p-4">
                      {v.stock <= 0 ? (
                        <span className="px-2.5 py-1 text-[10px] uppercase font-bold bg-red-100 text-red-800 rounded">
                          Out of Stock
                        </span>
                      ) : v.stock < 5 ? (
                        <span className="px-2.5 py-1 text-[10px] uppercase font-bold bg-amber-100 text-amber-800 rounded">
                          Low Stock ({v.stock})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 rounded">
                          In Stock ({v.stock})
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleSaveStock(v.id, v.stock)}
                        disabled={updatingId === v.id}
                        className="px-3 py-1.5 bg-[#111827] text-white text-[11px] uppercase font-bold tracking-wider rounded hover:bg-gray-800 transition-colors inline-flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                      >
                        {successAnimation === v.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Saved
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 text-[#C5A880]" /> Save
                          </>
                        )}
                      </button>
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
