# CLAUDE.md - LCM Service

Hệ thống quản lý thu hồi nợ (Loans Collection Management) cho VPLS Hoàn Kim. NestJS 8 + TypeScript 4, TypeORM (MongoDB), MSSQL (`mssql`), RabbitMQ. Tổng quan nghiệp vụ: [README.md](README.md), [docs/business-workflows.md](docs/business-workflows.md), schema: [docs/database-schema.md](docs/database-schema.md).

## Kiến trúc chạy

Một codebase, một `dist/main.js`, chạy ở 3 chế độ theo `APP_TYPE` ([src/main.ts](src/main.ts)):

| APP_TYPE | Làm gì | Process pm2 trên prod |
|---|---|---|
| `api` (mặc định) | REST API, cổng `API_PORT` | `lcm-api` :3005, `lcm-api1` :3105, `lcm-api2` :3205 |
| `microservice` | Consumer RabbitMQ queue `RABBITMQ_QUEUE` (`@EventPattern`: `process-import-data`, `process-export-data`, data-migration, MSSQL table import) | `lcm-ms-file` (queue `lcm-file`), `lcm-ms-sync` (queue `lcm-sync`) |
| `worker` | Vòng lặp nền, `WORKER_TYPE` = `data-migration` (mặc định) \| `payment-migration` ([src/workers/](src/workers/)) | `lcm-wrk`, `lcm-wrk:payment-migration` |

Cấu hình từng process: [ecosystem.config.js](ecosystem.config.js). Biến chung (DB, queue, secret) từ `.env` trên mỗi host.

Cấu trúc code: `src/modules/<domain>/` (controller, service, module, `dto/`, `entity/`, `enum/`), `src/common/` (base class, guard, utils - **là code thường trong repo**, không còn là submodule). Quy ước DTO: [docs/dto-design-principles.md](docs/dto-design-principles.md).

## Lệnh thường dùng

```bash
npm run build            # nest build -> dist/  (luôn chạy trước khi coi là xong)
npm test                 # jest unit (rất ít test - xem "Test local" bên dưới)
npm run lint
npm run api              # API local, watch (cổng API_PORT trong .env, mặc định 3000; prod dùng 3005)
npm run ms:dev           # microservice local (queue theo RABBITMQ_QUEUE trong .env)
npm run wrk:dev          # worker data-migration
npm run wrk-payment:dev  # worker payment-migration
```

## Môi trường (.env, .env.deploy)

2 file ở gốc repo, đều **gitignored**. Không bao giờ commit hay in giá trị secret ra log/chat.

| File | Ai đọc | Mẫu |
|---|---|---|
| `.env` | App (NestJS `ConfigModule`) | [.env.example](.env.example) |
| `.env.deploy` | Chỉ `deploy-prod.sh`, `scripts/check-status.sh` | [.env.deploy.example](.env.deploy.example) |

- Biến app (`.env`): `NODE_ENV`, `APP_TYPE`, `API_PORT`, `WORKER_*`, `MONGODB_URL`, `MONGODB_VOICE_URL`, `MSSQLDB_URL`, `RABBITMQ_URL`, `RABBITMQ_QUEUE`, `JWT_*`, `APP_ID/SECRET/ROLE`, `SIMEDGE_APP_*`, `*_API_ROOT_URL`.
- Biến deploy (`.env.deploy`):

| Biến | Giá trị hiện tại | Ý nghĩa |
|---|---|---|
| `DEPLOY_HOSTS` | `10.10.0.70,10.10.0.71,10.10.0.72` | Các VM prod (vm1, vm2, vm3) |
| `DEPLOY_SSH_USER` | `root` | User SSH (dùng SSH key, không password) |
| `DEPLOY_SSH_PORT` | `22` | |
| `DEPLOY_APP_DIR` | `/root/apps/lcm-service` | Thư mục app trên host (có `dist/`, `.env`, `node_modules/`, `ecosystem.config.js`) |
| `DEPLOY_PM2_PROCESSES` | `lcm-ms-file lcm-api lcm-api1 lcm-api2` | Restart mỗi lần deploy |
| `DEPLOY_PM2_QUIET_PROCESSES` | `lcm-ms-sync lcm-wrk` | Chỉ restart với `--quiet`, vào giờ thấp điểm |
| `DEPLOY_API_PORTS` | `3005,3105,3205` | Kiểm tra `GET /` sau restart |
| `DEPLOY_PUBLIC_URL` | `https://api.hydrabyte.co/lcm` | Endpoint public qua load balancer |
| `DEPLOY_BACKUP_KEEP` | `5` | Số bản `dist.bak-*` giữ lại trên mỗi host |

Biến môi trường shell ghi đè `.env.deploy`, ví dụ `DEPLOY_HOSTS=10.10.0.70 ./scripts/check-status.sh`.

