# Plan: CR-20261018-repo-docs-restructure

## Phân tích ảnh hưởng
- Không đổi `src/`, `package.json`, `ecosystem.config.js` → không ảnh hưởng runtime, không cần deploy.
- `deploy-prod.sh`, `scripts/check-status.sh` giờ đọc `DEPLOY_*` từ `.env` - `.env` local phải có các biến này (đã thêm vào checkout chính).

## Các bước
1. Chuyển vào `docs/archive/`: 6 file .md ở thư mục gốc, `.knowledge/`, `.github/copilot-instructions.md`, `docs/agent-guide.md`, `docs/git-workflow-guide.md`, README + template + tracking json của quy trình CR cũ.
2. Chuyển vào `scripts/archive/`: `deploy`, `build-pm2.sh`, `scripts/deploy*.sh`, `scripts/git-workflow.sh`.
3. CR cũ → `docs/change-requests/CR-20250117-repo-optimization/requirement.md`; `dto-design-principles.md` → `docs/`.
4. `scripts/lib/deploy-env.sh` (loader), viết lại `deploy-prod.sh` (guard git, verify, rollback, quiet, backup retention, `dist/DEPLOY_INFO`) và `check-status.sh`.
5. `.env.example`, `CLAUDE.md`, template CR/change-log, cập nhật `README.md`, `scripts/README.md`.

## Test local
- [x] `bash -n` cho các script.
- [x] Loader: đọc đúng từ `.env.example`, biến shell ghi đè được, báo thiếu biến khi `.env` rỗng.
- [x] `deploy-prod.sh --help`, option lạ → exit 1, chạy từ nhánh khác `main` → bị chặn trước khi build.
- [x] Parser `pm2 jlist`: chịu được dòng cảnh báo ở đầu, phát hiện process errored.
- [x] `npm run build` pass.
- [ ] Chưa chạy thật trên prod: `check-status.sh`, `--list-backups` (chỉ đọc) - chạy ở lần deploy tới.

## Rollback
`git revert` merge commit.
