// frontend/src/store/cartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axiosInstance';

const getItemId = (item) => item?.product?._id || item?.product?.id || item?._id || item?.id;
const getItemPrice = (item) => Number(item?.price ?? item?.product?.price ?? 0);
const recalcTotal = (items) => items.reduce((acc, item) => acc + getItemPrice(item) * item.quantity, 0);

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,
      loading: false,

      fetchCart: async () => {
        try {
          const res = await api.get('/cart');
          const items = res.data.cart?.items || [];
          set({ items, totalPrice: res.data.cart?.totalPrice ?? recalcTotal(items) });
        } catch {
          set((state) => ({ totalPrice: recalcTotal(state.items) }));
        }
      },

      addToCart: (product, quantity = 1) => {
        const productId = getItemId(product);

        set((state) => {
          const existingItem = state.items.find((item) => getItemId(item) === productId);
          const items = existingItem
            ? state.items.map((item) =>
                getItemId(item) === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            : [...state.items, { ...product, quantity }];

          return { items, totalPrice: recalcTotal(items) };
        });

        return { success: true };
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          const items =
            quantity <= 0
              ? state.items.filter((item) => getItemId(item) !== productId)
              : state.items.map((item) =>
                  getItemId(item) === productId ? { ...item, quantity } : item
                );

          return { items, totalPrice: recalcTotal(items) };
        });
      },

      updateItem: (productId, quantity) => get().updateQuantity(productId, quantity),

      removeFromCart: (productId) => {
        set((state) => {
          const items = state.items.filter((item) => getItemId(item) !== productId);
          return { items, totalPrice: recalcTotal(items) };
        });
      },

      removeItem: (productId) => get().removeFromCart(productId),

      clearCart: async () => {
        set({ items: [], totalPrice: 0 });
        try {
          await api.delete('/cart');
        } catch {
          // Cart is local for guests, so this can safely fail.
        }
      },

      syncCartToBackend: async () => {
        const items = get().items;
        if (items.length === 0) return { success: true };

        try {
          for (const item of items) {
            await api.post('/cart', { productId: getItemId(item), quantity: item.quantity });
          }
          await get().fetchCart();
          return { success: true };
        } catch (err) {
          return { success: false, message: err.response?.data?.message || 'Cart sync failed' };
        }
      },

      getCartCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      getCartTotal: () => recalcTotal(get().items),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: 'motogear-cart',
      partialize: (state) => ({ items: state.items, totalPrice: state.totalPrice }),
    }
  )
);

export default useCartStore;
