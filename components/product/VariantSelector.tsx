'use client';

import React, { useState } from 'react';
import { ShoppingBag, Heart, Check, Plus, Minus, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';

interface Variant {
  id: string;
  size: string;
  color: string;
  colorHex?: string | null;
  stock: number;
}

interface VariantSelectorProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    category: string;
    images: string;
    variants: Variant[];
  };
}

export default function VariantSelector({ product }: VariantSelectorProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  // Extract unique colors and sizes
  const uniqueColors = Array.from(new Set(product.variants.map((v) => v.color)));
  const uniqueSizes = Array.from(new Set(product.variants.map((v) => v.size)));

  const [selectedColor, setSelectedColor] = useState<string>(
    uniqueColors[0] || 'Default'
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    uniqueSizes[0] || 'M'
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Find exact matching variant
  const activeVariant =
    product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    ) ||
    product.variants.find((v) => v.color === selectedColor) ||
    product.variants[0];

  const currentStock = activeVariant ? activeVariant.stock : 0;

  let imageList: string[] = [];
  try {
    imageList = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  } catch {
    imageList = ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop'];
  }
  const primaryImage = imageList[0] || '';
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const inWishlist = mounted ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!activeVariant || currentStock <= 0) return;

    addToCart({
      productId: product.id,
      variantId: activeVariant.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      imageUrl: primaryImage,
      quantity,
      maxStock: currentStock,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Price Header */}
      <div className="space-y-1 border-b border-gray-200 pb-4">
        <div className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
          {product.category}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
          {product.title}
        </h1>
        <div className="flex items-baseline gap-3 pt-2">
          <span className="text-2xl font-bold text-[#111827]">
            ${product.price.toFixed(2)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-base text-gray-400 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Color Selection */}
      <div className="space-y-3">
        <label className="block text-xs uppercase tracking-widest text-gray-700 font-semibold">
          Color: <span className="text-gray-900 font-bold ml-1">{selectedColor}</span>
        </label>
        <div className="flex items-center gap-3">
          {uniqueColors.map((colorName) => {
            const variantObj = product.variants.find((v) => v.color === colorName);
            const isSelected = selectedColor === colorName;
            return (
              <button
                key={colorName}
                onClick={() => setSelectedColor(colorName)}
                className={`relative w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isSelected ? 'border-[#111827] scale-110 shadow-sm' : 'border-gray-300 hover:border-gray-500'
                }`}
                title={colorName}
              >
                <span
                  className="w-6 h-6 rounded-full inline-block"
                  style={{ backgroundColor: variantObj?.colorHex || '#111827' }}
                />
                {isSelected && (
                  <Check className={`w-3 h-3 absolute ${['#F9FAFB', '#ffffff'].includes(variantObj?.colorHex?.toLowerCase() || '') ? 'text-black' : 'text-white'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <label className="uppercase tracking-widest text-gray-700 font-semibold">
            Size: <span className="text-gray-900 font-bold ml-1">{selectedSize}</span>
          </label>
          <span className="text-[11px] text-[#C5A880] cursor-pointer hover:underline">
            Size Guide
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {uniqueSizes.map((sizeName) => {
            const sizeVariant = product.variants.find(
              (v) => v.size === sizeName && v.color === selectedColor
            );
            const isAvailable = sizeVariant ? sizeVariant.stock > 0 : false;
            const isSelected = selectedSize === sizeName;

            return (
              <button
                key={sizeName}
                onClick={() => setSelectedSize(sizeName)}
                className={`min-w-[48px] h-10 px-3 text-xs font-semibold uppercase tracking-wider rounded-sm border transition-all ${
                  isSelected
                    ? 'bg-[#111827] text-white border-[#111827] shadow-sm'
                    : isAvailable
                    ? 'bg-white text-gray-800 border-gray-300 hover:border-gray-900'
                    : 'bg-gray-100 text-gray-400 border-gray-200 line-through'
                }`}
              >
                {sizeName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Alert Badge */}
      <div className="text-xs">
        {currentStock > 10 ? (
          <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            In Stock — Ships within 24 hours
          </span>
        ) : currentStock > 0 ? (
          <span className="text-amber-700 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            Limited Availability — Only {currentStock} items remaining
          </span>
        ) : (
          <span className="text-red-600 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
            Currently Out of Stock in this combination
          </span>
        )}
      </div>

      {/* Quantity & CTA Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex gap-4">
          {/* Quantity Picker */}
          <div className="flex items-center border border-gray-300 rounded bg-white">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3 text-gray-600 hover:text-black"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 text-xs font-bold text-gray-900">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
              className="p-3 text-gray-600 hover:text-black"
              disabled={quantity >= currentStock}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Bag CTA */}
          <button
            onClick={handleAddToCart}
            disabled={currentStock <= 0}
            className="flex-1 py-3.5 bg-[#111827] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {added ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> Added to Shopping Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() =>
              toggleWishlist({
                id: product.id,
                title: product.title,
                slug: product.slug,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                category: product.category,
                imageUrl: primaryImage,
              })
            }
            className="p-3.5 border border-gray-300 rounded text-gray-700 hover:text-red-500 hover:border-red-300 transition-colors"
            title="Wishlist"
          >
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Guarantee Banner */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A880]" /> 100% Authentic Italian Craftsmanship
          </span>
          <span className="font-mono text-[11px] text-gray-500">FREE RETURNS</span>
        </div>
      </div>
    </div>
  );
}
