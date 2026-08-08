'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Lock, ShieldCheck, Loader2, PackageCheck } from 'lucide-react';
import { useStore, CartItem } from '@/lib/store';
import { createOrder } from '@/lib/actions';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  shippingFee,
  tax,
  total,
}: CheckoutModalProps) {
  const { clearCart, closeCart } = useStore();

  const [formData, setFormData] = useState({
    customerName: 'Victoria Sterling',
    customerEmail: 'victoria@example.com',
    shippingAddress: '45 Park Avenue, Suite 12B',
    city: 'New York',
    postalCode: '10016',
    country: 'United States',
    paymentMethod: 'Credit Card',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await createOrder({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        shippingAddress: formData.shippingAddress,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        subtotal,
        tax,
        shippingFee,
        total,
        paymentMethod: formData.paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          title: item.title,
          size: item.size,
          color: item.color,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
      });

      if (res.success) {
        setConfirmedOrder(res.data);
        clearCart();
      } else {
        setErrorMessage(res.error || 'Failed to place order. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong processing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setConfirmedOrder(null);
    onClose();
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden my-8 border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#111827] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#C5A880]" />
            <h3 className="text-xs uppercase tracking-widest font-bold">
              {confirmedOrder ? 'Order Confirmation' : 'Secure Express Checkout'}
            </h3>
          </div>
          {!confirmedOrder && (
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {confirmedOrder ? (
          /* Order Confirmation View */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">Thank You for Your Order</h2>
              <p className="text-xs text-gray-500">
                Order Reference: <span className="font-mono font-bold text-[#111827]">{confirmedOrder.orderNumber}</span>
              </p>
              <p className="text-xs text-gray-600">
                We've sent a confirmation email to <strong className="text-gray-900">{confirmedOrder.customerEmail}</strong>.
              </p>
            </div>

            {/* Order Details summary */}
            <div className="bg-[#F9FAFB] p-4 rounded-md text-left text-xs space-y-2 border border-gray-200">
              <div className="flex justify-between text-gray-500 border-b border-gray-200 pb-2">
                <span>Shipping Address:</span>
                <span className="text-gray-900 font-medium text-right">
                  {confirmedOrder.shippingAddress}, {confirmedOrder.city} {confirmedOrder.postalCode}
                </span>
              </div>
              <div className="flex justify-between text-gray-500 border-b border-gray-200 pb-2">
                <span>Payment Method:</span>
                <span className="text-gray-900 font-medium">{confirmedOrder.paymentMethod} (Paid)</span>
              </div>
              <div className="flex justify-between font-bold text-[#111827] pt-1">
                <span>Total Paid:</span>
                <span className="text-[#C5A880]">${confirmedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleFinish}
                className="px-8 py-3 bg-[#111827] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errorMessage && (
              <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] border-b pb-2 flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-[#C5A880]" /> 1. Shipping Details
                </h4>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-600 font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-600 font-medium mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    required
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-600 font-medium mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="shippingAddress"
                    required
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-gray-600 font-medium mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-gray-600 font-medium mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Details & Order Summary */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] border-b pb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C5A880]" /> 2. Payment Method
                </h4>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-600 font-medium mb-1">
                    Select Payment
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="Credit Card">Credit Card (Visa / Mastercard / Amex)</option>
                    <option value="Apple Pay">Apple Pay</option>
                    <option value="Klarna">Klarna (Pay in 4)</option>
                  </select>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded space-y-2">
                  <div className="text-[11px] text-gray-600 font-medium flex justify-between">
                    <span>Card Number</span>
                    <span className="font-mono">{formData.cardNumber}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>Expires: {formData.cardExp}</span>
                    <span>CVC: ***</span>
                  </div>
                </div>

                {/* Mini Order Summary */}
                <div className="p-4 bg-[#F9FAFB] rounded border border-gray-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Est. Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#111827] pt-2 border-t text-sm">
                    <span>Total Amount Due</span>
                    <span className="text-[#C5A880]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xs uppercase tracking-wider font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-[#111827] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-gray-800 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing Order...
                  </>
                ) : (
                  <>Complete Order (${total.toFixed(2)})</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
