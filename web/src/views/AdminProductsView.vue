<script setup lang="ts">
import { Edit3, PackagePlus, Power, X } from 'lucide-vue-next';
import { onMounted, reactive, ref } from 'vue';
import { api } from '@/api';
import type { Product, ProductInput, ProductStatus } from '@/types';
import { formatPrice } from '@/utils/format';

const products = ref<Product[]>([]); const loading = ref(true); const error = ref(''); const saving = ref(false); const dialog = ref(false); const editingId = ref<number | null>(null);
const form = reactive({ name: '', description: '', priceYuan: 0, stock: 0, status: 'ACTIVE' as ProductStatus });
const statusLabel = { ACTIVE: '销售中', DRAFT: '草稿', INACTIVE: '已下架' };
async function load() { loading.value = true; try { products.value = await api.adminProducts(); } catch (e) { error.value = e instanceof Error ? e.message : '加载失败'; } finally { loading.value = false; } }
function openCreate() { editingId.value = null; Object.assign(form, { name: '', description: '', priceYuan: 0, stock: 0, status: 'ACTIVE' }); dialog.value = true; }
function openEdit(product: Product) { editingId.value = product.id; Object.assign(form, { name: product.name, description: product.description ?? '', priceYuan: product.price / 100, stock: product.stock, status: product.status }); dialog.value = true; }
async function save() {
  saving.value = true; error.value = '';
  const input: ProductInput = { name: form.name, description: form.description, price: Math.round(form.priceYuan * 100), stock: form.stock, status: form.status };
  try { if (editingId.value) await api.updateProduct(editingId.value, input); else await api.createProduct(input); dialog.value = false; await load(); }
  catch (e) { error.value = e instanceof Error ? e.message : '保存失败'; }
  finally { saving.value = false; }
}
async function toggle(product: Product) { await api.updateProduct(product.id, { status: product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }); await load(); }
onMounted(load);
</script>

<template>
  <div class="container page-wrap admin-page">
    <div class="admin-head"><div><p class="eyebrow">ADMIN CONSOLE</p><h1 class="page-title">商品管理</h1></div><button class="primary-btn" @click="openCreate"><PackagePlus :size="18"/>新增商品</button></div>
    <p v-if="error && !dialog" class="form-error">{{ error }}</p><p v-if="loading">正在读取商品…</p>
    <div v-else class="admin-table-wrap"><table class="admin-table"><thead><tr><th>商品</th><th>售价</th><th>库存</th><th>销量</th><th>状态</th><th>操作</th></tr></thead><tbody><tr v-for="product in products" :key="product.id"><td><span class="mini-thumb" :class="`tone-${product.id % 5}`">0{{ product.id }}</span><strong>{{ product.name }}</strong></td><td>{{ formatPrice(product.price) }}</td><td>{{ product.stock }}</td><td>{{ product.sales }}</td><td><span class="product-status" :class="product.status.toLowerCase()">{{ statusLabel[product.status] }}</span></td><td><button aria-label="编辑" @click="openEdit(product)"><Edit3 :size="17"/></button><button :aria-label="product.status === 'ACTIVE' ? '下架' : '上架'" @click="toggle(product)"><Power :size="17"/></button></td></tr></tbody></table></div>
    <div v-if="dialog" class="dialog-backdrop" @click.self="dialog = false"><form class="product-dialog" @submit.prevent="save"><button type="button" class="dialog-close" aria-label="关闭" @click="dialog = false"><X/></button><p class="eyebrow">{{ editingId ? 'EDIT PRODUCT' : 'NEW PRODUCT' }}</p><h2>{{ editingId ? '编辑商品' : '新增商品' }}</h2><div class="form-field"><label>商品名称</label><input v-model.trim="form.name" required maxlength="191"/></div><div class="form-field"><label>商品描述</label><textarea v-model="form.description" rows="4"/></div><div class="form-row"><div class="form-field"><label>售价（元）</label><input v-model.number="form.priceYuan" required type="number" min="0" step="0.01"/></div><div class="form-field"><label>库存</label><input v-model.number="form.stock" required type="number" min="0" step="1"/></div></div><div class="form-field"><label>状态</label><select v-model="form.status"><option value="ACTIVE">销售中</option><option value="DRAFT">草稿</option><option value="INACTIVE">已下架</option></select></div><p v-if="error" class="form-error">{{ error }}</p><button class="primary-btn save-btn" :disabled="saving">{{ saving ? '保存中…' : '保存商品' }}</button></form></div>
  </div>
</template>

<style scoped>
.admin-head{display:flex;justify-content:space-between;align-items:end;margin-bottom:40px}.admin-table-wrap{overflow:auto;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius)}.admin-table{width:100%;border-collapse:collapse;min-width:760px}.admin-table th{text-align:left;color:var(--muted);font-size:11px;letter-spacing:.1em;padding:17px 20px;border-bottom:1px solid var(--line)}.admin-table td{padding:16px 20px;border-bottom:1px solid var(--line)}.admin-table tr:last-child td{border:0}.admin-table td:first-child{display:flex;align-items:center;gap:13px}.mini-thumb{width:48px;height:48px;border-radius:8px;display:grid;place-items:center;font-size:11px}.admin-table button{border:0;background:none;padding:8px;cursor:pointer}.product-status{padding:6px 10px;border-radius:99px;background:#eee;font-size:11px}.product-status.active{background:#dfebda;color:#42613b}.product-status.draft{background:#eee5d1;color:#765d25}.product-status.inactive{background:#eadedb;color:#814c40}.dialog-backdrop{position:fixed;inset:0;background:rgba(24,32,28,.55);backdrop-filter:blur(5px);z-index:100;display:grid;place-items:center;padding:20px}.product-dialog{width:min(560px,100%);max-height:90vh;overflow:auto;background:var(--paper);border-radius:var(--radius-lg);padding:35px;position:relative;box-shadow:var(--shadow)}.product-dialog h2{font:700 32px 'Noto Serif SC';margin:5px 0 26px}.dialog-close{position:absolute;right:25px;top:25px;border:0;background:none;cursor:pointer}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:15px}.save-btn{width:100%}@media(max-width:600px){.admin-head{align-items:flex-start;flex-direction:column;gap:20px}.form-row{grid-template-columns:1fr}}
</style>
