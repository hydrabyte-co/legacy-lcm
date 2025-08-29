#!/bin/bash

# LCM Service Status Check Script - Fixed Version
# Usage: ./scripts/check-status-fixed.sh [target]

set -e

# Configuration
VM_HOSTS=("10.10.0.70" "10.10.0.71" "10.10.0.72")
SSH_USER="root"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Functions
log() {
    echo -e "${GREEN}[INFO] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[STATUS] $1${NC}"
}

# Get target VMs
get_target_vms() {
    local target=${1:-all}
    case $target in
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
            echo "$target"
            ;;
        *)
            error "Invalid target: $target"
            exit 1
            ;;
    esac
}

# Check single VM
check_vm() {
    local vm_ip=$1
    
    echo -e "\n${BLUE}=== VM: $vm_ip ===${NC}"
    
    # Test SSH connection
    if ! ssh -o ConnectTimeout=5 $SSH_USER@$vm_ip "echo 'Connected'" > /dev/null 2>&1; then
        error "Cannot connect to VM: $vm_ip"
        return 1
    fi
    
    # PM2 status
    info "PM2 Services Status:"
    ssh $SSH_USER@$vm_ip "pm2 status" | grep -E "(lcm-|online|stopped|errored|Process)" || echo "No PM2 processes found"
    
    # API build info and health check
    info "API Build Info & Health:"
    build_info=$(ssh $SSH_USER@$vm_ip "curl -s http://localhost:3005/" 2>/dev/null || echo "{}")
    api_status=$(ssh $SSH_USER@$vm_ip "curl -s -o /dev/null -w '%{http_code}' http://localhost:3005/health" 2>/dev/null || echo "000")
    
    # Display build info if available
    if [ "$build_info" != "{}" ] && [ "$build_info" != "" ]; then
        echo "$build_info" | python3 -m json.tool 2>/dev/null || echo "$build_info"
    fi
    
    # Health status
    if [ "$api_status" = "200" ]; then
        echo -e "${GREEN}[OK] API Health: OK (200)${NC}"
    else
        echo -e "${RED}[FAILED] API Health: FAILED ($api_status)${NC}"
    fi
    
    # System resources
    info "System Resources:"
    ssh $SSH_USER@$vm_ip "
        echo 'Memory Usage:'
        free -h | grep -E '(Mem|Swap)'
        echo 'Disk Usage:'
        df -h | grep -E '(/$|/root)'
    "
    
    echo -e "${BLUE}--- End VM: $vm_ip ---${NC}"
}

# Production endpoint check
check_production_endpoint() {
    echo -e "\n${BLUE}=== Production Endpoint Check ===${NC}"
    
    # Check build info from production
    info "Production Build Info:"
    prod_build_info=$(curl -s https://api.hydrabyte.co/lcm/ 2>/dev/null || echo "{}")
    if [ "$prod_build_info" != "{}" ] && [ "$prod_build_info" != "" ]; then
        echo "$prod_build_info" | python3 -m json.tool 2>/dev/null || echo "$prod_build_info"
    else
        warning "Could not fetch production build info"
    fi
    
    # Health check
    info "Checking https://api.hydrabyte.co/lcm/health"
    response=$(curl -s -o /dev/null -w "%{http_code};%{time_total}" https://api.hydrabyte.co/lcm/health 2>/dev/null || echo "000;0")
    http_code=$(echo $response | cut -d';' -f1)
    response_time=$(echo $response | cut -d';' -f2)
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}[OK] Production API: OK - ${http_code} - ${response_time}s${NC}"
    else
        echo -e "${RED}[FAILED] Production API: FAILED - ${http_code}${NC}"
    fi
}

# Main execution
main() {
    local target=${1:-all}
    
    if [ "$target" = "--help" ] || [ "$target" = "-h" ]; then
        echo "Usage: ./scripts/check-status-fixed.sh [all|vm1|vm2|vm3|IP]"
        exit 0
    fi
    
    log "=== LCM Service Status Check Started ==="
    
    # Get target VMs
    TARGET_VMS=($(get_target_vms $target))
    
    # Check each VM
    for vm in "${TARGET_VMS[@]}"; do
        check_vm "$vm"
    done
    
    # Check production endpoint if checking all VMs
    if [ "$target" = "all" ]; then
        check_production_endpoint
    fi
    
    log "=== Status check completed ==="
}

# Execute
main "$@"