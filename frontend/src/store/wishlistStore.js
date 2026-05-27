//frontend/src/store/wishlistStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      products: [],

      addToWishlist: (product) => {
        const exists = get().products.find(p => p.id === product.id);
        if (!exists) {
          set({ products: [...get().products, product] });
        }
      },

      removeFromWishlist: (productId) => {
        set({ products: get().products.filter(p => p.id !== productId) });
      },

      isInWishlist: (productId) => {
        return get().products.some(p => p.id === productId);
      }
    }),
    {
      name: 'motogear-wishlist',
      partialize: (state) => ({ products: state.products })
    }
  )
);

export default useWishlistStore;
