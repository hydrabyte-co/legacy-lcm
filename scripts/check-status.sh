#!/bin/bash
# LCM production status: pm2 processes, deployed commit, API ports, resources, public endpoint.
# Config from DEPLOY_* in .env.deploy (see .env.deploy.example).
# Usage: ./scripts/check-status.sh [all|vm1|vm2|vm3|<host>]

source "$(dirname "$0")/lib/deploy-env.sh"

GREEN='\033[0;32m'; RED='\033[0;31m'; BLUE='\033[0;34m'; NC='\033[0m'

case ${1:-all} in
  -h|--help) sed -n 2,4p "$0"; exit 0 ;;
  all) TARGETS=("${HOSTS[@]}") ;;
  vm[0-9]) TARGETS=("${HOSTS[$(( ${1#vm} - 1 ))]}") ;;
  *) TARGETS=("$1") ;;
esac

check_host() {
  local host=$1
  echo -e "\n${BLUE}=== $host ===${NC}"
  if ! remote "$host" true 2>/dev/null; then
    echo -e "${RED}SSH failed${NC}"; return 1
  fi
  remote "$host" "pm2 ls 2>/dev/null | grep -E 'name|lcm-'"
  echo '-- deployed:'
  remote "$host" "cat $DEPLOY_APP_DIR/dist/DEPLOY_INFO 2>/dev/null || echo '(no DEPLOY_INFO - deployed before 2026-10)'"
  for port in "${API_PORTS[@]}"; do
    if info=$(remote "$host" "curl -fsS -m 5 http://localhost:$port/" 2>/dev/null); then
      echo -e "${GREEN}:$port OK${NC} $info"
    else
      echo -e "${RED}:$port FAILED${NC}"
    fi
  done
  remote "$host" "free -h | grep Mem; df -h / | tail -1"
}

for host in "${TARGETS[@]}"; do check_host "$host"; done

if [[ ${1:-all} == all && -n "$DEPLOY_PUBLIC_URL" ]]; then
  echo -e "\n${BLUE}=== $DEPLOY_PUBLIC_URL ===${NC}"
  curl -sS -m 10 -w "\nHTTP %{http_code} in %{time_total}s\n" "$DEPLOY_PUBLIC_URL/"
fi
