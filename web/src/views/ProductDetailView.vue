<script setup lang="ts">
import { ArrowLeft, Check, Minus, Plus, ShoppingBag } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '@/api';
import { useCartStore } from '@/stores/cart';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/format';

const route = useRoute(); const cart = useCartStore();
const product = ref<Product | null>(null); const quantity = ref(1); const error = ref(''); const added = ref(false);
onMounted(async () => { try { product.value = await api.product(Number(route.params.id)); } catch (e) { error.value = e instanceof Error ? e.message : '商品加载失败'; } });
function add() { if (!product.value) return; cart.add(product.value, quantity.value); added.value = true; window.setTimeout(() => added.value = false, 1500); }
</script>

<template>
  <div class="container page-wrap">
    <RouterLink class="back-link" to="/"><ArrowLeft :size="17" /> 返回选物</RouterLink>
    <div v-if="error" class="error-state">{{ error }}</div>
    <div v-else-if="!product" class="detail-loading"><div /><div /></div>
    <article v-else class="product-detail">
      <div class="detail-visual" :class="`tone-${product.id % 5}`"><span>SHIGUANG<br>SELECT</span><b>0{{ product.id }}</b></div>
      <div class="detail-copy">
        <p class="eyebrow">日常精选 · 已售 {{ product.sales }}</p>
        <h1>{{ product.name }}</h1>
        <strong class="detail-price">{{ formatPrice(product.price) }}</strong>
        <p class="detail-description">{{ product.description || '一件认真挑选、适合长久陪伴日常的好物。' }}</p>
        <div class="stock-row"><span :class="{ available: product.stock > 0 }" />{{ product.stock ? `现货 ${product.stock} 件` : '暂时缺货' }}</div>
        <div class="detail-actions">
          <div class="quantity-control">
            <button aria-label="减少数量" @click="quantity = Math.max(1, quantity - 1)"><Minus :size="16" /></button><span>{{ quantity }}</span><button aria-label="增加数量" @click="quantity = Math.min(product.stock, quantity + 1)"><Plus :size="16" /></button>
          </div>
          <button class="primary-btn add-detail" :disabled="product.stock === 0" @click="add">
            <Check v-if="added" :size="18"/><ShoppingBag v-else :size="18"/>{{ added ? '已加入购物车' : '加入购物车' }}
          </button>
        </div>
        <ul class="detail-notes"><li>满 ¥299 免运费</li><li>7 天无理由退换</li><li>安全支付与隐私保护</li></ul>
      </div>
    </article>
  </div>
</template>

<style scoped>
.back-link{display:inline-flex;gap:8px;align-items:center;margin-bottom:34px;color:var(--muted);font-size:14px}.product-detail{display:grid;grid-template-columns:1.08fr .92fr;gap:8vw;align-items:center}.detail-visual{min-height:610px;border-radius:var(--radius-lg);position:relative;display:grid;place-items:center;font-size:18px;letter-spacing:.2em;text-align:center}.detail-visual::after{content:'';width:55%;aspect-ratio:1;border:1px solid rgba(24,32,28,.3);border-radius:50%;position:absolute;box-shadow:inset 0 0 0 42px rgba(255,255,255,.1)}.detail-visual span,.detail-visual b{z-index:1}.detail-visual b{position:absolute;right:25px;top:22px}.detail-copy h1{font:700 clamp(40px,5vw,72px)/1.12 'Noto Serif SC';margin:10px 0 20px}.detail-price{font-size:26px}.detail-description{color:var(--muted);line-height:1.9;margin:28px 0}.stock-row{display:flex;gap:9px;align-items:center;font-size:13px}.stock-row span{width:8px;height:8px;border-radius:50%;background:#aaa}.stock-row span.available{background:#5e8a50}.detail-actions{display:flex;gap:13px;margin:28px 0}.quantity-control{display:flex;align-items:center;border:1px solid var(--line);border-radius:99px}.quantity-control button{border:0;background:none;padding:12px;cursor:pointer}.quantity-control span{min-width:28px;text-align:center}.add-detail{flex:1}.detail-notes{padding-top:24px;border-top:1px solid var(--line);display:grid;gap:10px;color:var(--muted);font-size:13px}.detail-loading{display:grid;grid-template-columns:1fr 1fr;gap:50px}.detail-loading div{height:600px;background:#e5e2da;border-radius:var(--radius-lg)}@media(max-width:800px){.product-detail{grid-template-columns:1fr}.detail-visual{min-height:430px}.detail-loading{grid-template-columns:1fr}.detail-loading div:last-child{display:none}}
</style>
