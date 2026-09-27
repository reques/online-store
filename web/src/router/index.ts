import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/products/:id', name: 'product', component: () => import('@/views/ProductDetailView.vue') },
    { path: '/auth', name: 'auth', component: () => import('@/views/AuthView.vue') },
    { path: '/cart', name: 'cart', component: () => import('@/views/CartView.vue') },
    { path: '/orders', name: 'orders', component: () => import('@/views/OrdersView.vue'), meta: { requiresAuth: true } },
    { path: '/admin/products', name: 'admin-products', component: () => import('@/views/AdminProductsView.vue'), meta: { requiresAuth: true, admin: true } },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFoundView.vue') },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'auth', query: { redirect: to.fullPath } };
  if (to.meta.admin && !auth.isAdmin) return { name: 'home' };
});

export default router;
