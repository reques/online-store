import type { AuthResponse, Order, Page, Product, ProductInput } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1';

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message); }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('store_token');
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    let message = '请求失败，请稍后再试';
    try {
      const body = await response.json() as { message?: string | string[] };
      message = Array.isArray(body.message) ? body.message.join('；') : body.message ?? message;
    } catch { /* response is not JSON */ }
    if (response.status === 401) window.dispatchEvent(new Event('auth:expired'));
    throw new ApiError(message, response.status);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

const json = (value: unknown) => JSON.stringify(value);

export const api = {
  login: (email: string, password: string) => request<AuthResponse>('/auth/login', { method: 'POST', body: json({ email, password }) }),
  register: (name: string, email: string, password: string) => request<AuthResponse>('/auth/register', { method: 'POST', body: json({ name, email, password }) }),
  products: (page = 1, keyword = '') => request<Page<Product>>(`/products?page=${page}&pageSize=8&keyword=${encodeURIComponent(keyword)}`),
  product: (id: number) => request<Product>(`/products/${id}`),
  adminProducts: () => request<Product[]>('/products/admin/all'),
  createProduct: (input: ProductInput) => request<Product>('/products', { method: 'POST', body: json(input) }),
  updateProduct: (id: number, input: Partial<ProductInput>) => request<Product>(`/products/${id}`, { method: 'PATCH', body: json(input) }),
  removeProduct: (id: number) => request<Product>(`/products/${id}`, { method: 'DELETE' }),
  orders: (page = 1) => request<Page<Order>>(`/orders?page=${page}&pageSize=10`),
  createOrder: (items: Array<{ productId: number; quantity: number }>) => request<Order>('/orders', { method: 'POST', body: json({ items }) }),
};
