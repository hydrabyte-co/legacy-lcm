# Troubleshooting Guide - LCM Service

## 🚨 EMERGENCY RESPONSE PROTOCOL

### Critical Issues (Service Down)
1. **Check Service Status:** `npm run api`, `npm run ms:dev`, `npm run wrk:dev`
2. **Verify Database Connections:** MongoDB and MSSQL connectivity
3. **Check AMQP Queue Status:** RabbitMQ connection and queue health
4. **Review System Resources:** Memory, CPU, disk space
5. **Escalate to CEO Tony:** Critical business impact notification

### Emergency Contact
- **CEO Tony (Founder):** Immediate escalation for service outages
- **Business Impact:** Debt collection operations halted
- **Recovery Procedure:** Follow incident response checklist

---

## 🔍 COMMON ISSUES & SOLUTIONS

### 1. Service Startup Issues

#### Problem: Application Won't Start
```bash
# Error Examples:
Error: Cannot find module '@nestjs/core'
Error: MongoDB connection failed
Error: Port 3000 already in use
```

**Solutions:**
```bash
# Check dependencies
npm install

# Verify environment variables
cat .env | grep -E "(MONGO|DB|PORT|AMQP)"

# Check port availability
lsof -i :3000
killall -9 node  # If needed

# Database connection test
npm run test:db

# Clean restart
npm run build && npm start
```

#### Problem: Module Import Errors
```bash
# Common errors:
Cannot resolve module 'src/modules/...'
Circular dependency detected
```

**Solutions:**
```bash
# Check import paths
npm run build  # Will show compilation errors

# Fix circular dependencies
# Review module imports, use index.ts exports

# Verify file structure
ls -la src/modules/*/
```

### 2. Database Connection Issues

#### Problem: MongoDB Connection Failed
```bash
# Error symptoms:
MongoNetworkError: failed to connect to server
MongooseServerSelectionError
```

**Diagnosis & Solutions:**
```bash
# Check MongoDB service
systemctl status mongod
# or
brew services list | grep mongodb

# Test connection manually
mongo --host localhost --port 27017

# Check environment variables
echo $MONGODB_URI
# Should be: mongodb://localhost:27017/lcm-production

# Connection pool issues
# Restart application with fresh connection
npm run start:dev
```

#### Problem: MSSQL Integration Errors
```bash
# Error symptoms:
ConnectionError: Failed to connect to localhost:1433
Login timeout expired
```

**Solutions:**
```bash
# Check SQL Server service
systemctl status mssql-server
# or Windows: net start MSSQLSERVER

# Test connection
sqlcmd -S localhost -U sa -P your_password

# Check connection string in environment
echo $MSSQL_CONNECTION_STRING

# Update connection timeout in config
```

### 3. Call System Issues

#### Problem: Auto Dialer Not Working
```bash
# Symptoms:
Calls stuck in PENDING status
No connection to dialer system
Timeout errors in call logs
```

**Diagnosis Steps:**
```typescript
// Check call queue status
async function checkCallQueue() {
  const pendingCalls = await Call.find({ 
    'callResult.status': 'PENDING',
    'callInfo.type': 'AUTO_DIALER'
  });
  console.log(`Pending calls: ${pendingCalls.length}`);
}

// Check AMQP connection
async function checkAMQPHealth() {
  // Verify RabbitMQ connection
  // Check queue depth
  // Validate message processing
}
```

**Solutions:**
```bash
# Restart call service
npm run wrk:dev

# Check AMQP queue health
rabbitmqctl list_queues name messages

# Reset stuck calls
# MongoDB command to reset PENDING calls older than 30 minutes
```

#### Problem: Click-to-Call Failures
```bash
# Symptoms:
WebRTC connection errors
No audio in browser
Call initiation timeout
```

**Solutions:**
```bash
# Check browser permissions
# Verify HTTPS/SSL certificate
# Test audio/microphone access
# Clear browser cache and cookies

# Server-side checks
netstat -an | grep :8080  # WebRTC signaling port
```

### 4. Data Processing Issues

#### Problem: Excel Import Failures
```bash
# Error symptoms:
Invalid file format
Memory exceeded during processing
Validation errors for customer data
```

**Diagnosis:**
```typescript
// Check file validation
interface ImportValidation {
  fileSize: number;        // Max 50MB
  rowCount: number;        // Max 10,000 rows
  columnMapping: boolean;  // Required columns present
  dataQuality: {
    duplicates: number;
    invalidPhones: number;
    missingRequired: number;
  };
}

// Memory monitoring during import
process.memoryUsage();
```

