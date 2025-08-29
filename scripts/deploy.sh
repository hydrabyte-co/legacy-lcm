#!/bin/bash

# LCM Service Deployment Script
# TranGPT Company - Deploy to Production VMs
# Usage: ./scripts/deploy.sh <branch> <service> <target>

set -e  # Exit on any error

# Configuration
VM_HOSTS=("10.10.0.70" "10.10.0.71" "10.10.0.72")
VM_ALIASES=("vm1" "vm2" "vm3")
SSH_USER="root"
APP_PATH="/root/apps/lcm-service"
LOG_DIR="/tmp/lcm-deploy-logs"
LOG_FILE="$LOG_DIR/lcm-deploy-$(date +%Y%m%d-%H%M%S).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

success() {
    echo -e "${CYAN}[SUCCESS] $1${NC}" | tee -a $LOG_FILE
}

# Help function
show_help() {
    cat << EOF
LCM Service Deployment Script

USAGE:
    ./scripts/deploy.sh <branch> <service> <target> [options]

PARAMETERS:
    <branch>    : trangpt | main | hotfix
    <service>   : api | ms-file | ms-sync | wrk | wrk-payment | all  
    <target>    : all | vm1 | vm2 | vm3 | 10.10.0.70 | 10.10.0.71 | 10.10.0.72

OPTIONS:
    --rollback  : Rollback to previous deployment
    --dry-run   : Show what would be done without executing
    --help      : Show this help message

EXAMPLES:
    ./scripts/deploy.sh main api all              # Deploy API from main to all VMs
    ./scripts/deploy.sh trangpt wrk vm1           # Deploy worker from trangpt to VM1
    ./scripts/deploy.sh hotfix all vm2            # Deploy all services from hotfix to VM2
    ./scripts/deploy.sh main ms-sync 10.10.0.70   # Deploy sync microservice to specific VM

SERVICES:
    api         : lcm-api (main API server, port 3005) - REQUIRED on all VMs
    ms-file     : lcm-ms-file (file processing microservice)
    ms-sync     : lcm-ms-sync (data sync microservice)
    wrk         : lcm-wrk (general worker)
    wrk-payment : lcm-wrk:payment-migration (payment migration worker)
    all         : Deploy all services

TARGETS:
    all         : All production VMs (10.10.0.70, 10.10.0.71, 10.10.0.72)
    vm1         : 10.10.0.70 (Primary)
    vm2         : 10.10.0.71 (Secondary)
    vm3         : 10.10.0.72 (Tertiary)
    <ip>        : Specific VM IP address

EOF
}

# Parse arguments
if [ $# -lt 3 ]; then
    error "Missing required arguments"
    show_help
    exit 1
fi

BRANCH=$1
SERVICE=$2
TARGET=$3
ROLLBACK=false
DRY_RUN=false

# Parse options
shift 3
while [[ $# -gt 0 ]]; do
    case $1 in
        --rollback)
            ROLLBACK=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
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

# Validate branch
case $BRANCH in
    trangpt|main|hotfix)
        ;;
    *)
        error "Invalid branch: $BRANCH. Must be one of: trangpt, main, hotfix"
        exit 1
        ;;
esac

# Validate service
case $SERVICE in
    api|ms-file|ms-sync|wrk|wrk-payment|all)
        ;;
    *)
        error "Invalid service: $SERVICE. Must be one of: api, ms-file, ms-sync, wrk, wrk-payment, all"
        exit 1
        ;;
esac

# Map service names to PM2 process names
get_pm2_service_name() {
    case $1 in
        api) echo "lcm-api" ;;
        ms-file) echo "lcm-ms-file" ;;
        ms-sync) echo "lcm-ms-sync" ;;
        wrk) echo "lcm-wrk" ;;
        wrk-payment) echo "lcm-wrk:payment-migration" ;;
        all) echo "all" ;;
    esac
}

# Get target VMs
get_target_vms() {
    case $TARGET in
        all)
            echo "${VM_HOSTS[@]}"
            ;;
        vm1)
            echo "${VM_HOSTS[0]}"
            ;;
        vm2)
            echo "${VM_HOSTS[1]}"
            ;;
        vm3)
            echo "${VM_HOSTS[2]}"
            ;;
        10.10.0.70|10.10.0.71|10.10.0.72)
            echo "$TARGET"
            ;;
        *)
            error "Invalid target: $TARGET. Must be one of: all, vm1, vm2, vm3, or valid IP"
            exit 1
            ;;
    esac
}

# Build locally
build_locally() {
    step "Building locally from branch: $BRANCH"
    
    # Check current branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "$BRANCH" ]; then
        info "Switching to branch: $BRANCH"
        git checkout $BRANCH
        git pull origin $BRANCH
    fi
    
    # Clean and build
    info "Cleaning previous build..."
    rm -rf dist/
    
    info "Installing dependencies..."
    npm ci
    
    info "Building application..."
    npm run build
    
    info "Running tests..."
    npm test
    
    info "Running linting..."
    npm run lint
    
    success "Local build completed successfully"
}

