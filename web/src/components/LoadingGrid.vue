<template>
  <div class="product-grid" aria-label="商品加载中" aria-busy="true">
    <div v-for="i in 8" :key="i" class="skeleton-card"><div /><span /><span /></div>
  </div>
</template>
