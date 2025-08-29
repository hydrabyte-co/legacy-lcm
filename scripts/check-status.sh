#!/bin/bash

# LCM Service Status Check Script
# Usage: ./scripts/check-status.sh [target]

set -e

# Configuration
VM_HOSTS=("10.10.0.70" "10.10.0.71" "10.10.0.72")
VM_ALIASES=("vm1" "vm2" "vm3")
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
    local vm_name=""
    
    # Get VM name
    for i in "${!VM_HOSTS[@]}"; do
        if [[ "${VM_HOSTS[$i]}" = "$vm_ip" ]]; then
            vm_name="${VM_ALIASES[$i]}"
            break
        fi
    done
    
    echo -e "\n${BLUE}=== VM: $vm_ip ($vm_name) ===${NC}"
    
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
        echo -e "${GREEN}✅ API Health: OK (200)${NC}"
    else
        echo -e "${RED}❌ API Health: FAILED ($api_status)${NC}"
    fi
    
    # System resources
    info "System Resources:"
    ssh $SSH_USER@$vm_ip "
        echo 'Memory Usage:'
        free -h | grep -E '(Mem|Swap)'
        echo 'Disk Usage:'
        df -h | grep -E '(/$|/root)'
        echo 'Load Average:'
        uptime | awk '{print \$8, \$9, \$10}'
    "
    
    # Recent logs check
    info "Recent Errors (last 10 lines):"
    ssh $SSH_USER@$vm_ip "pm2 logs --err --lines 10 --nostream | head -20" 2>/dev/null || echo "No recent errors"
    
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
        echo -e "${GREEN}✅ Production API: OK (${http_code}) - ${response_time}s${NC}"
    else
        echo -e "${RED}❌ Production API: FAILED (${http_code})${NC}"
    fi
    
    # Additional endpoint checks
    info "Load Balancer Response Headers:"
    curl -I https://api.hydrabyte.co/lcm/health 2>/dev/null | head -5 || echo "Cannot fetch headers"
}

# Show summary
show_summary() {
    local target_vms=("$@")
    
    echo -e "\n${BLUE}=== SUMMARY ===${NC}"
    
    local total_vms=${#target_vms[@]}
    local online_vms=0
    local healthy_apis=0
    
    for vm in "${target_vms[@]}"; do
        # Quick SSH test
        if ssh -o ConnectTimeout=5 $SSH_USER@$vm "echo 'test'" > /dev/null 2>&1; then
            ((online_vms++))
            
            # Quick API test
            api_status=$(ssh $SSH_USER@$vm "curl -s -o /dev/null -w '%{http_code}' http://localhost:3005/health" 2>/dev/null || echo "000")
            if [ "$api_status" = "200" ]; then
                ((healthy_apis++))
            fi
        fi
    done
    
    echo "Total VMs: $total_vms"
    echo "Online VMs: $online_vms"
    echo "Healthy APIs: $healthy_apis"
    
    if [ $online_vms -eq $total_vms ] && [ $healthy_apis -eq $total_vms ]; then
        echo -e "${GREEN}🎉 All systems operational${NC}"
    elif [ $healthy_apis -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Partial system availability${NC}"
    else
        echo -e "${RED}🚨 System issues detected${NC}"
    fi
}

# Help
show_help() {
    cat << EOF
LCM Service Status Check Script

USAGE:
    ./scripts/check-status.sh [target]

TARGETS:
    all     : Check all VMs (default)
    vm1     : Check VM1 (10.10.0.70)
    vm2     : Check VM2 (10.10.0.71) 
    vm3     : Check VM3 (10.10.0.72)
    <ip>    : Check specific VM IP

EXAMPLES:
    ./scripts/check-status.sh           # Check all VMs
    ./scripts/check-status.sh vm1       # Check VM1 only
    ./scripts/check-status.sh all       # Check all VMs + production endpoint

EOF
}

# Main execution
main() {
    local target=${1:-all}
    
    if [ "$target" = "--help" ] || [ "$target" = "-h" ]; then
        show_help
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
    
    # Show summary
    show_summary "${TARGET_VMS[@]}"
    
    log "=== Status check completed ==="
}

# Execute
main "$@"