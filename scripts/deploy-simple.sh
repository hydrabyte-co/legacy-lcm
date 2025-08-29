#!/bin/bash

# LCM Service Simple Production Deployment
# TranGPT Company - Deploy main branch to 3 VMs
# Usage: ./scripts/deploy-simple.sh

set -e

# Configuration
HOSTS=("10.10.0.70" "10.10.0.71" "10.10.0.72")
SSH_USER="root"
APP_PATH="/root/apps/lcm-service"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Simple deploy to one host
deploy_to_host() {
    local host=$1
    log "🚀 Deploying to $host..."
    
    ssh $SSH_USER@$host << 'EOF'
        cd /root/apps/lcm-service
        
        echo "📥 Pulling latest main branch..."
        git pull origin main
        
        echo "🔄 Updating submodules..."
        git submodule foreach git pull origin main
        
        echo "🔨 Building..."
        npm run build
        
        echo "♻️ Restarting PM2..."
        pm2 restart lcm-api lcm-ms-file lcm-ms-sync
        
        echo "✅ Done!"
        pm2 status
EOF
    
    if [ $? -eq 0 ]; then
        log "✅ $host: SUCCESS"
    else
        error "❌ $host: FAILED"
        return 1
    fi
}

# Main function
main() {
    echo ""
    log "🚀 Starting LCM deployment to production..."
    log "📋 Hosts: ${HOSTS[*]}"
    
    # Quick check
    if [[ -n $(git status --porcelain) ]]; then
        error "Working directory not clean! Please commit changes first."
        exit 1
    fi
    
    if [[ $(git branch --show-current) != "main" ]]; then
        error "Please switch to main branch first!"
        exit 1
    fi
    
    # Deploy to each host
    failed=0
    for host in "${HOSTS[@]}"; do
        if ! deploy_to_host $host; then
            failed=1
        fi
        sleep 2  # Small pause between hosts
    done
    
    if [ $failed -eq 0 ]; then
        log "🎉 All deployments successful!"
    else
        error "Some deployments failed!"
        exit 1
    fi
}

main "$@"