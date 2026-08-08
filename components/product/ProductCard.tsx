'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Check, Eye } from 'lucide-react';
import { useStore } from '@/lib/store';

export interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    category: string;
    images: string; // JSON array or array
    featured?: boolean;
    variants?: {
      id: string;
      size: string;
      color: string;
      colorHex?: string | null;
      stock: number;
    }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Parse images securely
  let imageList: string[] = [];
  try {
    imageList = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  } catch {
    imageList = ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop'];
  }

  const primaryImage = imageList[0] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop';
  const secondaryImage = imageList[1] || primaryImage;

  // Calculate total stock across variants
  const variants = product.variants || [];
  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Default to first variant with available stock, or first variant
    const defaultVariant = variants.find((v) => v.stock > 0) || variants[0] || {
      id: 'default',
      size: 'M',
      color: 'Charcoal',
      stock: 10,
    };

    addToCart({
      productId: product.id,
      variantId: defaultVariant.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      size: defaultVariant.size,
      color: defaultVariant.color,
      imageUrl: primaryImage,
      quantity: 1,
      maxStock: defaultVariant.stock || 10,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      category: product.category,
      imageUrl: primaryImage,
    });
  };

  return (
    <div
      className="group relative bg-white border border-gray-200/80 rounded-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:border-gray-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={isHovered ? secondaryImage : primaryImage}
            alt={product.title}
            fill
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-[#111827] text-[#C5A880] rounded-xs shadow-sm">
              Sale
            </span>
          )}
          {product.featured && (
            <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-[#C5A880] text-[#111827] rounded-xs shadow-sm">
              Featured
            </span>
          )}
          {totalStock <= 0 ? (
            <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-red-600 text-white rounded-xs">
              Out of Stock
            </span>
          ) : totalStock < 5 ? (
            <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-amber-500 text-white rounded-xs">
              Only {totalStock} Left
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-gray-700 hover:text-red-500 hover:bg-white transition-all shadow-sm z-10"
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Quick Add Overlay Bar */}
        <div className="absolute inset-x-3 bottom-3 transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 flex gap-2">
          <button
            onClick={handleQuickAdd}
            disabled={totalStock <= 0}
            className="flex-1 py-2.5 bg-[#111827] text-white text-[11px] uppercase tracking-widest font-semibold rounded-xs hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
              </>
            )}
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="p-2.5 bg-white text-[#111827] rounded-xs hover:bg-gray-100 transition-colors flex items-center justify-center shadow-md"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Details Footer */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
            {product.category}
          </span>
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-xs font-semibold text-[#111827] hover:text-[#C5A880] transition-colors line-clamp-1 mt-0.5">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & Variant previews */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-[#111827]">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Color Dots Preview */}
          {variants.length > 0 && (
            <div className="flex items-center -space-x-1">
              {variants.slice(0, 3).map((v, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full border border-white shadow-xs inline-block"
                  style={{ backgroundColor: v.colorHex || '#111827' }}
                  title={v.color}
                />
              ))}
              {variants.length > 3 && (
                <span className="text-[9px] text-gray-400 pl-1">+{variants.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
