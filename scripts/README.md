# Scripts

Cấu hình host/user/path/process lấy từ các biến `DEPLOY_*` trong `.env.deploy` (mẫu: [.env.deploy.example](../.env.deploy.example)).

| Script | Việc |
|---|---|
| [../deploy-prod.sh](../deploy-prod.sh) | Build local → backup + rsync `dist/` lên từng host → `pm2 restart` → verify. Có `--host`, `--quiet`, `--rollback`, `--list-backups`. Xem `./deploy-prod.sh --help` |
| [check-status.sh](check-status.sh) | Trạng thái prod: pm2, commit đang chạy (`dist/DEPLOY_INFO`), các API port, RAM/disk, public URL |
| [lib/deploy-env.sh](lib/deploy-env.sh) | Load `DEPLOY_*` từ `.env.deploy`, dùng chung cho 2 script trên |
| [run-tests.sh](run-tests.sh) | Chạy unit / e2e / coverage |
| [test-database.sh](test-database.sh) | Tiện ích test DB (seed/clean) |
| [generate-module.sh](generate-module.sh) | Sinh khung module NestJS |

```bash
./deploy-prod.sh                    # deploy main lên tất cả host
./scripts/check-status.sh           # kiểm tra sau deploy
./scripts/check-status.sh vm2       # một host (vm1/vm2/vm3 = thứ tự trong DEPLOY_HOSTS)
./deploy-prod.sh --rollback         # quay về bản backup mới nhất trên mọi host
```

Script cũ (git pull + build trên server, submodule, git-flow) đã chuyển vào [archive/](archive/) - không dùng nữa.
