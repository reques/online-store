<script setup lang="ts">
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '@/api';
import LoadingGrid from '@/components/LoadingGrid.vue';
import ProductCard from '@/components/ProductCard.vue';
import type { Page, Product } from '@/types';

const route = useRoute();
const result = ref<Page<Product> | null>(null);
const loading = ref(true);
const error = ref('');
const page = ref(1);

async function load() {
  loading.value = true; error.value = '';
  try { result.value = await api.products(page.value, String(route.query.keyword ?? '')); }
  catch (e) { error.value = e instanceof Error ? e.message : '商品加载失败'; }
  finally { loading.value = false; }
}

watch(() => route.query.keyword, () => { page.value = 1; void load(); });
onMounted(load);
function turn(next: number) { page.value = next; void load(); window.scrollTo({ top: 430, behavior: 'smooth' }); }
</script>

<template>
  <section class="hero">
    <div class="container hero-copy">
      <p class="eyebrow">CURATED FOR EVERYDAY · 2026</p>
      <h1>让好东西，<br><em>自然地</em>留在生活里。</h1>
      <div class="hero-bottom">
        <a href="#selection" class="primary-btn">开始挑选 <ArrowDown :size="17" /></a>
        <p>不追逐短暂热度，只收集经得起日常使用的设计。每一件，都有留下来的理由。</p>
      </div>
    </div>
  </section>
  <section id="selection" class="section">
    <div class="container">
      <div class="section-heading">
        <div><p class="eyebrow">THE WEEKLY EDIT</p><h2 class="page-title">本周精选</h2></div>
        <p v-if="result">{{ result.total }} 件好物，等待与你相遇</p>
      </div>
      <LoadingGrid v-if="loading" />
      <div v-else-if="error" class="error-state"><p>{{ error }}</p><button class="secondary-btn" @click="load">重新加载</button></div>
      <div v-else-if="!result?.items.length" class="empty-state"><h3>没有找到相关商品</h3><p>换个关键词，也许会有新的发现。</p></div>
      <div v-else class="product-grid">
        <ProductCard v-for="(product, index) in result.items" :key="product.id" :product="product" :index="index" />
      </div>
      <div v-if="result && result.total > result.pageSize" class="pagination">
        <button :disabled="page === 1" aria-label="上一页" @click="turn(page - 1)"><ArrowLeft :size="18" /></button>
        <span>{{ page }} / {{ Math.ceil(result.total / result.pageSize) }}</span>
        <button :disabled="page >= Math.ceil(result.total / result.pageSize)" aria-label="下一页" @click="turn(page + 1)"><ArrowRight :size="18" /></button>
      </div>
    </div>
  </section>
</template>
