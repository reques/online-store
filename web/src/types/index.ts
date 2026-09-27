export type Role = 'CUSTOMER' | 'ADMIN';
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';
export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'COMPLETED';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  sales: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNo: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  status?: ProductStatus;
}
