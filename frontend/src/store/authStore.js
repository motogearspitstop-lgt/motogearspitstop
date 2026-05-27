//frontend/src/store/authStore.js


import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axiosInstance';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      register: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/auth/register', data);
          set({ user: res.data.user, isAuthenticated: true, loading: false });
          return { success: true };
        } catch (err) {
          set({ error: err.response?.data?.message || 'Registration failed', loading: false });
          return { success: false, message: err.response?.data?.message };
        }
      },

      login: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/auth/login', data);
          set({ user: res.data.user, isAuthenticated: true, loading: false });
          return { success: true };
        } catch (err) {
          set({ error: err.response?.data?.message || 'Login failed', loading: false });
          return { success: false, message: err.response?.data?.message };
        }
      },

      logout: async () => {
        await api.post('/auth/logout');
        set({ user: null, isAuthenticated: false });
      },

      getMe: async () => {
        try {
          const res = await api.get('/auth/me');
          set({ user: res.data.user, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },

      forgotPassword: async (email) => {
        try {
          await api.post('/auth/forgot-password', { email });
          return { success: true };
        } catch (err) {
          return { success: false, message: err.response?.data?.message };
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);

export default useAuthStore;