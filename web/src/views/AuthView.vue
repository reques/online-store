<script setup lang="ts">
import { ArrowRight, Eye, EyeOff } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore(); const router = useRouter(); const route = useRoute();
const mode = ref<'login' | 'register'>('login'); const name = ref(''); const email = ref(''); const password = ref(''); const showPassword = ref(false); const loading = ref(false); const error = ref('');
async function submit() {
  loading.value = true; error.value = '';
  try { if (mode.value === 'login') await auth.login(email.value, password.value); else await auth.register(name.value, email.value, password.value); await router.push(String(route.query.redirect ?? '/')); }
  catch (e) { error.value = e instanceof Error ? e.message : '操作失败'; }
  finally { loading.value = false; }
}
</script>

<template>
  <div class="auth-page">
    <section class="auth-art"><div><p>SHIGUANG<br>SELECT</p><span>好生活，从一次认真选择开始。</span></div></section>
    <section class="auth-panel">
      <div class="auth-box">
        <p class="eyebrow">WELCOME TO SHIGUANG</p><h1>{{ mode === 'login' ? '欢迎回来' : '加入拾光集' }}</h1>
        <p class="auth-lead">{{ mode === 'login' ? '登录后查看订单，并继续你的选物旅程。' : '创建账户，收藏属于你的日常好物。' }}</p>
        <form @submit.prevent="submit">
          <div v-if="mode === 'register'" class="form-field"><label for="name">昵称</label><input id="name" v-model.trim="name" required maxlength="100" autocomplete="name" /></div>
          <div class="form-field"><label for="email">邮箱</label><input id="email" v-model.trim="email" required type="email" autocomplete="email" placeholder="you@example.com" /></div>
          <div class="form-field password-field"><label for="password">密码</label><input id="password" v-model="password" required :type="showPassword ? 'text' : 'password'" minlength="8" autocomplete="current-password" placeholder="至少 8 位，含大小写字母和数字" /><button type="button" :aria-label="showPassword ? '隐藏密码' : '显示密码'" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" :size="18"/><Eye v-else :size="18"/></button></div>
          <p v-if="error" class="form-error">{{ error }}</p>
          <button class="primary-btn submit-auth" :disabled="loading">{{ loading ? '请稍候…' : mode === 'login' ? '登录' : '创建账户' }} <ArrowRight :size="17" /></button>
        </form>
        <button class="switch-auth" @click="mode = mode === 'login' ? 'register' : 'login'">{{ mode === 'login' ? '还没有账户？立即注册' : '已有账户？返回登录' }}</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.auth-page{min-height:calc(100vh - 84px);display:grid;grid-template-columns:1fr 1fr}.auth-art{margin:24px;border-radius:var(--radius-lg);background:#cbd2bd;display:grid;place-items:center;position:relative;overflow:hidden}.auth-art::before,.auth-art::after{content:'';position:absolute;border:1px solid rgba(24,32,28,.28);border-radius:50%}.auth-art::before{width:430px;height:430px}.auth-art::after{width:320px;height:320px}.auth-art div{z-index:1;text-align:center}.auth-art p{font:900 clamp(42px,6vw,82px)/.9 'Noto Serif SC';letter-spacing:-.08em;margin:0}.auth-art span{display:block;margin-top:30px}.auth-panel{display:grid;place-items:center;padding:60px 28px}.auth-box{width:min(430px,100%)}.auth-box h1{font:700 48px 'Noto Serif SC';margin:8px 0}.auth-lead{color:var(--muted);margin-bottom:34px}.password-field{position:relative}.password-field button{position:absolute;right:10px;bottom:11px;border:0;background:none;cursor:pointer}.submit-auth{width:100%;margin-top:8px}.switch-auth{display:block;margin:24px auto;border:0;background:none;color:var(--accent-dark);cursor:pointer}.form-field input{height:48px}@media(max-width:760px){.auth-page{grid-template-columns:1fr}.auth-art{display:none}.auth-panel{padding:70px 24px}}
</style>
