# Playbook: chuẩn hoá repo một service

Áp dụng cho một repo service cũ: bỏ submodule, chuyển từ GitLab sang GitHub, quy hoạch `.env`, gom script deploy, tổ chức lại `docs/`, viết `CLAUDE.md` và quy trình hotfix/CR.

**Mẫu tham chiếu:** `lcm-service` (`/Users/dzung/Code/hydra-byte/lcm-service`, GitHub `hydrabyte-co/legacy-lcm`). Các commit tương ứng:

| Bước | Commit trong lcm-service |
|---|---|
| Submodule → code thường, bỏ GitLab CI | `610cc43` |
| Deploy: build local + rsync `dist` + backup | `c4a73c5` |
| CLAUDE.md, docs/, deploy đọc config từ env | `ed5812b` |
| Tách `.env.deploy` | `3efd135` |

**Cách dùng với Claude Code:** mở Claude Code trong repo cần chuẩn hoá và nói:
> Đọc `/Users/dzung/Code/hydra-byte/lcm-service/docs/playbook-chuan-hoa-repo.md`, khảo sát repo này theo Bước 0 và đề xuất trước khi làm. Mẫu tham chiếu là lcm-service.

Thứ tự nên giữ nguyên: Bước 1–2 làm thẳng trên `main` (repo chưa có quy trình); từ Bước 3 trở đi làm trong worktree theo quy trình CR, và chính lần chuẩn hoá này là CR đầu tiên.

---

## Bước 0 - Khảo sát (chỉ đọc, chưa sửa gì)

```bash
git remote -v; git branch -a -vv; git ls-remote --heads origin
cat .gitmodules; git submodule status                   # có submodule không, trỏ đi đâu
ls .gitlab-ci.yml .github/workflows 2>/dev/null          # CI cũ
grep -rn "gitlab\|registry\.gitlab" --exclude-dir=node_modules --exclude-dir=dist .
ls *.sh deploy* scripts/ ecosystem.config.js Dockerfile* 2>/dev/null   # script deploy/build
grep -rhoE "process\.env\.[A-Z_0-9]+" src | sort | uniq -c | sort -rn  # biến env code đọc
sed -E 's/=.*/=***/' .env                               # key trong .env (che giá trị)
find . -name "*.md" -not -path "./node_modules/*" -not -path "./dist/*"  # tài liệu nằm ở đâu
git log --all --oneline -- .env | head                  # .env từng bị commit chưa?
git --version                                            # < 2.17 thì không có `git worktree remove`
```

Viết ra cho rõ: **cách deploy prod thực tế đang dùng** (script nào mới nhất, server nào, user nào, process pm2 nào, port nào), script nào đã chết, tài liệu nào đã sai, và các nhánh. Chốt với người dùng 4 quyết định trước khi làm:
1. Nhánh nào được giữ (lcm: chỉ `main`).
2. Tài liệu và script cũ: xoá hay archive (lcm: archive).
3. Biến deploy để ở đâu (lcm: tách ra `.env.deploy`).
4. Tiêu chí hotfix (lcm: lỗi prod, khoảng < 50 dòng, không đổi schema/API/dependency).

---

## Bước 1 - Submodule → code thường

Áp dụng khi repo có submodule (lcm: `src/common` → `gitlab.com:bitthing.io/service-common`). Sau bước này, mỗi service tự giữ bản `common` của mình, không còn đồng bộ với repo khác.

```bash
SUB=src/common
git -C $SUB status --short                # phải sạch - working copy này có thể là bản DUY NHẤT còn lại
git -C $SUB log -1 --format='%h %s'       # ghi lại commit gốc để đưa vào commit message
cp -R $SUB /tmp/sub-copy
git submodule deinit -f $SUB
git rm -f $SUB
rm -rf .git/modules/$SUB
cp -R /tmp/sub-copy $SUB && rm -rf $SUB/.git
git add $SUB
[ -s .gitmodules ] || git rm -q .gitmodules   # git rm đã bỏ entry; file rỗng thì xoá luôn
```

Dọn các chỗ còn nhắc tới submodule:
- `.gitignore`: các dòng ignore `common` hay `/src/common` (lcm có cả hai, nếu không xoá thì code vừa thêm vào sẽ bị ignore).
- `git config --get-regexp submodule` → `git config --remove-section submodule.<path>`.
- Script và CI: `git submodule ...`, `GIT_SUBMODULE_STRATEGY`.
- README: phần hướng dẫn `clone --recursive`.

