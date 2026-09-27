<script setup lang="ts">
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/api';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { formatPrice } from '@/utils/format';

const cart = useCartStore(); const auth = useAuthStore(); const router = useRouter(); const loading = ref(false); const error = ref('');
async function checkout() {
  if (!auth.isAuthenticated) { await router.push({ name: 'auth', query: { redirect: '/cart' } }); return; }
  loading.value = true; error.value = '';
  try { await api.createOrder(cart.items.map(({ product, quantity }) => ({ productId: product.id, quantity }))); cart.clear(); await router.push({ name: 'orders', query: { created: '1' } }); }
  catch (e) { error.value = e instanceof Error ? e.message : '下单失败'; }
  finally { loading.value = false; }
}
</script>

<template>
  <div class="container page-wrap">
    <div class="page-head"><p class="eyebrow">YOUR SELECTION</p><h1 class="page-title">购物车 <sup>{{ cart.count }}</sup></h1></div>
    <div v-if="!cart.items.length" class="cart-empty"><ShoppingBag :size="45"/><h2>购物车还是空的</h2><p>去挑一件会让日常变好的东西吧。</p><RouterLink class="primary-btn" to="/">开始逛逛 <ArrowRight :size="17"/></RouterLink></div>
    <div v-else class="cart-layout">
      <section class="cart-list">
        <article v-for="item in cart.items" :key="item.product.id" class="cart-item">
          <RouterLink :to="`/products/${item.product.id}`" class="cart-thumb" :class="`tone-${item.product.id % 5}`"><span>0{{ item.product.id }}</span></RouterLink>
          <div class="cart-name"><p class="eyebrow">SHIGUANG SELECT</p><h3>{{ item.product.name }}</h3><span>{{ formatPrice(item.product.price) }}</span></div>
          <div class="quantity-control"><button aria-label="减少" @click="cart.update(item.product.id, item.quantity - 1)"><Minus :size="15"/></button><span>{{ item.quantity }}</span><button aria-label="增加" @click="cart.update(item.product.id, item.quantity + 1)"><Plus :size="15"/></button></div>
          <strong>{{ formatPrice(item.product.price * item.quantity) }}</strong>
          <button class="remove-btn" aria-label="移除商品" @click="cart.remove(item.product.id)"><Trash2 :size="18"/></button>
        </article>
      </section>
      <aside class="summary-card"><p class="eyebrow">ORDER SUMMARY</p><h2>订单小计</h2><div><span>商品数量</span><span>{{ cart.count }} 件</span></div><div><span>配送费</span><span>{{ cart.total >= 29900 ? '免运费' : '结算时计算' }}</span></div><div class="summary-total"><span>合计</span><strong>{{ formatPrice(cart.total) }}</strong></div><p v-if="error" class="form-error">{{ error }}</p><button class="primary-btn" :disabled="loading" @click="checkout">{{ loading ? '正在创建订单…' : '确认下单' }} <ArrowRight :size="17"/></button><small>提交订单即表示你同意商城服务条款。</small></aside>
    </div>
  </div>
</template>

<style scoped>
.page-title sup{font:600 16px 'DM Sans';color:var(--accent)}.cart-layout{display:grid;grid-template-columns:1fr 350px;gap:55px}.cart-list{border-top:1px solid var(--line)}.cart-item{display:grid;grid-template-columns:110px 1fr auto 100px 30px;gap:22px;align-items:center;padding:22px 0;border-bottom:1px solid var(--line)}.cart-thumb{height:110px;border-radius:var(--radius-sm);display:grid;place-items:center}.cart-name h3{font:600 19px 'Noto Serif SC';margin:3px 0 8px}.quantity-control{display:flex;align-items:center;border:1px solid var(--line);border-radius:99px}.quantity-control button,.remove-btn{border:0;background:none;cursor:pointer;padding:10px}.quantity-control span{min-width:24px;text-align:center}.remove-btn{color:var(--muted)}.summary-card{background:var(--surface);padding:30px;border-radius:var(--radius);box-shadow:var(--shadow);height:max-content;position:sticky;top:110px}.summary-card h2{font:700 28px 'Noto Serif SC';margin:6px 0 28px}.summary-card>div{display:flex;justify-content:space-between;padding:11px 0;color:var(--muted)}.summary-card .summary-total{border-top:1px solid var(--line);margin-top:12px;padding-top:22px;color:var(--ink)}.summary-total strong{font-size:22px}.summary-card .primary-btn{width:100%;margin-top:22px}.summary-card small{display:block;text-align:center;color:var(--muted);margin-top:15px}.cart-empty{text-align:center;padding:70px 20px}.cart-empty svg{color:var(--accent)}.cart-empty h2{font:700 32px 'Noto Serif SC';margin:15px 0 5px}.cart-empty p{color:var(--muted);margin-bottom:25px}@media(max-width:900px){.cart-layout{grid-template-columns:1fr}.summary-card{position:static}}@media(max-width:650px){.cart-item{grid-template-columns:75px 1fr auto;gap:13px}.cart-thumb{height:75px}.cart-item>.quantity-control{grid-column:2}.cart-item>strong{grid-column:3;grid-row:2}.remove-btn{grid-column:3;grid-row:1}.cart-name h3{font-size:16px}}
</style>
