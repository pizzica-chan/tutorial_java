-- 教材「トラブル例：OutOfMemoryError が出る（GC ログ・スレッドダンプ）」の例 3 の再現用。
-- 山田（ID 7）の承認待ちの申請を 1,000 件足す。初期データの申請は ID 16 まで。
-- 消すときは: DELETE FROM t_request WHERE id > 16;
SET SESSION cte_max_recursion_depth = 10000;

INSERT INTO t_request (title, status, applicant_id, approver_id, applicant_email, created_at)
WITH RECURSIVE seq (n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 1000
)
SELECT
  CONCAT('備品購入 ', n),
  'PENDING',
  7,
  3,
  'yamada@example.co.jp',
  TIMESTAMP('2026-04-01 09:00:00') + INTERVAL n MINUTE
FROM seq;
