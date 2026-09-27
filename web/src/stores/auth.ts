import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { api } from '@/api';
import type { User } from '@/types';

function storedUser(): User | null {
  try { return JSON.parse(localStorage.getItem('store_user') ?? 'null') as User | null; }
  catch { return null; }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('store_token'));
  const user = ref<User | null>(storedUser());
  const isAuthenticated = computed(() => Boolean(token.value && user.value));
  const isAdmin = computed(() => user.value?.role === 'ADMIN');

  function save(accessToken: string, currentUser: User) {
    token.value = accessToken;
    user.value = currentUser;
    localStorage.setItem('store_token', accessToken);
    localStorage.setItem('store_user', JSON.stringify(currentUser));
  }

  async function login(email: string, password: string) {
    const result = await api.login(email, password);
    save(result.accessToken, result.user);
  }

  async function register(name: string, email: string, password: string) {
    const result = await api.register(name, email, password);
    save(result.accessToken, result.user);
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('store_token');
    localStorage.removeItem('store_user');
  }

  window.addEventListener('auth:expired', logout);
  return { token, user, isAuthenticated, isAdmin, login, register, logout };
});
