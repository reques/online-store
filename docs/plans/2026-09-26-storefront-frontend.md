# Storefront Frontend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为现有 NestJS 商城提供一个可直接使用和容器化部署的现代 Vue 3 电商前端。

**Architecture:** 前端位于 `web/`，使用 Vue Router 组织页面、Pinia 管理认证和购物车、统一 API 客户端对接 `/api/v1`。开发时 Vite 将 `/api` 代理到本机后端，生产环境由 Nginx 将同一路径转发至 Compose 中的 `api` 服务。

**Tech Stack:** Vue 3, TypeScript, Vite, Pinia, Vue Router, Vitest, Nginx, Docker Compose

---

### Task 1: 工程骨架与设计系统

**Files:** `web/package.json`, `web/vite.config.ts`, `web/src/main.ts`, `web/src/styles/*`

1. 建立严格 TypeScript 的 Vue/Vite 工程。
2. 定义色彩、字体、间距、圆角、阴影和响应式断点。
3. 运行 `npm run type-check` 与 `npm run build`，预期生成静态产物。

### Task 2: API、认证和购物车状态

**Files:** `web/src/api/*`, `web/src/stores/*`, `web/src/types/*`

1. 定义与后端一致的 User、Product、Order 类型。
2. 实现统一请求、Bearer Token、错误解析和 401 清理。
3. 实现持久化认证状态和本地购物车，并为金额/数量逻辑编写测试。

### Task 3: 商城浏览与认证页面

**Files:** `web/src/views/HomeView.vue`, `ProductDetailView.vue`, `AuthView.vue`

1. 实现商品搜索、分页、加载骨架和空状态。
2. 实现详情、库存数量选择和加入购物车。
3. 实现登录/注册以及登录后返回原页面。

### Task 4: 购物车与订单

**Files:** `web/src/views/CartView.vue`, `OrdersView.vue`

1. 实现数量调整、移除、总价和库存限制。
2. 实现登录保护、事务下单请求和成功清空。
3. 实现订单分页、状态标签和明细展开。

### Task 5: 管理后台

**Files:** `web/src/views/AdminProductsView.vue`, `src/products/*`

1. 增加管理员全状态商品查询接口。
2. 实现商品新增、编辑、上下架和库存管理。
3. 验证 CUSTOMER 无权访问、ADMIN 可完成商品生命周期管理。

### Task 6: 容器化与验收

**Files:** `web/Dockerfile`, `web/nginx.conf`, `docker-compose.yml`, `README.md`

1. 构建前端静态文件并通过 Nginx 托管。
2. 配置 SPA fallback、API 反向代理和前端健康检查。
3. 完整运行 lint、测试、构建、Compose 健康检查及核心页面烟测。