**Solutions:**
```bash
# Process large files in chunks
# Implement streaming for Excel processing
# Add progress tracking
# Validate data before processing

# Clear processing queue
# Reset failed import status
# Retry with smaller batch sizes
```

#### Problem: Data Migration Errors
```bash
# Symptoms:
Foreign key constraint violations
Data type conversion errors
Duplicate key errors during migration
```

**Solutions:**
```bash
# Check data integrity before migration
npm run migration:validate

# Run migration with logging
npm run migration:run --verbose

# Handle duplicates
# Update migration scripts with upsert logic
```

### 5. Performance Issues

#### Problem: Slow API Response Times
```bash
# Symptoms:
Response times > 2 seconds
Database query timeouts
Memory usage continuously increasing
```

**Diagnosis:**
```bash
# Monitor API endpoints
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3000/api/customers"

# Database query profiling
# Enable MongoDB slow query log
# Check database indexes

# Memory leak detection
node --inspect=0.0.0.0:9229 dist/main.js
```

**Solutions:**
```bash
# Optimize database queries
# Add proper indexing
# Implement caching for frequently accessed data
# Add pagination for large result sets

# Database maintenance
# Regular index rebuilding
# Query optimization
```

#### Problem: High Memory Usage
```bash
# Symptoms:
Process killed by OOM killer
Gradual memory increase over time
Slow garbage collection
```

**Monitoring:**
```bash
# Check memory usage
ps aux | grep node
free -h

# Node.js memory profiling
node --max-old-space-size=4096 dist/main.js
```

**Solutions:**
```bash
# Identify memory leaks
# Optimize large object processing
# Implement streaming for big data operations
# Add memory usage monitoring and alerts
```

### 6. Authentication & Authorization Issues

#### Problem: JWT Token Validation Failures
```bash
# Symptoms:
401 Unauthorized responses
Token expired errors
Invalid signature errors
```

**Diagnosis:**
```typescript
// Token validation debug
async function debugToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token valid:', decoded);
  } catch (error) {
    console.error('Token error:', error.message);
  }
}
```

**Solutions:**
```bash
# Check JWT secret configuration
echo $JWT_SECRET

# Verify token expiration settings
# Check clock synchronization between services
# Refresh token mechanism validation
```

#### Problem: Role-Based Access Control Issues
```bash
# Symptoms:
Users accessing unauthorized data
Permission denied for valid operations
Role assignments not working
```

**Solutions:**
```typescript
// Debug user permissions
async function checkUserPermissions(userId: string) {
  const user = await Staff.findById(userId);
  console.log('User roles:', user.permissions);
  
  // Check contract assignments
  const assignments = await Contract.find({ 
    'collectionInfo.assignedStaffId': userId 
  });
  console.log('Assigned contracts:', assignments.length);
}
```

### 7. Business Logic Errors

#### Problem: Payment Processing Failures
```bash
# Symptoms:
Incorrect payment allocation
Double payment processing
Balance calculation errors
```

**Diagnosis:**
```typescript
// Validate payment calculations
interface PaymentValidation {
  originalBalance: number;
  paymentAmount: number;
  expectedBalance: number;
  actualBalance: number;
  allocationBreakdown: {
    principal: number;
    interest: number;
    penalty: number;
  };
}
```

**Solutions:**
```bash
# Add transaction locks for payment processing
# Implement idempotency for payment operations
# Add comprehensive logging for payment flows
# Create reconciliation jobs for payment validation
```

#### Problem: Customer Data Inconsistencies
```bash
# Symptoms:
Duplicate customer records
Conflicting contact information
Missing required fields
```

**Solutions:**
```bash
# Data cleanup scripts
# Duplicate detection and merging
# Data validation rules enforcement
# Regular data quality audits
```

---

## 🔧 DEBUGGING TOOLS & TECHNIQUES

### 1. Application Debugging

#### Enable Debug Logging
```bash
# Environment variable
DEBUG=lcm:* npm run start:dev

# NestJS logging levels
LOG_LEVEL=debug npm run start:dev
```

#### Database Query Debugging
```bash
# MongoDB query profiling
db.setProfilingLevel(2, { slowms: 100 })

# View slow queries
db.system.profile.find().limit(5).sort({ ts: -1 }).pretty()
```

#### Performance Profiling
```bash
# CPU profiling
node --prof dist/main.js

# Memory profiling
node --inspect-brk=0.0.0.0:9229 dist/main.js
```

### 2. Health Check Endpoints

