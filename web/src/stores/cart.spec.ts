import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useCartStore } from './cart';
import type { Product } from '@/types';

const product = { id: 1, name: '测试商品', description: null, price: 1299, stock: 3, sales: 0, status: 'ACTIVE', createdAt: '', updatedAt: '' } satisfies Product;
const values = new Map<string, string>();
const storage: Storage = {
  get length() { return values.size; },
  clear: () => values.clear(),
  getItem: (key) => values.get(key) ?? null,
  key: (index) => [...values.keys()][index] ?? null,
  removeItem: (key) => { values.delete(key); },
  setItem: (key, value) => { values.set(key, value); },
};

describe('cart store', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
    localStorage.clear();
    setActivePinia(createPinia());
  });
  it('merges duplicate products and never exceeds stock', () => {
    const cart = useCartStore();
    cart.add(product, 2); cart.add(product, 2);
    expect(cart.count).toBe(3); expect(cart.total).toBe(3897);
  });
  it('removes an item when quantity reaches zero', () => {
    const cart = useCartStore(); cart.add(product); cart.update(product.id, 0);
    expect(cart.items).toHaveLength(0);
  });
});
