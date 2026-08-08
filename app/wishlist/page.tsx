'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto" />
          <div className="h-4 bg-gray-100 rounded w-64 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-gray-200 pb-6 text-center sm:text-left space-y-1">
        <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold">
          Saved Favorites
        </span>
        <h1 className="text-3xl font-bold uppercase tracking-tight text-[#111827]">
          Personal Wishlist ({wishlist.length})
        </h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-16 text-center space-y-4 max-w-lg mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Your Wishlist is Empty</h2>
          <p className="text-xs text-gray-500">
            Save your favorite tailored overcoats, silk pieces, and Italian accessories to revisit anytime.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#111827] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-gray-800 transition-colors"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => toggleWishlist(item)}
                  className="absolute top-3 right-3 p-2 bg-white/80 rounded-full text-red-500 hover:bg-white"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#C5A880]">
                    {item.category}
                  </span>
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="text-xs font-semibold text-gray-900 hover:text-[#C5A880] line-clamp-1">
                      {item.title}
                    </h3>
                  </Link>
                  <div className="text-xs font-bold text-gray-900 mt-1">
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                <Link
                  href={`/product/${item.slug}`}
                  className="w-full py-2.5 bg-[#111827] text-white text-[11px] uppercase tracking-widest font-semibold rounded text-center hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> View Options
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
