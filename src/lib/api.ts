import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Instance auth-injected (buat kasir)
export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Instance publik (buat customer self-order — no auth header)
export const publicApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

// ==================== AUTH APIs ====================
export const authApi = {
  login: (email: string, password: string) => api.post('/login', { email, password }),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
};

export const menuApi = {
  list: (params?: { category_id?: number; available_only?: boolean }) =>
    api.get('/menus', { params }),
  toggleAvailability: (id: number) => api.patch(`/menus/${id}/availability`),
  recommendations: (params?: { limit?: number; exclude?: string }) =>
    api.get('/menus/recommendations', { params }),
};

export const categoryApi = { list: () => api.get('/categories') };

export const orderApi = {
  create: (data: {
    order_type: 'dine_in' | 'takeaway';
    items: { menu_id: number; quantity: number }[];
  }) => api.post('/orders', data),
  list: (params?: { period?: string; status?: string; search?: string; page?: number }) =>
    api.get('/orders', { params }),
  detail: (id: number) => api.get(`/orders/${id}`),
  void: (id: number, reason: string) => api.patch(`/orders/${id}/void`, { voided_reason: reason }),
  stats: (period: string = 'today') => api.get('/orders/stats', { params: { period } }),
};

export const dashboardApi = { weeklyRevenue: () => api.get('/dashboard/weekly-revenue') };

// ==================== PUBLIC APIs (customer QR flow) ====================
export const publicTableApi = {
  validate: (code: string) => publicApi.get(`/public/tables/${code}`),
};

export const publicMenuApi = {
  list: () => publicApi.get('/public/menus'),
  categories: () => publicApi.get('/public/categories'),
  recommendations: (params?: { limit?: number; exclude?: string }) =>
    publicApi.get('/public/recommendations', { params }),
};