<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
  <div class="site-shell">
    <AppHeader />
    <main><RouterView /></main>
    <footer class="site-footer">
      <div><strong>拾光集</strong><span>把日常，过得更像自己。</span></div>
      <p>© 2026 SHIGUANG SELECT · 用心挑选每件日常好物</p>
    </footer>
  </div>
</template>
