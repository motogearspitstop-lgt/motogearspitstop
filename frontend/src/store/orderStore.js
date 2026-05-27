//frontend/src/store/orderStore.js


import { create } from 'zustand';
import api from '../api/axiosInstance';

export const useOrderStore = create((set) => ({
  orders: [],
  order: null,
  loading: false,

  
  fetchMyOrders: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/orders/my');
      set({ orders: res.data.orders, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchOrderById: async (id) => {
    try {
      const res = await api.get(`/orders/${id}`);
      set({ order: res.data.order });
      return res.data.order;
    } catch { return null; }
  },

  createOrder: async (orderData) => {
    try {
      const res = await api.post('/orders', orderData);
      return { success: true, order: res.data.order };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Order could not be placed'
      };
    }
  },

  createRazorpayOrder: async (amount) => {
    try {
      const finalAmount = Math.round(Number(amount));
      const res = await api.post('/payment/create-order', { amount: finalAmount });
      return { success: true, keyId: res.data.keyId, order: res.data.order };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  },

  verifyPayment: async (data) => {
    try {
      await api.post('/payment/verify', data);
      return { success: true };
    } catch {
      return { success: false };
    }
  }
}));

export default useOrderStore;
