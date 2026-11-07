import axios from 'axios';

// VITE_API_URL puede ser el origen (https://api.onrender.com) o la URL
// completa del API (.../api). Así funciona igual en local y en Render.
const RAW_API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\\/+$/, '');
const API_BASE = RAW_API_URL.endsWith('/api') ? RAW_API_URL : `${RAW_API_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.startsWith('/auth/')) {
      localStorage.removeItem('taskflow-token');
      window.dispatchEvent(new Event('taskflow:unauthorized'));
    }
    const msg = err.response?.data?.error || err.message;
    return Promise.reject(new Error(msg));
  },
);

export default api;
