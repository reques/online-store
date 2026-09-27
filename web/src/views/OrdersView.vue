<script setup lang="ts">
import { CheckCircle2, ChevronDown, ChevronUp, PackageOpen } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '@/api';
import type { Order, Page } from '@/types';
import { formatDate, formatPrice } from '@/utils/format';

const route = useRoute(); const result = ref<Page<Order> | null>(null); const loading = ref(true); const error = ref(''); const expanded = ref<number | null>(null);
const labels = { PENDING: '待支付', PAID: '已支付', CANCELLED: '已取消', COMPLETED: '已完成' } as const;
onMounted(async () => { try { result.value = await api.orders(); } catch (e) { error.value = e instanceof Error ? e.message : '订单加载失败'; } finally { loading.value = false; } });
</script>

<template>
  <div class="container page-wrap orders-page">
    <div v-if="route.query.created" class="success-banner"><CheckCircle2/>订单创建成功，我们会尽快为你准备。</div>
    <div class="page-head"><p class="eyebrow">ORDER HISTORY</p><h1 class="page-title">我的订单</h1></div>
    <p v-if="loading">正在整理你的订单…</p><div v-else-if="error" class="error-state">{{ error }}</div>
    <div v-else-if="!result?.items.length" class="empty-state"><PackageOpen :size="42"/><h3>还没有订单</h3><RouterLink class="primary-btn" to="/">去挑选</RouterLink></div>
    <div v-else class="order-list">
      <article v-for="order in result.items" :key="order.id" class="order-card">
        <button class="order-main" @click="expanded = expanded === order.id ? null : order.id">
          <span><small>订单编号</small>{{ order.orderNo }}</span><span><small>下单时间</small>{{ formatDate(order.createdAt) }}</span><span><small>订单金额</small><strong>{{ formatPrice(order.totalAmount) }}</strong></span><span class="status" :class="order.status.toLowerCase()">{{ labels[order.status] }}</span><ChevronUp v-if="expanded === order.id"/><ChevronDown v-else/>
        </button>
        <div v-if="expanded === order.id" class="order-items">
          <div v-for="item in order.items" :key="item.id"><span>{{ item.productName }}</span><span>{{ formatPrice(item.unitPrice) }} × {{ item.quantity }}</span><strong>{{ formatPrice(item.subtotal) }}</strong></div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.orders-page{max-width:1050px}.success-banner{display:flex;gap:10px;align-items:center;background:#e4ecdf;color:#42613b;padding:15px 20px;border-radius:var(--radius-sm);margin-bottom:35px}.order-list{display:grid;gap:13px}.order-card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden}.order-main{width:100%;display:grid;grid-template-columns:1.5fr 1.2fr 1fr auto auto;gap:20px;align-items:center;text-align:left;border:0;background:none;padding:24px;cursor:pointer}.order-main span{display:grid;gap:5px}.order-main small{color:var(--muted)}.status{display:inline-block!important;padding:7px 11px;border-radius:99px;background:#eee;font-size:12px}.status.pending{background:#f4e7c7;color:#80621c}.status.completed,.status.paid{background:#dfebda;color:#42613b}.order-items{padding:8px 24px 20px;border-top:1px solid var(--line);background:#faf8f3}.order-items div{display:grid;grid-template-columns:1fr 1fr auto;padding:13px 0;border-bottom:1px solid #e9e6df}.order-items div:last-child{border:0}@media(max-width:760px){.order-main{grid-template-columns:1fr auto}.order-main>span:nth-child(2),.order-main>span:nth-child(3){display:none}.order-items div{grid-template-columns:1fr auto}.order-items div span:nth-child(2){display:none}}
</style>
