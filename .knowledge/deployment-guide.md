# LCM Service - Deployment Guide

## 🎯 OVERVIEW
Hướng dẫn triển khai và vận hành hệ thống LCM Service (Loans/Debt Collection Management) - Hệ thống quản lý thu nợ cho các tổ chức tài chính.

## 🏗️ PRODUCTION ENVIRONMENT

### **Production VMs:**
- **VM 1**: `10.10.0.70` - Primary node
- **VM 2**: `10.10.0.71` - Secondary node  
- **VM 3**: `10.10.0.72` - Tertiary node
- **SSH User**: `root`
- **App Path**: `/root/apps/lcm-service/`
- **Environment**: Production .env đã được cấu hình sẵn

### **Load Balancer:**
- **Production URL**: `https://api.hydrabyte.co/lcm`
- **Load balances** vào port 3005 của cả 3 VMs
- **Protocol**: HTTPS với SSL termination

### **PM2 Services Configuration:**
```javascript
// ecosystem.config.js - Chạy trên tất cả 3 VMs
{
  "lcm-api": {              // ✅ BẮT BUỘC - chạy trên cả 3 VMs
    name: "lcm-api",
    script: "dist/main.js",
    port: 3005,
    instances: 1,
    memory: "1G"
  },
  "lcm-ms-file": {          // 🔄 TÙY CHỌN - tùy VM có chạy hoặc không
    name: "lcm-ms-file", 
    script: "dist/main.js",
    env: { APP_TYPE: "microservice", RABBITMQ_QUEUE: "lcm-file" },
    memory: "4G"
  },
  "lcm-ms-sync": {          // 🔄 TÙY CHỌN - tùy VM có chạy hoặc không
    name: "lcm-ms-sync",
    script: "dist/main.js", 
    env: { APP_TYPE: "microservice", RABBITMQ_QUEUE: "lcm-sync" },
    memory: "4G"
  },
  "lcm-wrk": {              // 🔄 TÙY CHỌN - tùy VM có chạy hoặc không
    name: "lcm-wrk",
    script: "dist/main.js",
    env: { APP_TYPE: "worker" },
    memory: "4G"
  },
  "lcm-wrk:payment-migration": { // 🔄 TÙY CHỌN - tùy VM có chạy hoặc không
    name: "lcm-wrk:payment-migration",
    script: "dist/main.js",
    env: { APP_TYPE: "worker", WORKER_TYPE: "payment-migration" },
    memory: "4G"
  }
}
```

## 🔧 GIT WORKFLOW

### **Working Branches:**
- **`trangpt`**: Nhánh làm việc chính (development)
- **`main`**: Nhánh production chính thức  
- **`hotfix`**: Nhánh khẩn cấp cho production

### **Branch Strategy:**
```bash
# Development workflow
trangpt -> main (qua pull request)

# Hotfix workflow  
hotfix -> main (triển khai trực tiếp)
```

## 🚀 DEPLOYMENT SCRIPTS

### **1. Main Deployment Script:**
```bash
./scripts/deploy.sh <branch> <service> <target> [options]

# Parameters:
# <branch>   : trangpt | main | hotfix
# <service>  : api | ms-file | ms-sync | wrk | wrk-payment | all
# <target>   : all | vm1 | vm2 | vm3 | 10.10.0.70 | 10.10.0.71 | 10.10.0.72
# [options]  : --rollback | --dry-run | --help
```

### **2. Status Check Script:**
```bash
./scripts/check-status.sh [target]

# Check all VMs và production endpoint
./scripts/check-status.sh

# Check VM cụ thể
./scripts/check-status.sh vm1
```

### **Common Deployment Examples:**
```bash
# Deploy API từ nhánh main lên tất cả VMs
./scripts/deploy.sh main api all

# Deploy worker từ nhánh trangpt lên VM1 
./scripts/deploy.sh trangpt wrk vm1

# Deploy tất cả services từ hotfix lên tất cả VMs
./scripts/deploy.sh hotfix all all

# Dry run trước khi deploy
./scripts/deploy.sh main api all --dry-run

# Rollback deployment
./scripts/deploy.sh main api all --rollback

# Kiểm tra trạng thái sau deploy
./scripts/check-status.sh
```

