-- 将 1 替换为待分析用户 ID。该查询命中 idx_orders_user_created 联合索引。
EXPLAIN ANALYZE
SELECT id, order_no, user_id, status, total_amount, created_at
FROM orders
WHERE user_id = 1
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;

SHOW INDEX FROM orders WHERE Key_name = 'idx_orders_user_created';
