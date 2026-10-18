# 2026-10-18 CLAUDE.md, tổ chức lại docs, chuẩn hoá deploy

- **Loại:** CR
- **CR:** [CR-20261018-repo-docs-restructure](../change-requests/CR-20261018-repo-docs-restructure/)
- **Nhánh:** `cr/repo-docs-restructure` → `main`
- **Deploy:** không cần - không đổi `src/`, `package.json`, `ecosystem.config.js`. Bản đang chạy trên prod không bị ảnh hưởng.

## Thay đổi
- Thêm `CLAUDE.md`: kiến trúc chạy, debug local/prod, deploy/rollback, quy trình hotfix/CR, git.
- Thêm `.env.example` (đầy đủ biến app và biến `DEPLOY_*`); `.env` local đã có thêm `DEPLOY_*`.
- `deploy-prod.sh` viết lại: đọc `.env`; chỉ deploy từ `main` đã sạch và khớp `origin/main`; ghi `dist/DEPLOY_INFO`; deploy lần lượt từng host, kiểm tra pm2 và các API port, dừng nếu lỗi; có `--host`, `--quiet`, `--rollback`, `--list-backups`; giữ 5 bản backup.
- `scripts/check-status.sh` viết lại theo `.env`, hiển thị commit đang chạy.
- Tài liệu và script cũ chuyển vào `docs/archive/`, `scripts/archive/`.
- Cấu trúc mới: `docs/change-requests/CR-YYYYMMDD-<slug>/{requirement,plan}.md`, `docs/change-logs/YYYYMMDD-<slug>.md`, có template.

## Ghi chú
- Phát hiện: `HealthModule` chưa được import vào `AppModule` → không có `/health`; script dùng `GET /`.
- Lần deploy tới là lần đầu chạy `deploy-prod.sh` mới trên prod - theo dõi kỹ và ghi lại kết quả ở change log tương ứng.
