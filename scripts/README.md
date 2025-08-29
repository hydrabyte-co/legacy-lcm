# LCM Service - Deployment Scripts

## 🚀 Quick Start

### Deploy API to all VMs from main branch
```bash
./scripts/deploy.sh main api all
```

### Check system status
```bash
./scripts/check-status.sh
```

## 📋 Available Scripts

| Script | Purpose | Usage |
|--------|---------|--------|
| `deploy.sh` | Deploy services to production VMs | `./scripts/deploy.sh <branch> <service> <target>` |
| `check-status.sh` | Check VM and service status | `./scripts/check-status.sh [target]` |

## 🎯 Common Commands

```bash
# Production deployment workflow
./scripts/deploy.sh main api all              # Deploy API from main
./scripts/check-status.sh                     # Verify deployment
curl https://api.hydrabyte.co/lcm/health      # Test production endpoint

# Development deployment
./scripts/deploy.sh trangpt wrk vm1           # Deploy worker to VM1
./scripts/check-status.sh vm1                 # Check specific VM

# Emergency procedures  
./scripts/deploy.sh main all all --rollback   # Rollback all services
./scripts/check-status.sh                     # Verify rollback
```

## 🏗️ Infrastructure

- **3 Production VMs**: 10.10.0.70, 10.10.0.71, 10.10.0.72
- **Load Balancer**: https://api.hydrabyte.co/lcm
- **Repository Path**: `/root/apps/lcm-service/` (on all VMs)
- **Process Manager**: PM2 with ecosystem.config.js

## 🔧 Services

- **lcm-api**: Main API server (port 3005) - **Required on all VMs**
- **lcm-ms-file**: File processing microservice
- **lcm-ms-sync**: Data synchronization microservice  
- **lcm-wrk**: General background worker
- **lcm-wrk:payment-migration**: Payment migration worker

## 🌿 Branches

- **main**: Production releases
- **trangpt**: Development branch
- **hotfix**: Emergency fixes