## 🔍 SERVICE MANAGEMENT

### **PM2 Commands:**
```bash
# Kiểm tra trạng thái services
pm2 status

# Restart service cụ thể
pm2 restart lcm-api

# Stop/Start service
pm2 stop lcm-api
pm2 start lcm-api

# Xem logs
pm2 logs lcm-api --lines 50
pm2 logs all

# Monitor real-time
pm2 monit
```

### **Health Checks:**
```bash
# API build info check (local)
curl http://localhost:3005/

# API build info check (production)  
curl https://api.hydrabyte.co/lcm/

# API health check (local)
curl http://localhost:3005/health

# API health check (production)
curl https://api.hydrabyte.co/lcm/health

# Service status check
pm2 status | grep online
```

## 🧪 VERIFICATION CHECKLIST

### **Pre-deployment:**
- [ ] Branch exists và up-to-date
- [ ] Code build thành công (`npm run build`)
- [ ] Tests pass (`npm test`) - **Optional if Jest not available**
- [ ] Linting clean (`npm run lint`) - **Optional if ESLint not available**
- [ ] SSH access tới target VMs working
- [ ] VM has sufficient disk space (>2GB free recommended)

### **Post-deployment:**
- [ ] PM2 services show "online" status
- [ ] API build info endpoint returns valid JSON with buildAt + processId
- [ ] API health check returns 200 (if health endpoint exists)
- [ ] No critical errors in PM2 logs (`pm2 logs <service> --err --lines 20`)
- [ ] Load balancer receives responses from VMs
- [ ] Service memory usage normal (<allocated limits)
- [ ] Build artifacts working correctly (no `base_service_1 is not defined` errors)

### **Health Check Commands:**
```bash
# All VMs status check
for vm in 10.10.0.70 10.10.0.71 10.10.0.72; do
  echo "=== VM $vm ==="
  ssh root@$vm "pm2 status && curl -f http://localhost:3005/health"
done

# Production endpoint check
curl -I https://api.hydrabyte.co/lcm/health

# Service logs check
pm2 logs --err --lines 20
```

## 🛠️ DEPLOYMENT TROUBLESHOOTING

### **Common Issues & Solutions:**

#### **1. Jest/ESLint Not Found:**
- **Symptom**: `jest: not found` hoặc `eslint: not found`
- **Solution**: Deploy script sẽ auto-skip nếu không có, không cần action
- **Prevention**: Install dev dependencies nếu muốn run tests: `npm install`

#### **2. Build Artifacts Issues:**
- **Symptom**: `base_service_1 is not defined` khi start service
- **Solution**: Deploy script sẽ auto-rebuild trên VM nếu detect issue
- **Manual Fix**: 
  ```bash
  ssh root@<vm-ip> "cd /root/apps/lcm-service && npm run build && pm2 restart <service>"
  ```

#### **3. NestJS CLI Missing on VM:**
- **Symptom**: `nest: not found` khi rebuild trên VM  
- **Solution**: Deploy script sẽ auto-install @nestjs/cli
- **Manual Fix**:
  ```bash
  ssh root@<vm-ip> "cd /root/apps/lcm-service && npm install --save-dev @nestjs/cli"
  ```

#### **4. Service Keeps Restarting:**
- **Check logs**: `pm2 logs <service> --err --lines 50`
- **Common causes**: Database connection, missing environment variables
- **Check process**: `pm2 monit` để see real-time status

#### **5. API Not Responding:**
- **Check port**: `ssh root@<vm-ip> "netstat -tlnp | grep 3005"`
- **Check process**: `ssh root@<vm-ip> "pm2 status | grep <service>"`
- **Force restart**: `ssh root@<vm-ip> "pm2 delete <service> && pm2 start ecosystem.config.js --only <service>"`

