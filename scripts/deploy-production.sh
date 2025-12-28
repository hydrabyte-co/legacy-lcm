#!/bin/bash

# LCM Service Production Deployment Script
# TranGPT Company - Automated deployment to multiple VMs
# Usage: ./scripts/deploy-production.sh [options]

set -e  # Exit on any error

# Configuration
HOSTS=("10.10.0.70" "10.10.0.71" "10.10.0.72")
SSH_USER="root"
APP_PATH="/root/apps/lcm-service"
LOG_DIR="/tmp/lcm-deploy-logs"
LOG_FILE="$LOG_DIR/lcm-deploy-$(date +%Y%m%d-%H%M%S).log"
BACKUP_RETENTION_DAYS=7

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Create log directory
mkdir -p $LOG_DIR

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a $LOG_FILE
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}" | tee -a $LOG_FILE
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}" | tee -a $LOG_FILE
}

step() {
    echo -e "${PURPLE}[STEP] $1${NC}" | tee -a $LOG_FILE
}

# Help function
show_help() {
    echo "LCM Service Production Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -b, --branch BRANCH    Deploy specific branch (default: main)"
    echo "  -h, --host HOST        Deploy to specific host only"
    echo "  -n, --dry-run          Show what would be deployed without executing"
    echo "  -s, --skip-checks      Skip pre-deployment checks"
    echo "  -r, --rollback         Rollback to previous version"
    echo "  --help                 Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                            # Deploy main branch to all hosts"
    echo "  $0 -b develop                 # Deploy develop branch"
    echo "  $0 -h 10.10.0.70             # Deploy only to specific host"
    echo "  $0 --dry-run                  # Preview deployment"
    echo "  $0 --rollback                 # Rollback all hosts"
}

# Parse command line arguments
BRANCH="main"
SPECIFIC_HOST=""
DRY_RUN=false
SKIP_CHECKS=false
ROLLBACK_MODE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -b|--branch)
            BRANCH="$2"
            shift 2
            ;;
        -h|--host)
            SPECIFIC_HOST="$2"
            shift 2
            ;;
        -n|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -s|--skip-checks)
            SKIP_CHECKS=true
            shift
            ;;
        -r|--rollback)
            ROLLBACK_MODE=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Override hosts if specific host provided
if [[ -n "$SPECIFIC_HOST" ]]; then
    HOSTS=("$SPECIFIC_HOST")
fi

# Pre-deployment checks
pre_deployment_check() {
    if [[ "$SKIP_CHECKS" == "true" ]]; then
        warning "Skipping pre-deployment checks as requested"
        return 0
    fi
    
    step "🔍 Running pre-deployment checks..."
    
    # Check if we're in the right directory
    if [[ ! -f "package.json" ]] || ! grep -q '"name".*"lcm-service"' package.json 2>/dev/null; then
        error "Not in LCM service directory or package.json missing/invalid"
        exit 1
    fi
    
    # Check git status (only if not dry run and not rollback)
    if [[ "$DRY_RUN" == "false" ]] && [[ "$ROLLBACK_MODE" == "false" ]]; then
        if [[ -n $(git status --porcelain) ]]; then
            error "Working directory is not clean. Please commit or stash changes."
            error "Uncommitted changes:"
            git status --short
            exit 1
        fi
    fi
    
    # Check if branch exists
    if ! git show-ref --verify --quiet "refs/heads/$BRANCH" && ! git show-ref --verify --quiet "refs/remotes/origin/$BRANCH"; then
        error "Branch '$BRANCH' does not exist locally or remotely"
        exit 1
    fi
    
    # Check Node.js and npm
    if ! command -v node >/dev/null 2>&1; then
        error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm >/dev/null 2>&1; then
        error "npm is not installed"
        exit 1
    fi
    
    # Test SSH connections
    step "🔌 Testing SSH connections..."
    local connection_failures=0
    for host in "${HOSTS[@]}"; do
        if ! ssh -o ConnectTimeout=10 -o BatchMode=yes $SSH_USER@$host "echo 'SSH test successful'" >/dev/null 2>&1; then
            error "Cannot connect to $host via SSH"
            connection_failures=$((connection_failures + 1))
        else
            info "✅ SSH connection to $host: OK"
        fi
    done
    
    if [[ $connection_failures -gt 0 ]]; then
        error "$connection_failures SSH connection(s) failed"
        exit 1
    fi
    
    # Test build process locally (if not rollback mode)
    if [[ "$ROLLBACK_MODE" == "false" ]] && [[ "$DRY_RUN" == "false" ]]; then
        step "🔨 Testing local build process..."
        if ! npm run build >/dev/null 2>&1; then
            error "Local build failed. Please fix build errors before deploying."
            exit 1
        fi
        info "✅ Local build test: OK"
    fi
    
    log "✅ All pre-deployment checks passed"
}