⚠️ `.env` local có thể trỏ vào DB/queue **thật**. Trước khi chạy worker, migration, import hoặc `ms:dev` ở local, kiểm tra `MONGODB_URL`, `MSSQLDB_URL`, `RABBITMQ_URL`, `RABBITMQ_QUEUE` - chạy consumer local trên queue prod sẽ **giành message của prod**.

## Debug

### Local
- VS Code: [.vscode/launch.json](.vscode/launch.json) có sẵn `Debug API Server`, `Debug Microservice`, `Debug Worker`, `Debug Payment Worker`, `Debug Current Test File`, và compound `Debug Full LCM Stack`. Các config này đặt sẵn `APP_TYPE`/`API_PORT`/`RABBITMQ_QUEUE`; phần còn lại lấy từ `.env`.
- CLI: `npm run start:debug` (inspector :9229), `npm run test:debug`.
- Kiểm tra API sống: `curl localhost:<API_PORT>/` → `{appId, appName, buildAt, processId}`.
- Log: `src/common/utils/log-helper.ts` (`logInfo`/`logWarning`/...), bật bằng `LOGGER=1`, `LOGGER_INLINE=1` để in một dòng.

### Production (chỉ đọc trước, sửa sau)
```bash
./scripts/check-status.sh [all|vm1|vm2|vm3|<ip>]   # pm2, commit đang chạy, các port, RAM/disk, public URL
./deploy-prod.sh --list-backups                      # backup + DEPLOY_INFO trên từng host

ssh root@10.10.0.70                                  # (user/host theo DEPLOY_*)
pm2 ls                                               # trạng thái, số lần restart (↺ tăng liên tục = crash loop)
pm2 logs lcm-api --lines 200                         # log; --err chỉ lỗi; ~/.pm2/logs/<name>-{out,error}.log
pm2 describe lcm-ms-file                             # env, đường dẫn log, uptime, memory
cat /root/apps/lcm-service/dist/DEPLOY_INFO          # commit nào đang chạy
curl -s localhost:3005/                              # API trên host (3105, 3205 cho api1/api2)
```
- Không có endpoint `/health`: `HealthModule` ([src/modules/health/](src/modules/health/)) **chưa được import** vào `AppModule`. Dùng `GET /`.
- `max_memory_restart` là 1G (api) / 4G (ms, wrk) - restart đột ngột khi import file lớn thường là do chạm ngưỡng này; xem `pm2 describe`.
- Load balancer chia request qua 9 instance (3 host × 3 port): lỗi chỉ xảy ra lúc có lúc không thường là do một instance lệch phiên bản hoặc đang lỗi - so `DEPLOY_INFO` và `pm2 ls` giữa các host.
- Không sửa code, `.env` hay restart process trên prod khi chưa được người dùng đồng ý. Đọc log và trạng thái thì thoải mái.

## Deploy production

Chỉ deploy từ **checkout chính** (thư mục chứa `.env.deploy`), nhánh `main`, đã push. Script: [deploy-prod.sh](deploy-prod.sh).

```bash
./deploy-prod.sh                      # mọi host, lần lượt từng host
./deploy-prod.sh --host 10.10.0.70    # một host (thử trước trên 1 host nếu thay đổi rủi ro)
./deploy-prod.sh --quiet              # thêm restart lcm-ms-sync, lcm-wrk (giờ thấp điểm)
./deploy-prod.sh --rollback [dist.bak-YYYYMMDDHHMMSS]   # mặc định: backup mới nhất
./deploy-prod.sh --skip-checks        # bỏ kiểm tra git - chỉ khi khẩn cấp
```

Script làm gì: kiểm tra đang ở `main`, không có thay đổi chưa commit, `HEAD == origin/main` → `npm run build` → ghi `dist/DEPLOY_INFO` (commit, người build, thời điểm) → với **từng host lần lượt**: backup `dist` thành `dist.bak-<timestamp>` (giữ `DEPLOY_BACKUP_KEEP` bản), `rsync --delete` `dist/`, `pm2 restart`, kiểm tra pm2 online và `GET /` trên mọi `DEPLOY_API_PORTS`. Host nào verify lỗi thì **dừng**, các host sau giữ nguyên, script in lệnh rollback.

Script **chỉ đồng bộ `dist/`**. Các thay đổi sau phải làm tay trên từng host (ghi vào plan và change-log):
- `package.json` / `package-lock.json` đổi (thêm/nâng thư viện): copy 2 file lên `DEPLOY_APP_DIR` rồi `npm ci --production` trên host **trước** khi deploy.
- `ecosystem.config.js` đổi: copy lên host, `pm2 reload ecosystem.config.js --only <name> --update-env`, rồi `pm2 save`.
- Biến `.env` mới: thêm vào `.env` trên từng host, restart process liên quan với `--update-env`.

Sau deploy: `./scripts/check-status.sh` và kiểm tra nghiệp vụ theo plan.

