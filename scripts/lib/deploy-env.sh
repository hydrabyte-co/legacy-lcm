#!/bin/bash
# Load DEPLOY_* variables from <repo>/.env.deploy (only DEPLOY_* lines are read).
# Values already set in the environment win, e.g.: DEPLOY_HOSTS=10.10.0.70 ./deploy-prod.sh
# Usage: source scripts/lib/deploy-env.sh

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="${ENV_FILE:-$REPO_DIR/.env.deploy}"

if [[ -f "$ENV_FILE" ]]; then
  while IFS= read -r line; do
    key="${line%%=*}"
    val="${line#*=}"
    val="${val%\"}"; val="${val#\"}"
    val="${val%\'}"; val="${val#\'}"
    [[ -z "${!key+x}" ]] && export "$key=$val"
  done < <(grep -E '^DEPLOY_[A-Z0-9_]+=' "$ENV_FILE")
fi

missing=()
for v in DEPLOY_HOSTS DEPLOY_SSH_USER DEPLOY_APP_DIR DEPLOY_PM2_PROCESSES DEPLOY_API_PORTS; do
  [[ -z "${!v}" ]] && missing+=("$v")
done
if (( ${#missing[@]} )); then
  echo "Missing in $ENV_FILE: ${missing[*]} (copy .env.deploy.example to .env.deploy)" >&2
  exit 1
fi

DEPLOY_SSH_PORT="${DEPLOY_SSH_PORT:-22}"
DEPLOY_BACKUP_KEEP="${DEPLOY_BACKUP_KEEP:-5}"
# Accept comma or space separated lists
HOSTS=(${DEPLOY_HOSTS//,/ })
API_PORTS=(${DEPLOY_API_PORTS//,/ })
SSH_OPTS=(-p "$DEPLOY_SSH_PORT" -o ConnectTimeout=10)

remote() { ssh "${SSH_OPTS[@]}" "$DEPLOY_SSH_USER@$1" "${@:2}"; }
