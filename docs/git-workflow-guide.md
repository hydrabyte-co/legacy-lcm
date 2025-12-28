# LCM Service Git Workflow Guide

**TranGPT Company - Development Team**  
**Project:** Loans Collection Management Service  
**Client:** Hoàn Kim Law Firm  

---

## 🌿 **BRANCH STRATEGY**

### **Core Branches**
- **`main`** 🏭 - Production code (stable, deployable)
- **`develop`** 🔧 - Integration branch (latest development)  
- **`trangpt`** 🤖 - Agent development branch

### **Supporting Branches**
- **`feature/[name]`** - New features and enhancements
- **`release/v[X.Y.Z]`** - Release preparation
- **`hotfix/[name]`** - Critical production fixes

---

## 🔧 **WORKFLOW COMMANDS**

### **Quick Deploy (Production)**
```bash
# Deploy main branch to all VMs
./deploy

# Deploy specific branch
./deploy develop

# Deploy to specific host
./deploy main 10.10.0.70

# Deploy specific branch to specific host
./deploy develop 10.10.0.71
```

### **Git Workflow Helper**
```bash
# Create new feature
./scripts/git-workflow.sh feature customer-encryption

# Create release
./scripts/git-workflow.sh release v1.2.0

# Sync submodule
./scripts/git-workflow.sh sync-submodule

# Check status
./scripts/git-workflow.sh status

# Prepare for deployment
./scripts/git-workflow.sh prepare-deploy
```

---

## 📋 **DEVELOPMENT WORKFLOWS**

### **1. Feature Development (Agent/Developer)**

```bash
# 1. Create feature branch
./scripts/git-workflow.sh feature payment-validation

# 2. Work on feature
git add .
git commit -m "feat: implement payment validation logic"

# 3. Update submodule if needed
./scripts/git-workflow.sh sync-submodule

# 4. Test before merge
./scripts/git-workflow.sh prepare-deploy

# 5. Merge to develop
./scripts/git-workflow.sh merge-feature feature/payment-validation
```

### **2. Release Process (CEO Tony)**

```bash
# 1. Create release branch
./scripts/git-workflow.sh release v1.2.0

# 2. Final testing and bug fixes only
npm run test
npm run build

# 3. Finish release (merge to main + tag)
./scripts/git-workflow.sh finish-release

# 4. Deploy to production
./deploy
```

### **3. Hotfix Process (Emergency)**

```bash
# 1. Create hotfix from main
./scripts/git-workflow.sh hotfix payment-calculation-bug

# 2. Fix the issue
git add .
git commit -m "fix: correct payment calculation formula"

# 3. Test fix
./scripts/git-workflow.sh prepare-deploy

# 4. Merge back to main and develop manually
git checkout main
git merge hotfix/payment-calculation-bug
git push origin main

git checkout develop  
git merge main
git push origin develop

# 5. Deploy immediately
./deploy
```

---

## 📦 **SUBMODULE MANAGEMENT**

### **Understanding Submodules**
- **Location:** `src/common`
- **Repository:** `service-common.git`
- **Purpose:** Shared utilities across TranGPT microservices

### **Submodule Operations**
```bash
# Check submodule status
git submodule status

# Update submodule to latest
./scripts/git-workflow.sh sync-submodule

# Initialize submodule (new clone)
git submodule init
git submodule update --recursive

# Update submodule reference in main repo
cd src/common
git checkout main
git pull origin main
cd ../..
git add src/common
git commit -m "chore: update common submodule"
```

---

## 🚀 **DEPLOYMENT STRATEGIES**

### **1. Standard Deployment**
```bash
# Deploy main branch to all production VMs
./deploy
```

### **2. Staged Deployment**
```bash
# Deploy to one VM first
./deploy main 10.10.0.70

# If successful, deploy to remaining VMs
./deploy main 10.10.0.71
./deploy main 10.10.0.72
```

### **3. Branch Testing Deployment**
```bash
# Deploy develop branch for testing
./deploy develop 10.10.0.70

# Full deployment after validation
./deploy develop
```

### **4. Rollback Deployment**
```bash
# Rollback all VMs
./scripts/deploy-production.sh --rollback

# Rollback specific VM
./scripts/deploy-production.sh --rollback -h 10.10.0.70
```

---

## 🔍 **MONITORING & VERIFICATION**

### **Pre-Deployment Checks**
```bash
# Check repository status
./scripts/git-workflow.sh status

# Test build locally
./scripts/git-workflow.sh prepare-deploy

# View deployment options
./scripts/deploy-production.sh --help
```

### **Post-Deployment Verification**
```bash
# Check PM2 services on VMs
ssh root@10.10.0.70 "pm2 status"
ssh root@10.10.0.71 "pm2 status" 
ssh root@10.10.0.72 "pm2 status"

# Check API health
curl http://10.10.0.70:3005/health
curl http://10.10.0.71:3005/health
curl http://10.10.0.72:3005/health
```

---

## ⚠️ **BEST PRACTICES**

### **Development Rules**
1. **Never work directly on `main`** - Always use feature branches
2. **Test before merge** - Use `prepare-deploy` command
3. **Keep commits atomic** - One logical change per commit
4. **Submodule coordination** - Update common submodule carefully
5. **Clean working directory** - Commit or stash changes before switching branches

### **Deployment Rules**
1. **Test locally first** - Always run `npm run build` before deploy
2. **Deploy during low traffic** - Outside business hours preferred
3. **Monitor after deployment** - Check services and error logs
4. **Have rollback plan** - Know how to rollback quickly
5. **Document changes** - Update relevant documentation

### **Emergency Procedures**
1. **Production down** - Use rollback immediately
2. **Critical bug** - Create hotfix branch, fix, deploy ASAP
3. **Data corruption** - Stop services, restore from backup
4. **Security breach** - Isolate affected systems, patch urgently

---

## 📞 **SUPPORT CONTACTS**

### **Development Team**
- **Agent:** TranGPT LCM Development Agent
- **CEO:** Hoàng Việt Dũng (Tony)
- **Client:** Hoàn Kim Law Firm

### **Emergency Escalation**
1. **TranGPT Development Agent** - Immediate technical response
2. **CEO Tony** - Business decision and client communication
3. **Hoàn Kim Law Firm** - Business impact assessment

---

## 📝 **COMMIT MESSAGE CONVENTIONS**

```bash
# Feature
feat: implement customer data encryption

# Bug fix
fix: correct payment calculation formula

# Infrastructure
chore: update common submodule dependencies

# Documentation  
docs: update API documentation

# Refactoring
refactor: optimize database query performance

# Test
test: add unit tests for payment module
```

---

## 🎯 **QUICK REFERENCE**

| Task | Command |
|------|---------|
| Deploy production | `./deploy` |
| Deploy specific branch | `./deploy develop` |
| Deploy to one VM | `./deploy main 10.10.0.70` |
| Create feature | `./scripts/git-workflow.sh feature <name>` |
| Create release | `./scripts/git-workflow.sh release v1.2.0` |
| Check status | `./scripts/git-workflow.sh status` |
| Test build | `./scripts/git-workflow.sh prepare-deploy` |
| Sync submodule | `./scripts/git-workflow.sh sync-submodule` |
| Rollback production | `./scripts/deploy-production.sh --rollback` |

---

*Document created by TranGPT LCM Development Agent*  
*Last updated: $(date)*  
*Version: 1.0*