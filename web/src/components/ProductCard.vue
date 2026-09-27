<script setup lang="ts">
import { ArrowUpRight, ShoppingBag } from 'lucide-vue-next';
import { useCartStore } from '@/stores/cart';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/format';

const props = defineProps<{ product: Product; index?: number }>();
const cart = useCartStore();
</script>

<template>
  <article class="product-card" :style="{ '--delay': `${(index ?? 0) * 55}ms` }">
    <RouterLink class="product-visual" :class="`tone-${product.id % 5}`" :to="`/products/${product.id}`">
      <span class="visual-number">0{{ (index ?? 0) + 1 }}</span>
      <span class="visual-word">SELECTED</span>
      <ArrowUpRight class="visual-arrow" />
    </RouterLink>
    <div class="product-info">
      <div>
        <p class="eyebrow">已售 {{ product.sales }} · 库存 {{ product.stock }}</p>
        <RouterLink :to="`/products/${product.id}`"><h3>{{ product.name }}</h3></RouterLink>
      </div>
      <div class="product-buy">
        <strong>{{ formatPrice(product.price) }}</strong>
        <button class="round-add" :disabled="product.stock === 0" :aria-label="`将 ${product.name} 加入购物车`" @click="cart.add(product)">
          <ShoppingBag :size="18" />
        </button>
      </div>
    </div>
  </article>
</template>
