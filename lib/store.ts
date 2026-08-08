'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string; // unique identifier: `${productId}-${variantId}`
  productId: string;
  variantId: string;
  title: string;
  slug: string;
  price: number;
  size: string;
  color: string;
  imageUrl: string;
  quantity: number;
  maxStock: number;
}

export interface WishlistItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  category: string;
  imageUrl: string;
}

interface StoreState {
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Wishlist
  wishlist: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;

  // Search filter query string
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      wishlist: [],
      searchQuery: '',

      addToCart: (newItem) => {
        const cartItemId = `${newItem.productId}-${newItem.variantId}`;
        const currentCart = get().cart;
        const existingIndex = currentCart.findIndex((i) => i.id === cartItemId);

        if (existingIndex > -1) {
          const updated = [...currentCart];
          const currentQty = updated[existingIndex].quantity;
          const newQty = Math.min(currentQty + newItem.quantity, newItem.maxStock);
          updated[existingIndex].quantity = newQty;
          set({ cart: updated, isCartOpen: true });
        } else {
          set({
            cart: [...currentCart, { ...newItem, id: cartItemId }],
            isCartOpen: true,
          });
        }
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.id === id ? { ...item, quantity: Math.min(quantity, item.maxStock) } : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),

      toggleWishlist: (item) => {
        const currentWishlist = get().wishlist;
        const exists = currentWishlist.some((w) => w.id === item.id);
        if (exists) {
          set({ wishlist: currentWishlist.filter((w) => w.id !== item.id) });
        } else {
          set({ wishlist: [...currentWishlist, item] });
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((w) => w.id === productId);
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'mvs-clothing-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist }),
    }
  )
);
