import { API_BASE_URL } from '../config';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  register: (username: string, password: string, email?: string) =>
    request<{ success: boolean; message: string }>('/api/auth/register', {
      method: 'POST', body: JSON.stringify({ username, password, email }),
    }),

  ensureUser: (username: string, password: string, email?: string) =>
    request<{ success: boolean; userId: number; userEmail?: string }>('/api/auth/ensure', {
      method: 'POST', body: JSON.stringify({ username, password, email }),
    }),

  checkout: (userId: string, productIds: number[]) =>
    request<{ success: boolean; message: string }>('/api/checkout', {
      method: 'POST', body: JSON.stringify({ userId, productIds }),
    }),

  getOverview: () => request<{ totalUsers: number; totalOrders: number; totalRevenue: number }>('/api/stats/overview'),

  getRegistrations: (days = 7) => request<{ date: string; count: number }[]>(`/api/stats/registrations?days=${days}`),

  getPurchases: (days = 7) => request<{ date: string; orders: number; revenue: number }[]>(`/api/stats/purchases?days=${days}`),

  getUsers: () => request<{ id: number; username: string; email: string | null; created_at: string }[]>('/api/users'),

  getOrderDetails: () => request<{ id: number; username: string; user_email: string | null; product_name: string; price: number; purchase_date: string }[]>('/api/orders'),

  simulatePurchase: () => request<{ success: boolean; message: string }>('/api/orders/simulate', { method: 'POST' }),

  getProducts: (params?: { category?: string; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.search) qs.set('search', params.search);
    return request<any[]>(`/api/products?${qs.toString()}`);
  },

  addProduct: (product: Record<string, any>) =>
    request<{ success: boolean; id: number }>('/api/products', { method: 'POST', body: JSON.stringify(product) }),

  updateProduct: (id: number, product: Record<string, any>) =>
    request<{ success: boolean }>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),

  deleteProduct: (id: number) =>
    request<{ success: boolean }>(`/api/products/${id}`, { method: 'DELETE' }),
};