Kiểm tra: `npm run build` pass, `git status` sạch, `git ls-files $SUB | wc -l` > 0.

Commit message ghi rõ nguồn, ví dụ: `convert src/common submodule to regular files` + `inlined at service-common@34b54da`.

---

## Bước 2 - GitLab → GitHub

```bash
gh repo create hydrabyte-co/<repo> --private              # tạo thẳng dưới org, đừng tạo ở tài khoản cá nhân
git remote set-url origin https://github.com/hydrabyte-co/<repo>.git
git push -u origin main
git push origin --tags
```

- Xoá `.gitlab-ci.yml`. Các script build hay push image lên `registry.gitlab.com` thì sửa lại chỉ build image local (lcm: `build-container.sh`).
- Nếu server prod đang `git pull` từ GitLab, kể từ đây server **không pull được nữa**. Chuyển sang build local rồi rsync `dist` (Bước 4).
- Nhánh: chỉ giữ `main`. Trước khi xoá nhánh khác, kiểm tra nhánh đó đã được merge chưa:
  ```bash
  git merge-base --is-ancestor origin/<branch> main && echo merged
  gh repo edit hydrabyte-co/<repo> --default-branch main
  git push origin --delete <branch>          # chỉ sau khi đã chắc
  ```
- **Bài học từ lcm:** repo bị tạo ở tài khoản cá nhân trước rồi mới chuyển sang org. GitHub vẫn redirect nên push được, nhưng nhánh mặc định vẫn là `stable` và URL remote ở các máy bị cũ. Nên tạo thẳng trong org và đặt `main` làm nhánh mặc định ngay từ đầu.
- Với Claude Code ở auto mode, lệnh `git remote set-url` có thể bị chặn. Khi đó người dùng tự chạy lệnh này.

---

## Bước 3 - Quy hoạch env

Hai file ở gốc repo, **cả hai đều gitignored**, mỗi file có một file mẫu được commit:

| File | Ai đọc | Mẫu (commit) |
|---|---|---|
| `.env` | App | `.env.example` |
| `.env.deploy` | Chỉ script deploy/status | `.env.deploy.example` |

**`.env.example`:** liệt kê **mọi** biến mà code đọc (lấy từ lệnh `grep process.env` ở Bước 0), chia nhóm Node / App / Worker / Database / Queue / Auth / External services. Giá trị để trống hoặc là placeholder. Comment phải nằm trên dòng riêng, không viết comment cuối dòng sau giá trị.

**`.env.deploy.example`** (ví dụ của lcm, sửa cho service mới):
```bash
DEPLOY_HOSTS=10.10.0.70,10.10.0.71,10.10.0.72
DEPLOY_SSH_USER=root
DEPLOY_SSH_PORT=22
DEPLOY_APP_DIR=/root/apps/<service>
DEPLOY_PM2_PROCESSES="<các process restart mỗi lần deploy>"
DEPLOY_PM2_QUIET_PROCESSES="<worker/sync chỉ restart giờ thấp điểm>"
DEPLOY_API_PORTS=<port1>,<port2>
DEPLOY_PUBLIC_URL=https://api.hydrabyte.co/<service>
DEPLOY_BACKUP_KEEP=5
```
Lấy giá trị từ script deploy đang dùng, file `hosts` và `ecosystem.config.js`, không đoán.

**Sắp xếp lại `.env` thật:** dùng script để giữ nguyên từng dòng `KEY=value` và chỉ đổi thứ tự hoặc thêm comment. **Không in giá trị ra màn hình.** Backup file trước, rồi đối chiếu sau khi sửa:
```bash
norm(){ grep -E '^[A-Z][A-Z0-9_]*=' "$1" | sort; }
diff <(norm env.backup) <(cat <(norm .env) <(norm .env.deploy) | sort) && echo IDENTICAL
```
Biến tuỳ chọn mà code có đọc nhưng `.env` chưa có thì thêm **dạng comment** (`# APP_ROLE=`), để hành vi app không đổi.

`.gitignore`: thêm `.env`, `.env.deploy`, và `hosts` nếu file này còn.

Ghi lại để xử lý sau, không sửa trong CR này:
- Secret hardcode làm giá trị mặc định trong code (lcm: `SIMEDGE_APP_PASS` trong `basic-auth.strategy.ts`).
- `.env` từng bị commit vào lịch sử git.

---

## Bước 4 - Gom script deploy

