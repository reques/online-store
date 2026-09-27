# Online Store Backend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现一个可部署、可测试的 NestJS 在线商城后端，覆盖用户认证、商品缓存、事务下单和订单分页查询。

**Architecture:** 使用 NestJS 模块化单体，Prisma/MySQL 作为权威数据源，Redis 作为可降级缓存。JWT Guard 负责认证，Roles Guard 负责授权，订单写入由 Prisma 交互式事务保证一致性。

**Tech Stack:** TypeScript, Node.js, NestJS, Prisma, MySQL, Redis, JWT, Jest, Docker Compose

---

### Task 1: 工程骨架与运行时配置

**Files:** `package.json`, `tsconfig.json`, `src/main.ts`, `src/app.module.ts`, `src/config/*`

1. 配置 NestJS、严格 TypeScript、环境变量校验和全局异常处理。
2. 添加健康检查及 Swagger 文档入口。
3. 安装依赖并运行 `npm run build`，预期编译成功。

### Task 2: Prisma 数据模型

**Files:** `prisma/schema.prisma`, `prisma/migrations/*`, `prisma/seed.ts`, `src/prisma/*`

1. 建立 User、Product、Order、OrderItem 模型及枚举。
2. 给订单建立 `(user_id, created_at)` 联合索引并生成迁移 SQL。
3. 生成 Prisma Client，验证 schema。

### Task 3: 注册、登录与权限

**Files:** `src/auth/*`, `src/users/*`, `src/common/auth/*`

1. 编写密码校验、重复用户、JWT Guard 和角色授权测试。
2. 实现注册、登录、当前用户接口和统一身份上下文。
3. 验证未登录、过期/非法 Token 与权限不足响应。

### Task 4: 商品与 Redis 缓存

**Files:** `src/products/*`, `src/redis/*`

1. 实现商品管理接口、公开详情和热门分页列表。
2. 实现详情/热门缓存 Key、TTL、回源及写后失效策略。
3. 编写缓存命中、未命中和 Redis 故障降级测试。

### Task 5: 事务订单

**Files:** `src/orders/*`

1. 实现创建订单 DTO 与总价计算测试。
2. 在 Prisma 事务内原子扣库存并写入订单和明细快照。
3. 实现用户订单分页和管理员订单查询，阻止越权访问。

### Task 6: 索引与 EXPLAIN

**Files:** `scripts/explain-user-orders.sql`, `docs/database-performance.md`

1. 提供用户订单分页 SQL 与 EXPLAIN ANALYZE 脚本。
2. 记录联合索引的最左前缀、命中条件和验证方法。

### Task 7: 自动化验证

**Files:** `src/**/*.spec.ts`, `test/*`

1. 运行 lint、单元测试、端到端测试和覆盖率检查。
2. 修复所有编译、类型、lint 和测试失败。

### Task 8: 容器化与交付

**Files:** `Dockerfile`, `docker-compose.yml`, `docker-entrypoint.sh`, `README.md`

1. 构建多阶段、非 root 生产镜像。
2. 编排 API、MySQL、Redis、健康检查和持久化卷。
3. 使用 Docker Compose 启动并实际调用关键 API 验证。
