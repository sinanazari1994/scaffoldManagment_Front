import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44370/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ذخیره callback برای نمایش Toast (در App.jsx تنظیم می‌شود)
let showToast = null;

export const setToastHandler = (handler) => {
  showToast = handler;
};

// درخواست: چسباندن توکن
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// پاسخ: مدیریت خطاهای رایج
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      const { status, data } = err.response;
      
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (status >= 500) {
        showToast?.('خطای سرور. لطفاً دوباره تلاش کنید.', 'error');
      } else if (status === 400) {
        const message = data?.message || data?.errors?.[0] || 'درخواست نامعتبر';
        showToast?.(message, 'error');
      }
    } else if (err.code === 'ERR_NETWORK') {
      showToast?.('ارتباط با سرور قطع است. لطفاً اتصال را بررسی کنید.', 'error');
    }
    
    return Promise.reject(err);
  }
);

export default api;