# YYYY-MM-DD <tiêu đề>

- **Loại:** CR | Hotfix
- **CR:** [CR-YYYYMMDD-<slug>](../change-requests/CR-YYYYMMDD-<slug>/) (hotfix: bỏ dòng này)
- **Nhánh:** `cr/<slug>` → `main` (merge commit `abc1234`)
- **Deploy:** YYYY-MM-DD HH:MM, commit `abc1234`, host: ..., process restart: ...
- **Backup trên host:** `dist.bak-YYYYMMDDHHMMSS`

## Thay đổi
- ...

## Kiểm tra sau deploy
- `./scripts/check-status.sh`: ...
- Kiểm tra nghiệp vụ: ...

## Rollback
`./deploy-prod.sh --rollback dist.bak-YYYYMMDDHHMMSS`

## Ghi chú
Bước tay đã làm, vấn đề phát sinh, việc còn lại.
