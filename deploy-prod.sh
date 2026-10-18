#!/bin/bash
# Build locally, then on each host (one by one): backup current dist, rsync new dist, restart pm2, verify.
# Host/user/path/process config comes from DEPLOY_* in .env.deploy (see .env.deploy.example).
#
# Usage:
#   ./deploy-prod.sh                     deploy main to all DEPLOY_HOSTS
#   ./deploy-prod.sh --host 10.10.0.70   deploy to one host only
#   ./deploy-prod.sh --quiet             also restart DEPLOY_PM2_QUIET_PROCESSES (lcm-ms-sync, lcm-wrk) - quiet hours only
#   ./deploy-prod.sh --list-backups      show dist backups on each host
#   ./deploy-prod.sh --rollback [NAME]   restore backup NAME (default: newest dist.bak-*) and restart
#   ./deploy-prod.sh --skip-checks       skip the main/clean/synced git checks (emergency only)
set -e

source "$(dirname "$0")/scripts/lib/deploy-env.sh"
cd "$REPO_DIR"

MODE=deploy
SKIP_CHECKS=0
RESTART_QUIET=0
ROLLBACK_NAME=''
while [[ $# -gt 0 ]]; do
  case $1 in
    --host) HOSTS=("$2"); shift 2 ;;
    --quiet) RESTART_QUIET=1; shift ;;
    --skip-checks) SKIP_CHECKS=1; shift ;;
    --list-backups) MODE=list; shift ;;
    --rollback) MODE=rollback; if [[ -n "$2" && "$2" != --* ]]; then ROLLBACK_NAME=$2; shift; fi; shift ;;
    -h|--help) sed -n 2,11p "$0"; exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

PROCESSES="$DEPLOY_PM2_PROCESSES"
(( RESTART_QUIET )) && PROCESSES="$PROCESSES $DEPLOY_PM2_QUIET_PROCESSES"
APP_DIR="$DEPLOY_APP_DIR"

verify_host() {
  local host=$1 ok=1
  sleep 5
  remote "$host" "pm2 jlist 2>/dev/null" | python3 -c "
import json,sys
raw=sys.stdin.read(); want=set(sys.argv[1].split())
bad=[p['name']+':'+p['pm2_env']['status'] for p in json.loads(raw[raw.index('['):]) if p['name'] in want and p['pm2_env']['status']!='online']
print('  pm2: all online' if not bad else '  pm2 NOT online: '+' '.join(bad)); sys.exit(1 if bad else 0)" "$PROCESSES" || ok=0
  for port in "${API_PORTS[@]}"; do
    if remote "$host" "curl -fsS -m 5 http://localhost:$port/ >/dev/null"; then
      echo "  :$port OK"
    else
      echo "  :$port FAILED"; ok=0
    fi
  done
  (( ok ))
}

case $MODE in
  list)
    for HOST in "${HOSTS[@]}"; do
      echo "===== $HOST"
      remote "$HOST" "cd $APP_DIR && ls -1d dist.bak-* 2>/dev/null; echo '-- current:'; cat dist/DEPLOY_INFO 2>/dev/null || echo '(no DEPLOY_INFO)'"
    done
    exit 0 ;;

  rollback)
    for HOST in "${HOSTS[@]}"; do
      echo "===== $HOST rollback"
      NAME=${ROLLBACK_NAME:-$(remote "$HOST" "cd $APP_DIR && ls -1d dist.bak-* | tail -1")}
      [[ -z "$NAME" ]] && { echo "No backup found on $HOST" >&2; exit 1; }
      echo "  restoring $NAME"
      remote "$HOST" "cd $APP_DIR && test -d $NAME && rm -rf dist && cp -a $NAME dist && pm2 restart $PROCESSES >/dev/null"
      verify_host "$HOST" || { echo "Verify failed on $HOST" >&2; exit 1; }
    done
    exit 0 ;;
esac

if (( ! SKIP_CHECKS )); then
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  [[ "$BRANCH" == main ]] || { echo "Must deploy from main (current: $BRANCH)" >&2; exit 1; }
  [[ -z "$(git status --porcelain --untracked-files=no)" ]] || { echo "Working tree has uncommitted changes" >&2; exit 1; }
  git fetch -q origin main
  [[ "$(git rev-parse HEAD)" == "$(git rev-parse origin/main)" ]] || { echo "HEAD differs from origin/main - push/pull first" >&2; exit 1; }
fi

COMMIT=$(git rev-parse --short HEAD)
BACKUP="dist.bak-$(date +%Y%m%d%H%M%S)"
echo "Deploying $COMMIT to: ${HOSTS[*]}"
echo "Restart: $PROCESSES"

npm run build
printf 'commit=%s\nbranch=%s\nbuilt_at=%s\nbuilt_by=%s\n' \
  "$(git rev-parse HEAD)" "$(git rev-parse --abbrev-ref HEAD)" "$(date '+%Y-%m-%d %H:%M:%S %z')" "$(git config user.name)" > dist/DEPLOY_INFO

for HOST in "${HOSTS[@]}"; do
  echo "===== $HOST"
  remote "$HOST" "cd $APP_DIR && cp -a dist $BACKUP && ls -1d dist.bak-* | head -n -$DEPLOY_BACKUP_KEEP | xargs -r rm -rf"
  rsync -a --delete -e "ssh ${SSH_OPTS[*]}" ./dist/ "$DEPLOY_SSH_USER@$HOST:$APP_DIR/dist/"
  remote "$HOST" "pm2 restart $PROCESSES >/dev/null"
  if ! verify_host "$HOST"; then
    echo "Verify failed on $HOST - stopping (remaining hosts untouched)." >&2
    echo "Rollback this host: ./deploy-prod.sh --host $HOST --rollback $BACKUP" >&2
    exit 1
  fi
done

echo "Done: $COMMIT. Backup on each host: $BACKUP"
echo "Rollback: ./deploy-prod.sh --rollback $BACKUP"
(( RESTART_QUIET )) || echo "Not restarted: $DEPLOY_PM2_QUIET_PROCESSES (run with --quiet at a quiet time if they need the new code)"