**Luôn hỏi người dùng xác nhận ngay trước khi chạy `./deploy-prod.sh` hoặc `--rollback`**, kèm commit, các host, các process sẽ restart.

## Quy trình làm việc

### 1. Thảo luận
Hỏi cho rõ yêu cầu, phạm vi, tiêu chí chấp nhận. Chưa code khi yêu cầu chưa đủ rõ. Khi đủ rõ, phân loại:
- **Hotfix**: lỗi trên prod, sửa nhỏ (khoảng < 50 dòng), không đổi schema dữ liệu, không đổi API contract, không đổi dependency.
- **CR**: còn lại (tính năng, refactor, đổi schema/API/dependency/cấu hình).

### 2. Tài liệu CR (chỉ với CR)
Tạo `docs/change-requests/CR-YYYYMMDD-<slug>/` từ [docs/change-requests/_template/](docs/change-requests/_template/):
- `requirement.md`: yêu cầu đã chốt, ngoài phạm vi, tiêu chí chấp nhận.
- `plan.md`: phân tích ảnh hưởng, các bước, checklist test, bước tay khi deploy, rollback.

**Chờ người dùng duyệt plan** rồi mới code. `<slug>` dạng kebab-case ngắn, dùng chung cho tên thư mục, nhánh, worktree.

### 3. Worktree + nhánh
```bash
git fetch origin && git checkout main && git pull
git worktree add -b cr/<slug> ../lcm-service-wt/<slug> main      # hotfix: hotfix/<slug>
cd ../lcm-service-wt/<slug>
ln -s ../../lcm-service/.env .env                                 # dùng chung .env (không cần .env.deploy - không deploy từ worktree)
ln -s ../../lcm-service/node_modules node_modules                 # hoặc npm ci nếu package.json đổi
```
Thư mục CR (bước 2) tạo và commit ngay trong worktree này.

### 4. Code + test local
- Theo đúng pattern module sẵn có; giữ thay đổi trong phạm vi plan.
- Test local (định nghĩa "pass"):
  - [ ] `npm run build` không lỗi
  - [ ] `npm test` không lỗi (thêm `*.spec.ts` cho logic mới khi hợp lý - repo hiện chỉ có 3 file test)
  - [ ] Chạy process bị ảnh hưởng ở local và gọi thử các endpoint/message liên quan theo tiêu chí chấp nhận (cẩn thận với DB/queue thật - xem mục Môi trường)
- Ghi kết quả test vào `plan.md` (CR) hoặc báo trong chat (hotfix).

### 5. Merge + deploy (hỏi xác nhận trước)
```bash
cd /Users/dzung/Code/hydra-byte/lcm-service        # checkout chính
git checkout main && git pull
git merge --no-ff cr/<slug>
npm run build && git push origin main
./deploy-prod.sh                                   # sau khi người dùng đồng ý
./scripts/check-status.sh
```

### 6. Ghi change log + dọn dẹp
- Tạo `docs/change-logs/YYYYMMDD-<slug>.md` từ [_template.md](docs/change-logs/_template.md): commit đã deploy, host, process đã restart, tên backup, kết quả kiểm tra, lệnh rollback, bước tay đã làm. **Bắt buộc cho cả hotfix.**
- CR: cập nhật trạng thái `Deployed` trong `requirement.md`.
- Commit + push change log lên `main` (chỉ đổi docs, không cần deploy lại).
- Xoá worktree - git ở máy này là 2.15, **không có** `git worktree remove`:
  ```bash
  rm -rf ../lcm-service-wt/<slug> && git worktree prune
  git branch -d cr/<slug>
  ```

## Git

- Remote: `origin` = `https://github.com/hydrabyte-co/legacy-lcm.git` (URL cũ `tonyh881722/lcm-service` vẫn redirect).
- **Chỉ duy trì nhánh `main`** - là nguồn deploy prod. Nhánh làm việc: `cr/<slug>`, `hotfix/<slug>`, xoá sau khi merge.
- Commit message ngắn, mô tả việc đã làm (theo lịch sử: `fix ...`, `add ...`, `update ...`).

## Tài liệu

```
CLAUDE.md                   # file này - nguồn chính về vận hành & quy trình
docs/
├── change-requests/        # CR-YYYYMMDD-<slug>/{requirement,plan}.md, _template/
├── change-logs/            # YYYYMMDD-<slug>.md - mỗi lần merge main + deploy prod
├── business-workflows.md   # nghiệp vụ thu hồi nợ
├── database-schema.md
├── API_INTEGRATION_AUTOMATION.md
├── dto-design-principles.md
├── troubleshooting.md      # một số phần có thể đã cũ - đối chiếu với code
└── archive/                # tài liệu cũ (submodule, git-flow, script deploy cũ) - không dùng
src/modules/<module>/README.md   # mô tả từng module
```