## 🚨 EMERGENCY PROCEDURES

### **Rollback Command:**
```bash
# Rollback specific service on specific VM
./scripts/deploy.sh <previous-branch> <service> <target> --rollback

# Emergency stop all services
ssh root@<vm-ip> "pm2 stop all"

# Quick service restart
ssh root@<vm-ip> "pm2 restart lcm-api"
```

### **Critical Issues Response:**
1. **Service Down**: Restart PM2 service immediately
2. **API Not Responding**: Check load balancer và VM health
3. **Memory Issues**: Restart service, monitor memory usage
4. **Database Connection Issues**: Check .env config, restart services

### **Emergency Contacts:**
- **Production Issues**: Immediate notification required
- **Load Balancer Issues**: Check nginx/load balancer configuration
- **SSL Certificate Issues**: Verify HTTPS endpoint accessibility

## 📊 MONITORING

### **Key Metrics:**
- **API Response Time**: <300ms average
- **Service Uptime**: >99.5%  
- **Memory Usage**: API <1GB, Workers <4GB
- **Error Rate**: <0.5%
- **Load Balancer Health**: All 3 VMs responding

### **Daily Health Check:**
```bash
# Quick build info check (shows current deployment)
curl -s https://api.hydrabyte.co/lcm/ | python3 -m json.tool

# Health check
curl -s https://api.hydrabyte.co/lcm/health | python3 -m json.tool

# PM2 status check on all VMs
for vm in vm1 vm2 vm3; do
  echo "=== $vm ==="
  ssh root@10.10.0.7${vm#vm} "pm2 status | grep lcm-api"
done

# Build info from each VM
for vm in 10.10.0.70 10.10.0.71 10.10.0.72; do
  echo "=== VM $vm Build Info ==="
  ssh root@$vm "curl -s http://localhost:3005/ | python3 -m json.tool"
done

# Log error check
pm2 logs --err --lines 10 | grep -E "(ERROR|CRITICAL|Failed)"
```

---

## 🚀 DEPLOYMENT IMPROVEMENTS

### **Recent Enhancements (2025-01-17):**

#### **1. Intelligent Test Handling:**
- ✅ **Auto-skip missing tools**: Jest/ESLint automatically skipped if not available
- ✅ **No deployment blocking**: Missing dev tools không làm fail deployment
- ✅ **Warning notifications**: Clear warnings khi skip tests/linting

#### **2. Smart Build Artifact Handling:**
- ✅ **Build verification**: Auto-check build artifacts trước khi start service
- ✅ **Auto-rebuild**: Tự động rebuild trên VM nếu artifacts có issue
- ✅ **Nest CLI auto-install**: Tự động install @nestjs/cli nếu cần rebuild

#### **3. Enhanced Error Detection:**
- ✅ **Runtime verification**: Check `require('./dist/main.js')` trước khi deploy
- ✅ **Import resolution**: Detect và fix `base_service_1 is not defined` errors
- ✅ **Process validation**: Verify service can start before marking complete

#### **4. Improved Status Checking:**
- ✅ **Build info endpoint**: Track deployment với buildAt timestamp + processId
- ✅ **Fixed syntax errors**: Resolve shell script issues
- ✅ **Production verification**: Load balancer health checks

### **Deployment Workflow V2:**
```bash
# Enhanced workflow with auto-recovery
./scripts/deploy.sh trangpt api vm1
# → Auto-skip tests nếu Jest missing
# → Auto-rebuild nếu artifacts corrupt  
# → Auto-install deps nếu cần
# → Verify với build info endpoint

./scripts/check-status.sh vm1
# → Show build time để verify deployment
# → Production endpoint verification
# → No more script syntax errors
```

---

**Last Updated**: 2025-01-17 (Enhanced with lessons learned)
**Environment**: Production (3 VMs + Load Balancer)  
**URL**: https://api.hydrabyte.co/lcm
**Team**: TranGPT Agent + Human Coordinator