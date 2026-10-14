#!/bin/bash
# Build locally, then on each host: backup current dist, sync new dist, restart lcm api + file consumer.
# lcm-ms-sync / lcm-wrk are NOT restarted here (restart them at a quiet time).
set -e

APP_DIR='~/apps/lcm-service'
PROCESSES='lcm-ms-file lcm-api lcm-api1 lcm-api2'
BACKUP="dist.bak-$(date +%Y%m%d%H%M)"

npm run build

for HOST in $(cat hosts); do
  echo "===== $HOST"
  ssh $HOST "cd $APP_DIR && cp -a dist $BACKUP"
  rsync -a --delete ./dist/ $HOST:$APP_DIR/dist/
  ssh $HOST "pm2 restart $PROCESSES"
done

echo "Done. Rollback: ssh HOST 'cd $APP_DIR && rm -rf dist && mv $BACKUP dist && pm2 restart $PROCESSES'"
