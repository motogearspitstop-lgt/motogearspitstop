//frontend/src/api/axiosInstance.js

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  res => res,
  err => {
    const requestUrl = err.config?.url || '';
    const isAuthRequest =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/me');

    if (err.response?.status === 401 && !isAuthRequest) {
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default api;