Copy từ lcm rồi sửa lại cho service mới:
- `deploy-prod.sh`
- `scripts/lib/deploy-env.sh`: loader chỉ đọc các dòng `DEPLOY_*` trong `.env.deploy`; biến shell ghi đè được; báo lỗi nếu thiếu biến.
- `scripts/check-status.sh`

`deploy-prod.sh` của lcm có:
- Guard: chỉ chạy trên `main`, không có thay đổi chưa commit, `HEAD == origin/main` (`--skip-checks` cho khẩn cấp).
- `npm run build`, rồi ghi `dist/DEPLOY_INFO` (commit, người build, thời điểm). Đây là cách biết prod đang chạy commit nào.
- Deploy **lần lượt từng host**: backup `dist` thành `dist.bak-<YYYYmmddHHMMSS>` (giữ N bản), `rsync --delete`, `pm2 restart`, kiểm tra pm2 `online` và gọi HTTP vào mọi API port. Host nào lỗi thì dừng, các host sau giữ nguyên.
- `--host`, `--quiet` (restart thêm worker/sync), `--rollback [backup]`, `--list-backups`.

Phần phải sửa cho service mới:
- **Endpoint kiểm tra:** xác nhận route đó thật sự được đăng ký. lcm có code `HealthModule` nhưng chưa import vào app nên `/health` trả 404; script phải dùng `GET /`.
- Danh sách process, port, thư mục app.
- Lệnh build và thư mục output (`dist/`, hoặc `dist/main.js` nếu dùng webpack).

Script chỉ đồng bộ `dist/`. Ghi rõ trong CLAUDE.md các việc phải làm tay trên host: đổi dependency (`npm ci --production`), đổi `ecosystem.config.js` (`pm2 reload ... --update-env && pm2 save`), thêm biến `.env`.

Script cũ (`git pull` trên server, submodule, git-flow, `deploy-*.sh` chồng chéo) chuyển vào `scripts/archive/`.

Test không đụng prod:
- `bash -n` cho các script.
- `--help`; chạy từ một nhánh khác `main` phải bị chặn.
- Chạy loader với `.env.deploy.example`.
- Bỏ một biến bắt buộc thì phải báo lỗi.
- Parser `pm2 jlist` phải chịu được dòng cảnh báo ở đầu output.

Lần deploy thật đầu tiên: dùng `--host <1 host>` trước.

---

## Bước 5 - Tổ chức lại docs/

```
CLAUDE.md                       # nguồn chính: vận hành + quy trình
README.md                       # giới thiệu, cài đặt (sửa link, bỏ phần submodule/GitLab)
.env.example, .env.deploy.example
docs/
├── change-requests/
│   ├── _template/{requirement,plan}.md
│   └── CR-YYYYMMDD-<slug>/{requirement,plan}.md
├── change-logs/
│   ├── _template.md
│   └── YYYYMMDD-<slug>.md      # mỗi lần merge main (+ deploy prod)
├── <tài liệu tham khảo còn đúng: nghiệp vụ, schema, API...>
└── archive/README.md + tài liệu cũ
scripts/README.md, scripts/lib/, scripts/archive/
```

- Dùng `git mv` để giữ lịch sử. Gom tài liệu từ mọi nơi (thư mục gốc, `.knowledge/`, `.github/copilot-instructions.md`, `change-requests/` cũ): cái nào còn đúng thì vào `docs/`, cái nào sai hoặc cũ thì vào `docs/archive/`.
- `docs/archive/README.md` ghi rõ: "không còn đúng, nguồn đúng là CLAUDE.md".
- CR cũ (nếu có) chuyển sang dạng thư mục `CR-YYYYMMDD-<slug>/requirement.md`.
- Copy 3 template từ `lcm-service/docs/change-requests/_template/` và `docs/change-logs/_template.md`.
- Sau khi chuyển: grep tên các file và thư mục cũ ở mọi chỗ **ngoài** archive, rồi sửa các link còn trỏ tới chúng.

---

## Bước 6 - CLAUDE.md

Copy khung từ `lcm-service/CLAUDE.md`, viết lại nội dung theo service mới. Các mục bắt buộc:

