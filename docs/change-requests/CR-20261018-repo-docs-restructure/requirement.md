# CR-20261018-repo-docs-restructure: CLAUDE.md, tổ chức lại docs, chuẩn hoá deploy

- **Trạng thái:** Merged (không cần deploy - chỉ đổi docs và script vận hành)
- **Người yêu cầu:** Tony Hoang
- **Ngày tạo:** 2026-10-18
- **Nhánh:** `cr/repo-docs-restructure`

## Bối cảnh
Tài liệu nằm rải rác ở 5 nơi (thư mục gốc, `docs/`, `.knowledge/`, `change-requests/`, `.github/`) và nhiều phần đã cũ (submodule, git-flow, quy trình CR pending/approved). Có 6 script deploy chồng chéo nhau; host/user/path bị hardcode ở hơn 10 file.

## Yêu cầu
- [x] Tạo `CLAUDE.md`: debug (local + prod), deploy prod bằng công cụ sẵn có, quy trình làm việc.
- [x] Đưa tham số deploy (user, host, port, path, process) vào `.env`; thêm `.env.example`.
- [x] `docs/change-requests/<CR>/` gồm `requirement.md` và `plan.md`.
- [x] `docs/change-logs/<tên>.md` cho mỗi lần merge main + deploy prod.
- [x] Quy trình: thảo luận → hotfix/CR → worktree nhánh mới → code → test local → merge main → deploy prod → ghi change log.

## Quyết định đã chốt
1. Chỉ duy trì nhánh `main`.
2. Tài liệu và script cũ chuyển vào archive (không xoá).
3. Biến deploy để chung trong `.env`, có tiền tố `DEPLOY_`.
4. Tiêu chí hotfix: lỗi prod, khoảng < 50 dòng, không đổi schema/API/dependency.
