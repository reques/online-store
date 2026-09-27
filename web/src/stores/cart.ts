import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import type { Product } from '@/types';

export interface CartItem { product: Product; quantity: number }

function storedCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem('store_cart') ?? '[]') as CartItem[]; }
  catch { return []; }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(storedCart());
  const count = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0));
  const total = computed(() => items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0));

  function add(product: Product, quantity = 1) {
    const existing = items.value.find((item) => item.product.id === product.id);
    if (existing) existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    else items.value.push({ product, quantity: Math.min(quantity, product.stock) });
  }

  function update(productId: number, quantity: number) {
    const item = items.value.find((entry) => entry.product.id === productId);
    if (!item) return;
    if (quantity <= 0) remove(productId);
    else item.quantity = Math.min(quantity, item.product.stock);
  }

  function remove(productId: number) { items.value = items.value.filter((item) => item.product.id !== productId); }
  function clear() { items.value = []; }
  watch(items, (value) => localStorage.setItem('store_cart', JSON.stringify(value)), { deep: true });

  return { items, count, total, add, update, remove, clear };
});
