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
  getOverview: () => request<{ totalUsers: number; totalOrders: number; totalRevenue: number }>('/api/stats/overview'),

  getRegistrations: (days = 7) => request<{ date: string; count: number }[]>(`/api/stats/registrations?days=${days}`),

  getPurchases: (days = 7) => request<{ date: string; orders: number; revenue: number }[]>(`/api/stats/purchases?days=${days}`),

  getUsers: () => request<{ id: number; username: string; created_at: string }[]>('/api/users'),

  getOrderDetails: () => request<{ id: number; username: string; product_name: string; price: number; purchase_date: string }[]>('/api/orders'),

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