# Get deployment information
get_deployment_info() {
    info "📋 Deployment Information:"
    info "   Branch: $BRANCH"
    info "   Hosts: ${HOSTS[*]}"
    info "   User: $SSH_USER"
    info "   App Path: $APP_PATH"
    info "   Dry Run: $DRY_RUN"
    info "   Rollback Mode: $ROLLBACK_MODE"
    info "   Log File: $LOG_FILE"
    echo ""
}

# Create backup on host
create_backup() {
    local host=$1
    local backup_name="lcm-backup-$(date +%Y%m%d-%H%M%S)"
    
    ssh $SSH_USER@$host << EOF
        cd $APP_PATH
        
        # Create backup directory
        mkdir -p /root/backups
        
        # Create backup
        if [[ -d dist/ ]]; then
            cp -r dist/ /root/backups/$backup_name/
            echo "Backup created: /root/backups/$backup_name"
        fi
        
        # Clean old backups (keep last $BACKUP_RETENTION_DAYS days)
        find /root/backups -name "lcm-backup-*" -type d -mtime +$BACKUP_RETENTION_DAYS -exec rm -rf {} + 2>/dev/null || true
        
        echo "✅ Backup completed"
EOF
}

# Deploy to single host
deploy_to_host() {
    local host=$1
    step "🚀 Starting deployment to $host..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        info "[DRY RUN] Would deploy to $host with branch $BRANCH"
        return 0
    fi
    
    # Create backup before deployment
    info "📦 Creating backup on $host..."
    if ! create_backup $host; then
        warning "Backup creation failed on $host, but continuing deployment"
    fi
    
    # Deploy to host
    ssh $SSH_USER@$host << EOF
        set -e
        cd $APP_PATH
        
        echo "📥 Current branch: \$(git branch --show-current)"
        echo "📥 Fetching latest changes..."
        git fetch origin
        
        echo "🔄 Switching to branch $BRANCH..."
        git checkout $BRANCH
        git pull origin $BRANCH
        
        echo "📦 Updating submodules..."
        git submodule sync --recursive
        git submodule update --init --recursive
        git submodule foreach git pull origin main
        
        echo "📋 Submodule status:"
        git submodule status
        
        echo "🔨 Installing dependencies..."
        npm ci --production=false
        
        echo "🏗️ Building application..."
        npm run build
        
        echo "🔍 Verifying build output..."
        if [[ ! -d "dist" ]] || [[ ! -f "dist/main.js" ]]; then
            echo "❌ Build verification failed - dist directory or main.js not found"
            exit 1
        fi
        
        echo "♻️ Restarting PM2 services..."
        pm2 restart lcm-api lcm-ms-file lcm-ms-sync || {
            echo "⚠️ PM2 restart failed, attempting to start services..."
            pm2 start ecosystem.config.js || {
                echo "❌ PM2 start also failed"
                exit 1
            }
        }
        
        echo "⏳ Waiting for services to stabilize..."
        sleep 15
        
        echo "🔍 Health check..."
        pm2 status
        
        # Verify services are running
        if pm2 list | grep -E "(lcm-api|lcm-ms-file|lcm-ms-sync)" | grep -q "online"; then
            echo "✅ Services are running"
        else
            echo "❌ Some services failed to start"
            pm2 logs --nostream --lines 20
            exit 1
        fi
        
        # Test API health (if port 3005 is accessible)
        if curl -s -f http://localhost:3005/health >/dev/null 2>&1; then
            echo "✅ API health check passed"
        else
            echo "⚠️ API health check failed (service might still be starting)"
        fi
EOF
    
    if [ $? -eq 0 ]; then
        log "✅ Deployment to $host completed successfully!"
        return 0
    else
        error "❌ Deployment to $host failed!"
        return 1
    fi
}

