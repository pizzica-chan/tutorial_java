-- パスワードはすべて password（BCrypt）
INSERT IGNORE INTO t_user (id, username, password, display_name, email, role) VALUES
(1, 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '管理者', 'admin@example.co.jp', 'ADMIN'),
(3, 'sato', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '佐藤花子', 'sato@example.co.jp', 'USER'),
(7, 'yamada', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '山田太郎', 'yamada@example.co.jp', 'USER');

INSERT IGNORE INTO t_request (id, title, status, applicant_id, approver_id, applicant_email, created_at) VALUES
(11, '備品購入', 'APPROVED', 7, 3, 'yamada@example.co.jp', '2026-04-08 14:00:00'),
(12, '交通費申請', 'PENDING', 7, 3, 'yamada@example.co.jp', '2026-04-10 09:15:00'),
(13, '休暇申請', 'PENDING', 7, 3, 'yamada@example.co.jp', '2026-04-12 11:00:00'),
(15, '出張旅費', 'PENDING', 3, 7, 'sato@example.co.jp', '2026-04-11 16:30:00'),
(16, '研修参加', 'PENDING', 7, NULL, 'yamada@example.co.jp', '2026-04-13 10:00:00');

-- 再起動したら教材の初期状態に戻す（INSERT IGNORE では既存行の status と title は変わらない）
UPDATE t_request SET status = 'APPROVED', updated_at = NULL WHERE id = 11;
UPDATE t_request SET status = 'PENDING', updated_at = NULL WHERE id IN (12, 13, 15, 16);
UPDATE t_request SET title = '研修参加', approver_id = NULL WHERE id = 16;