#### System Health Check
```typescript
// GET /health endpoint response
interface HealthCheck {
  status: 'ok' | 'error';
  timestamp: Date;
  services: {
    database: {
      mongodb: 'connected' | 'disconnected';
      mssql: 'connected' | 'disconnected';
    };
    queues: {
      amqp: 'connected' | 'disconnected';
      pendingJobs: number;
    };
    external: {
      dialerSystem: 'online' | 'offline';
      paymentGateway: 'online' | 'offline';
    };
  };
  performance: {
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    activeConnections: number;
  };
}
```

### 3. Monitoring & Alerting

#### Key Metrics to Monitor
```typescript
interface MonitoringMetrics {
  application: {
    responseTime: number;      // Average API response time
    errorRate: number;         // Errors per minute
    throughput: number;        // Requests per minute
    activeUsers: number;       // Concurrent users
  };
  
  business: {
    callsPerMinute: number;    // Call system activity
    paymentsProcessed: number; // Payment processing rate
    dataImports: number;       // Bulk data operations
    systemErrors: number;      // Business logic errors
  };
  
  infrastructure: {
    cpuUsage: number;          // CPU utilization
    memoryUsage: number;       // Memory consumption
    diskSpace: number;         // Available disk space
    networkLatency: number;    // Network response time
  };
}
```

### 4. Log Analysis

#### Log Levels & Categories
```typescript
enum LogLevel {
  ERROR = 'error',     // System errors, exceptions
  WARN = 'warn',       // Performance issues, deprecations
  INFO = 'info',       // Business events, user actions
  DEBUG = 'debug',     // Detailed debugging information
  TRACE = 'trace'      // Function entry/exit, variables
}

enum LogCategory {
  SYSTEM = 'system',           // Infrastructure events
  BUSINESS = 'business',       // Business logic events
  SECURITY = 'security',       // Authentication, authorization
  PERFORMANCE = 'performance', // Timing, resource usage
  AUDIT = 'audit'             // Data changes, user actions
}
```

#### Log Search Commands
```bash
# Search for errors in last hour
grep -E "ERROR|FATAL" logs/application.log | tail -100

# Find payment processing errors
grep "payment" logs/application.log | grep -i error

# Customer data access audit
grep "customer.*access" logs/audit.log | tail -50

# Performance issues
grep "slow query\|timeout\|memory" logs/application.log
```

---

## 📋 MAINTENANCE CHECKLISTS

### Daily Health Check
- [ ] Verify all services are running (API, Worker, Microservice)
- [ ] Check database connections (MongoDB, MSSQL)
- [ ] Validate AMQP queue health
- [ ] Review error logs from past 24 hours
- [ ] Confirm call system functionality
- [ ] Verify payment processing operations
- [ ] Check system resource usage

### Weekly Maintenance
- [ ] Database performance review
- [ ] Index optimization analysis
- [ ] Log file rotation and cleanup
- [ ] Security patch assessment
- [ ] Backup verification
- [ ] Performance metrics review
- [ ] User feedback analysis

### Monthly Maintenance
- [ ] Full system health assessment
- [ ] Database maintenance and optimization
- [ ] Security audit and vulnerability scan
- [ ] Performance benchmarking
- [ ] Documentation updates
- [ ] Disaster recovery testing
- [ ] Compliance review

### Emergency Response Checklist
- [ ] Identify and isolate the problem
- [ ] Assess business impact
- [ ] Implement immediate workaround if possible
- [ ] Notify stakeholders (CEO Tony, affected partners)
- [ ] Document the incident
- [ ] Fix the root cause
- [ ] Test the solution thoroughly
- [ ] Conduct post-incident review
- [ ] Update procedures to prevent recurrence

---

## 📞 ESCALATION PROCEDURES

### Level 1: Agent Self-Resolution (0-30 minutes)
- Standard troubleshooting procedures
- Log analysis and common fixes
- Service restarts and basic recovery
- Documentation of actions taken

### Level 2: Technical Escalation (30+ minutes)
- Complex technical issues requiring deep analysis
- Database corruption or integrity issues
- Security incidents or data breaches
- Integration failures with external systems

### Level 3: Business Escalation (Critical Impact)
- Service outages affecting debt collection operations
- Data loss or corruption affecting customer data
- Security breaches involving sensitive information
- Compliance violations or regulatory issues

### Emergency Escalation (Immediate)
- **CEO Tony:** All critical business impact issues
- **Legal Team:** Compliance violations, data breaches
- **Partners:** Service disruptions affecting their operations
- **Customers:** Data privacy incidents, service outages

---

*Troubleshooting Guide for LCM Service*  
*Comprehensive Issue Resolution and Maintenance Procedures*  
*TranGPT LCM Service Development Team*