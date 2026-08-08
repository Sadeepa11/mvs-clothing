'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, X, Loader2, Check, Sparkles } from 'lucide-react';
import { createProduct, updateProduct, deleteProduct } from '@/lib/actions';

interface ProductManagementProps {
  initialProducts: any[];
}

export default function ProductManagement({ initialProducts }: ProductManagementProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: 'Men',
    featured: false,
    images: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop',
    fabric: '85% Virgin Wool, 15% Cashmere',
    care: 'Dry clean only.',
    shipping: 'Complimentary express shipping.',
    variants: [
      { size: 'S', color: 'Deep Charcoal', colorHex: '#111827', stock: 10 },
      { size: 'M', color: 'Deep Charcoal', colorHex: '#111827', stock: 15 },
      { size: 'L', color: 'Deep Charcoal', colorHex: '#111827', stock: 12 },
    ],
  });

  const categories = ['Men', 'Women', 'Accessories', 'Sale'];

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      compareAtPrice: '',
      category: 'Men',
      featured: false,
      images: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop',
      fabric: '85% Virgin Wool, 15% Cashmere',
      care: 'Dry clean only.',
      shipping: 'Complimentary express shipping.',
      variants: [
        { size: 'S', color: 'Deep Charcoal', colorHex: '#111827', stock: 10 },
        { size: 'M', color: 'Deep Charcoal', colorHex: '#111827', stock: 15 },
        { size: 'L', color: 'Deep Charcoal', colorHex: '#111827', stock: 12 },
      ],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    let imgList = [];
    try {
      imgList = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    } catch {
      imgList = [product.images];
    }

    let details = { fabric: '', care: '', shipping: '' };
    try {
      if (product.details) details = JSON.parse(product.details);
    } catch {}

    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice ? product.compareAtPrice.toString() : '',
      category: product.category,
      featured: product.featured || false,
      images: imgList.join('\n'),
      fabric: details.fabric || '',
      care: details.care || '',
      shipping: details.shipping || '',
      variants: product.variants?.map((v: any) => ({
        id: v.id,
        size: v.size,
        color: v.color,
        colorHex: v.colorHex || '#111827',
        stock: v.stock,
      })) || [],
    });
    setIsModalOpen(true);
  };

  const handleAddVariantRow = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { size: 'M', color: 'Off-White', colorHex: '#F9FAFB', stock: 10 },
      ],
    });
  };

  const handleRemoveVariantRow = (index: number) => {
    const updated = [...formData.variants];
    updated.splice(index, 1);
    setFormData({ ...formData, variants: updated });
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, variants: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const imageUrls = formData.images
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct.id, {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
          category: formData.category,
          featured: formData.featured,
          images: imageUrls,
          details: { fabric: formData.fabric, care: formData.care, shipping: formData.shipping },
          variants: formData.variants,
        });

        if (res.success) {
          setIsModalOpen(false);
          window.location.reload();
        }
      } else {
        const res = await createProduct({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
          category: formData.category,
          featured: formData.featured,
          images: imageUrls,
          details: { fabric: formData.fabric, care: formData.care, shipping: formData.shipping },
          variants: formData.variants,
        });

        if (res.success) {
          setIsModalOpen(false);
          window.location.reload();
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const res = await deleteProduct(id);
    if (res.success) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-lg font-bold uppercase tracking-wider text-[#111827]">
            Product Management
          </h1>
          <p className="text-xs text-gray-500">
            Create, edit, or delete clothing items, image galleries, and sizes.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-[#111827] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#C5A880]" /> Add New Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] uppercase tracking-wider text-gray-500 border-b">
              <tr>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Total Stock</th>
                <th className="p-4 font-semibold">Variants</th>
                <th className="p-4 font-semibold">Featured</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No products in database. Click "Add New Product" to seed your catalog.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  let img = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop';
                  try {
                    const parsed = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
                    if (parsed[0]) img = parsed[0];
                  } catch {}

                  const totalStock = p.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0;

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="relative w-12 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0 border">
                          <Image src={img} alt={p.title} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{p.title}</div>
                          <div className="text-[11px] font-mono text-gray-400">{p.slug}</div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-800 rounded">
                          {p.category}
                        </span>
                      </td>

                      <td className="p-4 font-semibold text-gray-900">
                        ${p.price.toFixed(2)}
                        {p.compareAtPrice && (
                          <span className="text-gray-400 text-[11px] line-through block font-normal">
                            ${p.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            totalStock > 10
                              ? 'text-emerald-700'
                              : totalStock > 0
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }`}
                        >
                          {totalStock} units
                        </span>
                      </td>

                      <td className="p-4 text-gray-600">
                        {p.variants?.length || 0} variant(s)
                      </td>

                      <td className="p-4">
                        {p.featured ? (
                          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-[#C5A880] text-[#111827] rounded">
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-gray-700 hover:text-black hover:bg-gray-100 rounded transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden my-8 border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-[#111827] text-white flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
                {editingProduct ? 'Edit Product Details' : 'Create New Luxury Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded focus:border-[#C5A880] focus:outline-none"
                    placeholder="e.g. Architectural Wool Overcoat"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded focus:border-[#C5A880] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded focus:border-[#C5A880] focus:outline-none"
                    placeholder="495.00"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    Compare At Price ($) (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded focus:border-[#C5A880] focus:outline-none"
                    placeholder="580.00"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:border-[#C5A880] focus:outline-none"
                  placeholder="Engineered from double-faced Italian cashmere-wool blend..."
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-gray-700 mb-1">
                  Image URLs (One URL per line) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded font-mono text-[11px] focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="accent-[#111827] w-4 h-4"
                />
                <label htmlFor="featured" className="uppercase tracking-wider font-semibold text-gray-800">
                  Feature this item on homepage hero/showcase
                </label>
              </div>

              {/* Variants Builder */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold uppercase tracking-wider text-gray-900">
                    Product Variants (Size, Color & Stock)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="px-3 py-1 text-[11px] uppercase font-bold bg-[#C5A880] text-gray-900 rounded hover:bg-[#b3946b]"
                  >
                    + Add Variant Row
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.variants.map((v, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded border">
                      <div className="w-24">
                        <label className="text-[10px] text-gray-500 block">Size</label>
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                          className="w-full p-1 bg-white border rounded text-xs"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] text-gray-500 block">Color Name</label>
                        <input
                          type="text"
                          value={v.color}
                          onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                          className="w-full p-1 bg-white border rounded text-xs"
                        />
                      </div>
                      <div className="w-24">
                        <label className="text-[10px] text-gray-500 block">Color Hex</label>
                        <input
                          type="text"
                          value={v.colorHex || ''}
                          onChange={(e) => handleVariantChange(idx, 'colorHex', e.target.value)}
                          className="w-full p-1 bg-white border rounded text-xs font-mono"
                        />
                      </div>
                      <div className="w-20">
                        <label className="text-[10px] text-gray-500 block">Stock Qty</label>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => handleVariantChange(idx, 'stock', Number(e.target.value))}
                          className="w-full p-1 bg-white border rounded text-xs font-bold text-gray-900"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariantRow(idx)}
                        className="mt-4 p-1 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded uppercase font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#111827] text-white rounded uppercase font-semibold hover:bg-gray-800 inline-flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 text-[#C5A880]" />}
                  {editingProduct ? 'Save Product Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
