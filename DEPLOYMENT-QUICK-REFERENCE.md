# 🚀 LCM Service Deployment - Quick Reference

## ⚡ NEW CENTRALIZED DEPLOYMENT (RECOMMENDED)

### **Super Fast Deploy:**
```bash
# Deploy API to all VMs (1.7 minutes vs 5.5 minutes!)
./scripts/deploy-centralized.sh main api all

# Deploy specific service to specific VM
./scripts/deploy-centralized.sh trangpt wrk vm1

# Deploy everything everywhere
./scripts/deploy-centralized.sh hotfix all all
```

### **Safety Checks:**
```bash
# Test before deploy
./scripts/deploy-centralized.sh main api all --dry-run

# Check status after deploy
./scripts/check-status.sh

# Rollback if issues
./scripts/deploy-centralized.sh main api all --rollback
```

## 🏗️ HOW IT WORKS

### **Old Way (SLOW):**
```
Build Local → Deploy VM1 (build again) → Deploy VM2 (build again) → Deploy VM3 (build again)
   60s            90s                     90s                      90s
                                TOTAL: 330s (5.5 minutes)
```

### **New Way (FAST):**
```
Build Local → Create Package → Deploy ALL VMs in Parallel
   60s           10s             30s
                        TOTAL: 100s (1.7 minutes) 🚀 70% FASTER!
```

## 📋 DEPLOYMENT CHECKLIST

### **Before Deploy:**
- [ ] Check current branch: `git branch --show-current`
- [ ] Pull latest changes: `git pull origin <branch>`
- [ ] Check VM connectivity: `./scripts/check-status.sh`

### **Deploy Command:**
```bash
# Replace with your values:
./scripts/deploy-centralized.sh <branch> <service> <target>
```

### **After Deploy:**
- [ ] Verify services: `./scripts/check-status.sh`
- [ ] Check production: `curl https://api.hydrabyte.co/lcm/health`
- [ ] Monitor logs: `pm2 logs lcm-api --lines 20`

## 🎯 COMMON SCENARIOS

### **API Deployment:**
```bash
# Production API update
./scripts/deploy-centralized.sh main api all

# Development API test  
./scripts/deploy-centralized.sh trangpt api vm1
```

### **Worker Deployment:**
```bash
# General worker
./scripts/deploy-centralized.sh main wrk vm1

# Payment migration worker
./scripts/deploy-centralized.sh main wrk-payment vm2
```

### **Microservice Deployment:**
```bash
# File processing microservice
./scripts/deploy-centralized.sh main ms-file vm1

# Data sync microservice
./scripts/deploy-centralized.sh main ms-sync vm2
```

### **Emergency Deployment:**
```bash
# Hotfix to all services on all VMs
./scripts/deploy-centralized.sh hotfix all all

# Quick rollback if issues
./scripts/deploy-centralized.sh main all all --rollback
```

## 🔧 TROUBLESHOOTING

### **If Deployment Fails:**
1. **Check logs**: `tail -f /tmp/lcm-deploy-logs/lcm-centralized-deploy-*.log`
2. **Check VM connectivity**: `./scripts/check-status.sh`
3. **Rollback**: `./scripts/deploy-centralized.sh main api all --rollback`

### **If Services Won't Start:**
1. **Check PM2**: `ssh root@10.10.0.70 "pm2 status"`
2. **Check logs**: `ssh root@10.10.0.70 "pm2 logs lcm-api --err"`
3. **Restart manually**: `ssh root@10.10.0.70 "pm2 restart lcm-api"`

## 🆚 SCRIPT COMPARISON

| Feature | deploy.sh (OLD) | deploy-centralized.sh (NEW) |
|---------|-----------------|------------------------------|
| **Speed** | ~5.5 minutes | ~1.7 minutes (70% faster) |
| **Consistency** | Different builds per VM | Identical builds all VMs |
| **Resource Usage** | High (each VM builds) | Low (only transfer) |
| **Parallel Deploy** | ❌ Sequential | ✅ Parallel |
| **Error Recovery** | Complex | Simple rollback |
| **Network Usage** | High | Low (compressed) |

## 🚨 EMERGENCY CONTACTS

### **If Critical Issues:**
- **Production Down**: Use rollback immediately
- **Load Balancer Issues**: Check https://api.hydrabyte.co/lcm/health
- **Database Issues**: Check MongoDB/MSSQL connections

### **Quick Health Checks:**
```bash
# All VMs status
./scripts/check-status.sh

# Production endpoint  
curl -I https://api.hydrabyte.co/lcm/health

# Individual VM check
ssh root@10.10.0.70 "pm2 status && curl http://localhost:3005/health"
```

---

**🎯 REMEMBER**: Use `deploy-centralized.sh` for all deployments - It's faster, safer, and more reliable!

**📚 Full Documentation**: See `.knowledge/deployment-guide.md` for complete details.

**🔄 Last Updated**: 2025-01-17 - Revolutionary centralized build system implemented