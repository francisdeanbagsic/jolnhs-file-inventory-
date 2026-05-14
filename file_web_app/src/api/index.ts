import axios from 'axios';

const API_URL = 'https://jolnhs-acr.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAuthLogin = url.endsWith('/auth/login');
    const isAuthChangePassword = url.endsWith('/auth/change-password');
    const isAuthChangeEmail = url.endsWith('/auth/change-email');

    if (error.response?.status === 401 && !isAuthLogin && !isAuthChangePassword && !isAuthChangeEmail) {
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
  changeEmail: (currentPassword: string, newEmail: string) =>
    api.post('/auth/change-email', { currentPassword, newEmail }),
  getMe: () => api.get('/auth/me')
};

// Users API
export const usersApi = {
  getAll: () => api.get('/users'),
  create: (data: { email: string; password: string; name: string; role: string }) =>
    api.post('/users', data),
  update: (id: string, data: { name?: string; role?: string; isActive?: boolean }) =>
    api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  resetPassword: (id: string, newPassword: string) =>
    api.post(`/users/${id}/reset-password`, { newPassword })
};

// Documents API
export const documentsApi = {
  getAll: (params?: { category?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/documents', { params }),
  getById: (id: string) => api.get(`/documents/${id}`),
  search: (q: string, category?: string) =>
    api.get('/documents/search', { params: { q, category } }),
  upload: (formData: FormData) =>
    api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  delete: (id: string) => api.delete(`/documents/${id}`),
  download: (id: string) => api.get(`/documents/${id}/download`, { responseType: 'blob' })
};

// Reminders API
export const remindersApi = {
  getAll: (completed?: boolean) =>
    api.get('/reminders', { params: { completed } }),
  create: (data: { title: string; category: string; dueDate: string; notes?: string }) =>
    api.post('/reminders', data),
  update: (id: string, data: { title?: string; category?: string; dueDate?: string; isCompleted?: boolean; notes?: string }) =>
    api.put(`/reminders/${id}`, data),
  delete: (id: string) => api.delete(`/reminders/${id}`),
  complete: (id: string) => api.post(`/reminders/${id}/complete`),
  snooze: (id: string, days?: number) => api.post(`/reminders/${id}/snooze`, { days })
};

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getRecent: (limit?: number) => api.get('/dashboard/recent', { params: { limit } }),
  getSummary: () => api.get('/dashboard/summary')
};

export default api;