# Rollback host to previous version
rollback_host() {
    local host=$1
    warning "🔄 Rolling back $host..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        info "[DRY RUN] Would rollback $host"
        return 0
    fi
    
    ssh $SSH_USER@$host << EOF
        cd $APP_PATH
        
        # Find latest backup
        latest_backup=\$(ls -t /root/backups/lcm-backup-* 2>/dev/null | head -n1)
        
        if [[ -n "\$latest_backup" ]]; then
            echo "🔄 Restoring from \$latest_backup"
            rm -rf dist/
            cp -r \$latest_backup/* ./
            pm2 restart lcm-api lcm-ms-file lcm-ms-sync
            echo "✅ Rollback from backup completed"
        else
            echo "⚠️ No backup found, attempting git rollback"
            
            # Get previous commit
            prev_commit=\$(git log --oneline -n 2 | tail -n 1 | cut -d' ' -f1)
            if [[ -n "\$prev_commit" ]]; then
                git reset --hard \$prev_commit
                git submodule update --recursive
                npm ci
                npm run build
                pm2 restart lcm-api lcm-ms-file lcm-ms-sync
                echo "✅ Git rollback completed to \$prev_commit"
            else
                echo "❌ Unable to determine previous commit for rollback"
                exit 1
            fi
        fi
        
        echo "🔍 Post-rollback health check..."
        pm2 status
EOF
    
    if [ $? -eq 0 ]; then
        log "✅ Rollback of $host completed successfully!"
        return 0
    else
        error "❌ Rollback of $host failed!"
        return 1
    fi
}

# Main deployment function
main_deployment() {
    local failed_hosts=()
    local success_hosts=()
    
    if [[ "$ROLLBACK_MODE" == "true" ]]; then
        log "🔄 Starting LCM Service ROLLBACK to production..."
    else
        log "🚀 Starting LCM Service deployment to production..."
    fi
    
    get_deployment_info
    
    # Deploy to each host
    for host in "${HOSTS[@]}"; do
        if [[ "$ROLLBACK_MODE" == "true" ]]; then
            if rollback_host $host; then
                success_hosts+=($host)
            else
                failed_hosts+=($host)
            fi
        else
            if deploy_to_host $host; then
                success_hosts+=($host)
            else
                failed_hosts+=($host)
            fi
        fi
        
        # Brief pause between deployments
        if [[ ${#HOSTS[@]} -gt 1 ]]; then
            sleep 5
        fi
    done
    
    # Summary
    echo ""
    log "📊 Deployment Summary:"
    log "✅ Successful: ${#success_hosts[@]} hosts (${success_hosts[*]})"
    log "❌ Failed: ${#failed_hosts[@]} hosts (${failed_hosts[*]})"
    
    if [ ${#failed_hosts[@]} -gt 0 ]; then
        error "Some deployments failed. Check logs for details."
        
        # Ask about rollback (only if not already in rollback mode)
        if [[ "$ROLLBACK_MODE" == "false" ]] && [[ "$DRY_RUN" == "false" ]]; then
            echo ""
            warning "Failed hosts: ${failed_hosts[*]}"
            read -p "Do you want to rollback failed hosts? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                for host in "${failed_hosts[@]}"; do
                    rollback_host $host
                done
            fi
        fi
        
        return 1
    else
        if [[ "$ROLLBACK_MODE" == "true" ]]; then
            log "🎉 All rollbacks completed successfully!"
        else
            log "🎉 All deployments completed successfully!"
        fi
        
        # Show final status
        echo ""
        info "📄 Deployment completed at: $(date)"
        info "📄 Full log saved to: $LOG_FILE"
        info "📄 Branch deployed: $BRANCH"
        info "📄 Hosts affected: ${HOSTS[*]}"
        
        return 0
    fi
}

# Cleanup function
cleanup() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        error "Script interrupted or failed with exit code $exit_code"
    fi
    
    # Clean old log files
    find $LOG_DIR -name "lcm-deploy-*.log" -mtime +30 -delete 2>/dev/null || true
    
    exit $exit_code
}

# Set trap for cleanup
trap cleanup EXIT INT TERM

# Script entry point
main() {
    echo ""
    echo "🏢 LCM Service Production Deployment Script"
    echo "   TranGPT Company - Hoàn Kim Law Firm"
    echo "   $(date)"
    echo ""
    
    if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
        pre_deployment_check
        main_deployment
    fi
}

# Run main function
main "$@"