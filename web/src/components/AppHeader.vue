<script setup lang="ts">
import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';

const auth = useAuthStore();
const cart = useCartStore();
const router = useRouter();
const route = useRoute();
const menuOpen = ref(false);
const search = ref(typeof route.query.keyword === 'string' ? route.query.keyword : '');

function submitSearch() {
  void router.push({ name: 'home', query: search.value ? { keyword: search.value } : {} });
  menuOpen.value = false;
}

function logout() { auth.logout(); menuOpen.value = false; void router.push('/'); }
</script>

<template>
  <header class="site-header">
    <RouterLink class="brand" to="/" aria-label="拾光集首页">
      <span class="brand-mark">拾</span><span>拾光集<small>SHIGUANG SELECT</small></span>
    </RouterLink>
    <form class="header-search" role="search" @submit.prevent="submitSearch">
      <Search :size="18" /><input v-model="search" aria-label="搜索商品" placeholder="搜索日常好物" />
    </form>
    <button class="icon-button mobile-menu" aria-label="打开导航" @click="menuOpen = !menuOpen">
      <X v-if="menuOpen" /><Menu v-else />
    </button>
    <nav :class="['main-nav', { open: menuOpen }]" aria-label="主导航">
      <RouterLink to="/" @click="menuOpen = false">逛好物</RouterLink>
      <RouterLink v-if="auth.isAuthenticated" to="/orders" @click="menuOpen = false">我的订单</RouterLink>
      <RouterLink v-if="auth.isAdmin" to="/admin/products" @click="menuOpen = false">商品管理</RouterLink>
      <RouterLink v-if="!auth.isAuthenticated" class="nav-user" to="/auth" @click="menuOpen = false"><UserRound :size="18" /> 登录</RouterLink>
      <button v-else class="nav-user link-button" @click="logout"><UserRound :size="18" /> {{ auth.user?.name }} · 退出</button>
      <RouterLink class="cart-link" to="/cart" aria-label="购物车" @click="menuOpen = false">
        <ShoppingBag :size="21" /><span>购物车</span><b v-if="cart.count">{{ cart.count }}</b>
      </RouterLink>
    </nav>
  </header>
</template>
