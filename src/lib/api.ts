import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Inject token ke setiap request kalo ada di localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401: token expired/invalid → clear & redirect ke login
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Type-safe helpers
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/login', { email, password }),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
};

export const menuApi = {
  list: (params?: { category_id?: number; available_only?: boolean }) =>
    api.get('/menus', { params }),
  toggleAvailability: (id: number) =>
    api.patch(`/menus/${id}/availability`),
};

export const categoryApi = {
  list: () => api.get('/categories'),
};

export const orderApi = {
  create: (data: {
    order_type: 'dine_in' | 'takeaway';
    items: { menu_id: number; quantity: number }[];
  }) => api.post('/orders', data),
  list: (params?: { period?: string; status?: string; search?: string; page?: number }) =>
    api.get('/orders', { params }),
  detail: (id: number) => api.get(`/orders/${id}`),
  void: (id: number, reason: string) =>
    api.patch(`/orders/${id}/void`, { voided_reason: reason }),
  stats: (period: string = 'today') =>
    api.get('/orders/stats', { params: { period } }),
};

export const dashboardApi = {
  weeklyRevenue: () => api.get('/dashboard/weekly-revenue'),
};