1. **Kiến trúc chạy:** các chế độ (api / microservice / worker…), bảng chế độ → process pm2 → port/queue.
2. **Lệnh thường dùng:** build, test, lint, chạy từng chế độ ở local.
3. **Môi trường:** bảng 2 file env, bảng biến deploy kèm giá trị hiện tại; cảnh báo nếu `.env` local trỏ vào DB/queue thật (consumer chạy local sẽ giành message của prod).
4. **Debug local:** cấu hình `launch.json`, `start:debug`, cách kiểm tra app đang sống, cách bật log.
5. **Debug prod:** `check-status.sh`, `--list-backups`, các lệnh `ssh` / `pm2 ls|logs|describe` / `cat dist/DEPLOY_INFO` / `curl localhost:<port>`; ngưỡng `max_memory_restart`; lỗi chỉ xảy ra lúc có lúc không khi chạy nhiều instance sau load balancer. Quy tắc: đọc thì thoải mái, còn sửa hay restart thì phải hỏi.
6. **Deploy:** lệnh và tuỳ chọn, script làm gì, các việc phải làm tay, **luôn hỏi xác nhận trước khi deploy hoặc rollback**.
7. **Quy trình làm việc** (Bước 7).
8. **Git:** remote, chỉ dùng `main`, đặt tên nhánh, kiểu commit message.
9. **Sơ đồ tài liệu.**

Viết đúng những gì đang chạy thật (kiểm tra trong code), không chép từ tài liệu cũ.

---

## Bước 7 - Quy trình làm việc (ghi vào CLAUDE.md)

1. **Thảo luận** đến khi yêu cầu rõ, rồi phân loại **hotfix** hoặc **CR**.
2. **CR:** tạo `docs/change-requests/CR-YYYYMMDD-<slug>/requirement.md` và `plan.md`, **chờ người dùng duyệt plan**. Hotfix bỏ qua bước này.
3. **Worktree:** `git worktree add -b cr/<slug> ../<repo>-wt/<slug> main` (hotfix thì dùng `hotfix/<slug>`). Symlink `.env` và `node_modules` từ checkout chính; **không** symlink `.env.deploy` vì không deploy từ worktree.
4. **Code + test local:** build pass, `npm test` pass, chạy thử phần bị ảnh hưởng ở local. Ghi kết quả vào `plan.md`.
5. **Merge + deploy (hỏi xác nhận):** ở checkout chính, `git merge --no-ff`, push, `./deploy-prod.sh`, `./scripts/check-status.sh`.
6. **Change log** `docs/change-logs/YYYYMMDD-<slug>.md` (bắt buộc cả với hotfix): commit, host, process, tên backup, lệnh rollback, các việc làm tay. Sau đó dọn worktree:
   ```bash
   rm -rf ../<repo>-wt/<slug> && git worktree prune && git branch -d cr/<slug>   # git < 2.17
   ```

---

## Checklist hoàn thành

- [ ] Không còn `.gitmodules`, `git submodule`, `gitlab`, `registry.gitlab.com` (ngoài thư mục archive)
- [ ] Remote là `github.com/hydrabyte-co/<repo>`, nhánh mặc định `main`, chỉ còn nhánh `main`
- [ ] Đã commit `.env.example` (đủ biến code đọc) và `.env.deploy.example`; `.env` và `.env.deploy` đều gitignored
- [ ] `.env` đã sắp xếp lại và đối chiếu không đổi giá trị nào; đã tạo `.env.deploy`
- [ ] Chỉ còn một script deploy (`deploy-prod.sh`) cùng `check-status.sh`, đọc từ `.env.deploy`; script cũ đã vào archive
- [ ] Endpoint kiểm tra sau deploy đã xác nhận tồn tại trong code
- [ ] `docs/` theo cấu trúc mới, có template; tài liệu cũ đã vào archive; không còn link hỏng
- [ ] `CLAUDE.md` đủ 9 mục, nội dung đã đối chiếu với code
- [ ] `npm run build` pass
- [ ] CR + change log cho chính lần chuẩn hoá này
- [ ] Lần deploy đầu bằng script mới: thử `--host <1 host>`, ghi kết quả vào change log

## Lưu ý về môi trường máy này

- Git 2.15: không có `git worktree remove`; dùng `rm -rf <path> && git worktree prune`.
- Shell zsh: `grep --include=*.ts` phải đặt trong nháy (`--include='*.ts'`), nếu không sẽ báo "no matches found".
- `/bin/bash` trên macOS là 3.2: script deploy chỉ dùng cú pháp tương thích (không dùng `mapfile`, không dùng `${var,,}`). `head -n -N` chỉ chạy trên phía server Linux.
- Worktree mới không có `.env` và `node_modules` (đều gitignored), phải symlink trước khi build.
