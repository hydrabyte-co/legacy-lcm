# Plan: CR-YYYYMMDD-<slug>

## Phân tích ảnh hưởng
- Module / file: `src/modules/...`
- Process bị ảnh hưởng: lcm-api | lcm-ms-file | lcm-ms-sync | lcm-wrk | ...
- Dữ liệu / schema MongoDB, MSSQL:
- Thay đổi `.env`, `ecosystem.config.js`, `package.json` (cần thao tác tay trên server?):

## Các bước thực hiện
1. ...

## Test local
- [ ] `npm run build` pass
- [ ] `npm test` pass
- [ ] Chạy local (`npm run api` / `ms:dev` / `wrk:dev`) và gọi thử: ...
- [ ] Kết quả: ...

## Deploy
- Restart quiet processes (`--quiet`)? có / không
- Bước tay trên server (nếu có):
- Kiểm tra sau deploy:

## Rollback
`./deploy-prod.sh --rollback <backup>` + bước hoàn tác dữ liệu (nếu có).
