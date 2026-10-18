# 2026-10-18 Tách cấu hình deploy sang .env.deploy

- **Loại:** Hotfix (thay đổi nhỏ về công cụ, không đổi code app)
- **Nhánh:** `hotfix/env-deploy-split` → `main`
- **Deploy:** không cần - không đổi `src/`, `package.json`, `ecosystem.config.js`.

## Thay đổi
- Các biến `DEPLOY_*` chuyển từ `.env` sang file riêng `.env.deploy` (gitignored). Mẫu: `.env.deploy.example`.
- `scripts/lib/deploy-env.sh` đọc `.env.deploy` (vẫn ghi đè được bằng `ENV_FILE=...` hoặc biến shell).
- `.env.example` chỉ còn biến app. Cập nhật `CLAUDE.md`, `README.md`, `scripts/README.md`.
- `.env` local được sắp xếp lại theo nhóm như `.env.example`, thêm dạng comment các biến tuỳ chọn mà code có đọc (`API_PORT`, `LOGGER_INLINE`, `WORKER_INTERVAL_TIME`, `APP_ROLE`, `SIMEDGE_APP_*`). Không đổi giá trị nào (đã đối chiếu).

## Lưu ý cho máy khác
Ai deploy từ máy khác: `cp .env.deploy.example .env.deploy` và xoá các dòng `DEPLOY_*` cũ trong `.env` (nếu có).
