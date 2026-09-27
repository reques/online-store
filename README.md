# 在线商城全栈系统

基于 Vue 3、TypeScript、NestJS、Prisma、MySQL、Redis 和 JWT 的可部署全栈商城。

## 功能

- 注册、登录、JWT 身份认证与 `CUSTOMER` / `ADMIN` 角色权限
- 商品公开查询、后台增改和软下架
- 商品详情与热门商品 Redis 缓存，写后失效，缓存故障自动降级
- 事务下单、条件更新防超卖、订单明细快照、用户订单分页
- `(user_id, created_at)` 联合索引及 EXPLAIN 分析脚本
- Swagger、参数校验、统一错误响应、Helmet 和 Docker Compose
- 现代响应式商城前台、购物车、订单中心和商品管理后台

## 前端

前端位于 `web/`，使用 Vue 3、TypeScript、Vite、Pinia 与 Vue Router。完整 Compose 启动后访问 `http://localhost:8080`。

单独开发前端时，保持后端运行并执行：

```bash
cd web
npm install
npm run dev
```

Vite 会将 `/api` 请求代理到 `http://localhost:3000`，开发页面位于 `http://localhost:5173`。

## 本地运行

复制 `.env.example` 为 `.env`，然后启动 MySQL 与 Redis。执行：

```bash
npm install
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
npm run start:dev
```

API 默认地址为 `http://localhost:3000/v1`，Swagger 位于 `http://localhost:3000/docs`。种子管理员为 `admin@example.com` / `Admin123!`，仅用于本地演示，生产环境必须修改。

## Docker Compose

```bash
docker compose up --build -d
docker compose exec api npm run prisma:seed
docker compose ps
curl http://localhost:3000/v1/health
```

生产环境应显式设置随机 `JWT_SECRET` 和数据库密码，不应使用 Compose 中的开发默认值。

## 主要接口

| 方法 | 路径 | 权限 | 用途 |
| --- | --- | --- | --- |
| POST | `/v1/auth/register` | 公开 | 注册并签发 Token |
| POST | `/v1/auth/login` | 公开 | 登录 |
| GET | `/v1/auth/me` | 登录 | 当前身份 |
| GET | `/v1/products` | 公开 | 热门商品分页 |
| GET | `/v1/products/:id` | 公开 | 商品详情 |
| POST/PATCH/DELETE | `/v1/products` | 管理员 | 商品管理 |
| POST | `/v1/orders` | 登录 | 创建订单 |
| GET | `/v1/orders` | 登录 | 本人订单分页 |
| GET | `/v1/orders/admin/all` | 管理员 | 全部订单分页 |

创建订单示例：

```json
{ "items": [{ "productId": 1, "quantity": 2 }] }
```

## 质量检查

```bash
npm run build
npm test
npm run lint
```

数据库索引分析见 `docs/database-performance.md`，完整实施清单见 `docs/plans/2026-09-25-online-store-backend.md`。