# Deploy to single VM
deploy_to_vm() {
    local vm_ip=$1
    local pm2_service=$2
    
    step "Deploying to VM: $vm_ip, Service: $pm2_service"
    
    if [ "$DRY_RUN" = true ]; then
        info "[DRY RUN] Would deploy $pm2_service to $vm_ip"
        return 0
    fi
    
    # Test SSH connection
    if ! ssh -o ConnectTimeout=5 $SSH_USER@$vm_ip "echo 'SSH connection successful'" > /dev/null 2>&1; then
        error "Cannot connect to VM: $vm_ip"
        return 1
    fi
    
    # Backup current deployment
    info "Creating backup on VM: $vm_ip"
    ssh $SSH_USER@$vm_ip "
        cd $APP_PATH
        backup_dir=\"/root/backups/lcm-backup-\$(date +%Y%m%d-%H%M%S)\"
        mkdir -p \$backup_dir
        cp -r dist/ \$backup_dir/ 2>/dev/null || echo 'No dist directory to backup'
        echo \"Backup created: \$backup_dir\"
    "
    
    # Stop services
    info "Stopping PM2 service: $pm2_service on $vm_ip"
    if [ "$pm2_service" = "all" ]; then
        ssh $SSH_USER@$vm_ip "cd $APP_PATH && pm2 stop all"
    else
        ssh $SSH_USER@$vm_ip "cd $APP_PATH && pm2 stop $pm2_service || echo 'Service may not be running'"
    fi
    
    # Update code
    info "Updating code on VM: $vm_ip"
    ssh $SSH_USER@$vm_ip "
        cd $APP_PATH
        git fetch --all
        git checkout $BRANCH
        git pull origin $BRANCH
    "
    
    # Copy local build
    info "Uploading build artifacts to $vm_ip"
    scp -r dist/ $SSH_USER@$vm_ip:$APP_PATH/
    
    # Install dependencies if package.json changed
    info "Installing dependencies on $vm_ip"
    ssh $SSH_USER@$vm_ip "
        cd $APP_PATH
        npm ci --production
    "
    
    # Start services
    info "Starting PM2 service: $pm2_service on $vm_ip"
    if [ "$pm2_service" = "all" ]; then
        ssh $SSH_USER@$vm_ip "cd $APP_PATH && pm2 start ecosystem.config.js"
    else
        ssh $SSH_USER@$vm_ip "cd $APP_PATH && pm2 start ecosystem.config.js --only $pm2_service"
    fi
    
    # Wait for services to stabilize
    sleep 10
    
    # Verify deployment
    info "Verifying deployment on $vm_ip"
    ssh $SSH_USER@$vm_ip "
        pm2 status
        echo '--- API Build Info ---'
        curl -s http://localhost:3005/ | python3 -m json.tool 2>/dev/null || curl http://localhost:3005/
        echo '--- Health Check ---'
        curl -f http://localhost:3005/health || echo 'API health check failed'
    "
    
    success "Deployment to $vm_ip completed successfully"
}

# Rollback function
rollback_vm() {
    local vm_ip=$1
    local pm2_service=$2
    
    step "Rolling back on VM: $vm_ip"
    
    if [ "$DRY_RUN" = true ]; then
        info "[DRY RUN] Would rollback $pm2_service on $vm_ip"
        return 0
    fi
    
    # Find latest backup
    latest_backup=$(ssh $SSH_USER@$vm_ip "ls -t /root/backups/lcm-backup-* | head -n1" 2>/dev/null || echo "")
    
    if [ -z "$latest_backup" ]; then
        error "No backup found for rollback on $vm_ip"
        return 1
    fi
    
    info "Using backup: $latest_backup"
    
    # Stop services
    info "Stopping services for rollback"
    if [ "$pm2_service" = "all" ]; then
        ssh $SSH_USER@$vm_ip "cd $APP_PATH && pm2 stop all"
    else
        ssh $SSH_USER@$vm_ip "cd $APP_PATH && pm2 stop $pm2_service"
    fi
    
    # Restore from backup
    info "Restoring from backup: $latest_backup"
    ssh $SSH_USER@$vm_ip "
        cd $APP_PATH
        rm -rf dist/
        cp -r $latest_backup/* ./
    "
    
    # Restart services
    info "Restarting services after rollback"
    if [ "$pm2_service" = "all" ]; then
        ssh $SSH_USER@$vm_ip "cd $APP_PATH && pm2 restart all"
    else
        ssh $SSH_USER@$vm_ip "cd $APP_PATH && pm2 restart $pm2_service"
    fi
    
    success "Rollback completed on $vm_ip"
}

# Main execution
main() {
    log "=== LCM Service Deployment Started ==="
    log "Branch: $BRANCH, Service: $SERVICE, Target: $TARGET"
    log "Rollback: $ROLLBACK, Dry Run: $DRY_RUN"
    
    # Get PM2 service name
    PM2_SERVICE=$(get_pm2_service_name $SERVICE)
    
    # Get target VMs
    TARGET_VMS=($(get_target_vms))
    
    info "Target VMs: ${TARGET_VMS[*]}"
    info "PM2 Service: $PM2_SERVICE"
    
    if [ "$ROLLBACK" = true ]; then
        # Rollback mode
        warning "ROLLBACK MODE: This will revert to the previous deployment"
        read -p "Are you sure you want to rollback? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            info "Rollback cancelled"
            exit 0
        fi
        
        for vm in "${TARGET_VMS[@]}"; do
            rollback_vm "$vm" "$PM2_SERVICE"
        done
    else
        # Normal deployment mode
        if [ "$DRY_RUN" = false ]; then
            build_locally
        else
            info "[DRY RUN] Skipping local build"
        fi
        
        for vm in "${TARGET_VMS[@]}"; do
            deploy_to_vm "$vm" "$PM2_SERVICE"
        done
    fi
    
    # Final health check
    if [ "$DRY_RUN" = false ]; then
        step "Final health check - Production endpoint"
        sleep 5
        curl -I https://api.hydrabyte.co/lcm/health || warning "Production health check failed"
    fi
    
    success "=== Deployment completed successfully ==="
    log "Log file: $LOG_FILE"
}

# Execute main function
main