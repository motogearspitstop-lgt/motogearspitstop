//frontend/src/store/productStore.js


import { create } from 'zustand';
import api from '../api/axiosInstance';

const useProductStore = create((set) => ({
  products: [],
  product: null,
  totalProducts: 0,
  loading: false,
  error: null,

  fetchProducts: async (query = '') => {
    set({ loading: true });
    try {
      const res = await api.get(`/products?${query}`);
      set({ products: res.data.products, totalProducts: res.data.totalProducts, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true });
    try {
      const res = await api.get(`/products/${id}`);
      set({ product: res.data.product, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchFeatured: async () => {
    try {
      const res = await api.get('/products/featured');
      return res.data.products;
    } catch { return []; }
  },

  fetchNewArrivals: async () => {
    try {
      const res = await api.get('/products/new-arrivals');
      return res.data.products;
    } catch { return []; }
  },

  submitReview: async (productId, data) => {
    try {
      await api.post(`/products/${productId}/review`, data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  }
}));

export default useProductStore;