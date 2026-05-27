//frontend/src/store/authStore.js


import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axiosInstance';

const setApiToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      register: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/auth/register', data);
          const token = res.data.token || null;
          setApiToken(token);
          set({ user: res.data.user, token, isAuthenticated: true, loading: false });
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
          const token = res.data.token || null;
          setApiToken(token);
          set({ user: res.data.user, token, isAuthenticated: true, loading: false });
          return { success: true };
        } catch (err) {
          set({ error: err.response?.data?.message || 'Login failed', loading: false });
          return { success: false, message: err.response?.data?.message };
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } finally {
          setApiToken(null);
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      getMe: async () => {
        const token = get().token;
        setApiToken(token);

        if (!token) {
          set({ user: null, token: null, isAuthenticated: false });
          return;
        }

        try {
          const res = await api.get('/auth/me');
          set({ user: res.data.user, isAuthenticated: true });
        } catch {
          setApiToken(null);
          set({ user: null, token: null, isAuthenticated: false });
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
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState?.token) {
          return { user: null, token: null, isAuthenticated: false };
        }

        setApiToken(persistedState.token);
        return persistedState;
      },
      onRehydrateStorage: () => (state) => {
        setApiToken(state?.token || null);
      },
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated })
    }
  )
);

export default useAuthStore;
