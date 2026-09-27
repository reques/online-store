# 订单分页索引说明

`orders` 表建立了 `idx_orders_user_created(user_id, created_at DESC)` 联合索引。用户订单列表先按 `user_id` 等值过滤，再按 `created_at DESC` 排序，符合最左前缀原则，可同时避免全表扫描和 filesort。

启动 MySQL 并执行 `scripts/explain-user-orders.sql`。理想执行计划应显示使用 `idx_orders_user_created`，扫描行数接近分页大小。深分页流量显著增长后可将接口升级为游标分页：`WHERE user_id = ? AND created_at < ? ORDER BY created_at DESC LIMIT ?`。
