'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart } = useStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 250 || subtotal === 0 ? 0 : 15;
  const estimatedTax = subtotal * 0.08;
  const total = subtotal + shippingFee + estimatedTax;

  const handleProceedToCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#F9FAFB] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Drawer Header */}
        <div className="px-6 py-5 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#111827]" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#111827]">
              Shopping Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-gray-400 hover:text-[#111827] transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#111827] text-white px-6 py-2.5 text-xs">
          {subtotal >= 250 ? (
            <p className="text-[#C5A880] font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> You've unlocked Complimentary Express Shipping!
            </p>
          ) : (
            <p className="text-gray-300">
              Add <span className="text-[#C5A880] font-bold">${(250 - subtotal).toFixed(2)}</span> more to qualify for Free Express Shipping.
            </p>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-gray-200">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">Your shopping bag is empty</p>
                <p className="text-xs text-gray-500 max-w-xs">
                  Discover our new arrivals and architectural minimalism tailored for your wardrobe.
                </p>
              </div>
              <Link
                href="/catalog"
                onClick={closeCart}
                className="mt-4 px-6 py-2.5 bg-[#111827] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
              >
                Explore Collection <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="pt-4 flex gap-4">
                {/* Image */}
                <div className="relative w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeCart}
                        className="text-xs font-semibold text-[#111827] hover:text-[#C5A880] line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5 space-x-2">
                      <span>Size: <strong className="text-gray-700">{item.size}</strong></span>
                      <span>•</span>
                      <span>Color: <strong className="text-gray-700">{item.color}</strong></span>
                    </div>
                    <div className="text-xs font-semibold text-[#111827] mt-1">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-300 rounded bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-gray-600 hover:text-black hover:bg-gray-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-medium text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-gray-600 hover:text-black hover:bg-gray-50"
                        disabled={item.quantity >= item.maxStock}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-200 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-gray-900">
                  {shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-gray-900">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#111827] pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-[#C5A880]">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-[#111827] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-gray-400">
              Secured 256-Bit SSL Encrypted Checkout
            </p>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        subtotal={subtotal}
        shippingFee={shippingFee}
        tax={estimatedTax}
        total={total}
      />
    </>
  );
}
