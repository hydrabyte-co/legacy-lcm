# LCM Service - Agent Collaboration Guide

**For AI Agents developing và maintaining the Loans Collection Management System**

---

## 🤖 Agent Overview

This guide is designed for AI agents working on the **LCM (Loans Collection Management) Service** for **TranGPT Company** serving **Hoàn Kim Law Firm**. The system manages comprehensive debt collection operations including customer management, call systems, payment processing, và business intelligence.

### System Context
- **Technology:** NestJS 8.x với TypeScript, MongoDB, MSSQL, RabbitMQ
- **Business Domain:** Debt collection for financial institutions
- **Architecture:** Microservice với 3 modes (API/MS/Worker)
- **Scale:** 20 business modules, 160+ TypeScript files
- **Deployment:** PM2 ecosystem với production monitoring

---

## 🎯 Agent Responsibilities

### Primary Functions
- **Development:** Implement new features và fix bugs trong debt collection modules
- **Integration:** Ensure seamless module interactions và external integrations
- **Testing:** Comprehensive testing với realistic debt collection scenarios
- **Performance:** Optimize for high-volume debt collection operations
- **Compliance:** Maintain regulatory compliance và customer data protection

### Key Capabilities Expected
- Understanding of debt collection business processes
- Proficiency với NestJS patterns và TypeScript
- Database optimization cho financial data (MongoDB/MSSQL)
- Message queue processing (RabbitMQ/AMQP)
- Financial calculation accuracy và compliance

---

## 📚 Knowledge Base

### Business Domain Expertise

#### Core Debt Collection Workflow
```typescript
const debtCollectionWorkflow = {
  1: 'Partner Onboarding - Financial institution partnership',
  2: 'Data Import - Customer và contract data import', 
  3: 'Customer Assignment - Staff allocation based on skills/load',
  4: 'Call Management - Outbound calls (click-to-call, auto-dialer)',
  5: 'Activity Tracking - Log all customer interactions',
  6: 'Payment Processing - Handle payments và update balances', 
  7: 'Performance Analytics - KPI tracking và reporting',
  8: 'Compliance - Audit trails và regulatory reporting'
};
```

#### Key Business Entities
```typescript
// Core business relationships
Partner (1) ←→ (N) Customer ←→ (N) Contract
Staff (1) ←→ (N) Call ←→ (1) Customer  
Customer (1) ←→ (N) Activity ←→ (1) Staff
Contract (1) ←→ (N) Transaction ←→ (1) Customer

// Business rules
const businessRules = {
  customer: 'Must belong to active partner',
  contract: 'Must have positive original amount',
  call: 'Respect time restrictions (8AM-9PM)',
  payment: 'Must not exceed outstanding balance',
  activity: 'All interactions must be logged'
};
```

### Technical Architecture

#### Module Structure (All 20 modules)
```typescript
// Standardized structure - 100% consistent
const moduleStructure = {
  controller: 'REST API endpoints với validation',
  service: 'Business logic với BaseService inheritance', 
  module: 'NestJS configuration với TypeORM',
  dto: {
    'create.dto.ts': '✅ All 20 modules have this',
    'update-one.dto.ts': '✅ All 20 modules have this',
    'find-one.dto.ts': '✅ All 20 modules have this'
  },
  entity: 'MongoDB schema với proper indexes',
  enum: 'Business-specific enums',
  README: '✅ Comprehensive documentation'
};
```

#### Service Modes
```bash
# Development commands
npm run api              # API server (Port 3005)
npm run ms:dev           # Microservice mode
npm run wrk:dev          # Worker mode
npm run wrk-payment:dev  # Payment migration worker

# Production PM2 services
pm2 start ecosystem.config.js --only lcm-api
pm2 start ecosystem.config.js --only lcm-ms-file
pm2 start ecosystem.config.js --only lcm-wrk
```

---

## 🛠 Development Patterns

### Standard CRUD Implementation

```typescript
// Service pattern - inherit from BaseService
@Injectable()
export class CustomerService extends BaseService<Customer> {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: MongoRepository<Customer>,
  ) {
    super(customerRepository);
  }

  // Business-specific methods
  async findByPartnerCode(partnerCode: string, handler: DataHandler) {
    return super.findManyByField('partnerCode', partnerCode, handler);
  }

  // Debt collection specific validation
  private async validateDebtCollectionRules(data: any) {
    // Implement business rules validation
    if (data.partnerCode) {
      const partner = await this.partnerService.findByCode(data.partnerCode);
      if (!partner || partner.status !== 'active') {
        throw new Error('Partner must be active');
      }
    }
  }
}
```

### DTO Pattern (ID-to-Object Resolution)

```typescript
// ✅ Correct pattern - DTOs receive IDs
export class CreateCallData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  customerCode = '';    // ID input
  
  @IsString() 
  @IsNotEmpty()
  staffCode = '';       // ID input
}

// ✅ Service resolves IDs to full objects
async create(data: CreateCallData) {
  // 1. Validate references exist
  const customer = await this.customerService.findByCode(data.customerCode);
  const staff = await this.staffService.findByCode(data.staffCode);
  
  // 2. Store complete objects
  return await this.repository.save({
    ...data,
    customer: customer,  // Full CustomerInfo object
    staff: staff        // Full StaffInfo object  
  });
}
```

### Testing with MockDataGenerator

```typescript
import { MockDataGenerator, TestDatabaseHelper, VALIDATION_HELPERS } from '../test-utils';

describe('DebtCollectionScenario', () => {
  it('should handle complete debt collection workflow', async () => {
    // Generate realistic test scenario
    const scenario = MockDataGenerator.generateDebtCollectionScenario();
    
    // Validate business relationships
    VALIDATION_HELPERS.validateDebtCollectionRules(
      scenario.customer, 
      scenario.contract
    );
    
    // Test integration points
    expect(scenario.customer.partnerCode).toBe(scenario.partner.code);
    expect(scenario.contract.customerCode).toBe(scenario.customer.code);
    
    // Test with database
    const testData = await TestDatabaseHelper.setupDebtCollectionScenario({
      partnerRepository, customerRepository, contractRepository, staffRepository
    });
    
    // Verify data integrity
    const isValid = await TestDatabaseHelper.verifyDataIntegrity(testData);
    expect(isValid).toBe(true);
  });
});
```

---

## 🔄 Common Development Workflows

### Adding New Business Feature

```typescript
// 1. Create Change Request (if major change)
const crRequired = [
  'New debt collection features',
  'Customer data schema changes', 
  'Payment processing modifications',
  'Call system integration changes',
  'Security/compliance updates'
];

// 2. Follow standardized implementation
class NewFeatureImplementation {
  async implement() {
    // a. Update DTOs với proper validation
    // b. Add business logic to service
    // c. Create comprehensive tests
    // d. Update module README
    // e. Test integration với related modules
    // f. Verify compliance requirements
  }
}

// 3. Use established patterns
const patterns = {
  validation: 'class-validator decorators',
  businessLogic: 'BaseService inheritance',
  testing: 'MockDataGenerator + real scenarios',
  documentation: 'README updates với examples'
};
```

### Debugging Common Issues

```typescript
const commonIssues = {
  'Customer not found': {
    check: 'Verify customer.partnerCode maps to active partner',
    solution: 'Validate partner relationship in service'
  },
  
  'Payment validation failed': {
    check: 'Ensure payment amount <= contract.currentBalance', 
    solution: 'Add financial validation rules'
  },
  
  'Call system error': {
    check: 'Verify call time within 8AM-9PM restrictions',
    solution: 'Add time validation before call origination'
  },
  
  'Database performance': {
    check: 'Review query indexes và N+1 problems',
    solution: 'Use proper MongoDB indexes và joins'
  }
};
```

---

## 📊 Performance Guidelines

### Database Optimization

```typescript
// Critical indexes for performance
const requiredIndexes = {
  customers: ['code', 'partnerCode', 'status', 'priority'],
  contracts: ['customerCode', 'partnerCode', 'overdueAmount', 'status'],
  calls: ['customerCode', 'staffCode', 'startTime', 'callStatus'],
  transactions: ['customerCode', 'contractCode', 'amount', 'status']
};

// Query optimization patterns
const optimizationPatterns = {
  pagination: 'Always use limit/skip for large datasets',
  filtering: 'Use compound indexes for multi-field queries', 
  aggregation: 'Use MongoDB aggregation pipeline for complex reports',
  bulkOps: 'Batch operations in groups of 1000 records'
};
```

### Memory Management

```typescript
const memoryGuidelines = {
  bulkProcessing: 'Process in batches of 1000 records max',
  testData: 'Clean up test data after each test run',
  fileProcessing: 'Stream large files instead of loading to memory',
  caching: 'Cache calculated values for performance metrics'
};
```

---

## 🔒 Security & Compliance Requirements

### Data Protection

```typescript
const dataProtection = {
  sensitive: [
    'customer.identityNumber',    // Encrypt at rest
    'customer.mobileNumber',      // Mask in logs  
    'contract.originalAmount',    // Financial data protection
    'call.recording',             // Secure storage required
    'transaction.amount'          // Audit all changes
  ],
  
  accessControl: {
    staff: 'Can only access assigned customers',
    manager: 'Can access team customers',  
    admin: 'Full access với audit trail'
  },
  
  audit: 'Log all sensitive data access và modifications'
};
```

### Business Compliance

```typescript
const complianceRules = {
  callTimeRestrictions: {
    startHour: 8,   // 8 AM
    endHour: 21,    // 9 PM
    maxCallsPerDay: 3,
    respectDoNotCall: true
  },
  
  dataRetention: {
    customerData: '7 years minimum',
    callRecordings: '5 years', 
    financialData: 'Per regulatory requirements',
    auditLogs: '10 years'
  },
  
  privacy: {
    gdprCompliance: true,
    customerConsent: 'Required for recording',
    dataMinimization: 'Collect only necessary data'
  }
};
```

---

## 🧪 Testing Strategy

### Test Categories

```typescript
const testingStrategy = {
  unit: {
    scope: 'Individual service methods',
    tools: 'Jest + MockDataGenerator',
    coverage: 'Business logic validation'
  },
  
  integration: {
    scope: 'Module interactions',
    tools: 'TestDatabaseHelper + real DB',
    coverage: 'End-to-end workflows'
  },
  
  performance: {
    scope: 'High-volume operations', 
    tools: 'Bulk data generation',
    coverage: 'Database queries, API response times'
  },
  
  business: {
    scope: 'Debt collection scenarios',
    tools: 'DebtCollectionScenarios',
    coverage: 'Regulatory compliance, business rules'
  }
};
```

### Test Commands

```bash
# Quick test commands  
./scripts/run-tests.sh unit              # Unit tests only
./scripts/run-tests.sh module customer   # Specific module
./scripts/run-tests.sh business          # Debt collection scenarios
./scripts/run-tests.sh performance       # Performance tests

# Database testing
./scripts/test-database.sh status        # Check DB connectivity
./scripts/test-database.sh seed          # Seed test data
./scripts/test-database.sh clean         # Clean test data
```

---

## 🚀 Deployment & Operations

### Pre-deployment Checklist

```typescript
const deploymentChecklist = [
  '✅ All tests passing (unit, integration, e2e)',
  '✅ Performance benchmarks met', 
  '✅ Security scan completed',
  '✅ Database migrations tested',
  '✅ Change Request approved (if applicable)',
  '✅ Monitoring alerts configured',
  '✅ Rollback plan prepared'
];
```

### Production Monitoring

```bash
# Service health monitoring
pm2 status                    # Check all services
pm2 logs lcm-api             # API server logs
pm2 logs lcm-ms-file         # File processing logs  
pm2 logs lcm-wrk             # Worker logs

# Database monitoring
./scripts/test-database.sh status
./scripts/run-tests.sh performance
```

---

## 📈 Business Intelligence & Analytics

### Key Performance Metrics

```typescript
const kpiMetrics = {
  collection: {
    successRate: 'Successful collections / total attempts',
    averageCollectionTime: 'Days from assignment to payment',
    customerReachRate: 'Successful contacts / total attempts',
    promiseToPayConversion: 'PTP to actual payment conversion'
  },
  
  operational: {
    callVolume: 'Calls per agent per day',
    callDuration: 'Average call duration',
    queueProcessingTime: 'Auto dialer queue processing speed',
    systemUptime: 'Service availability percentage'
  },
  
  financial: {
    recoveryRate: 'Amount collected / total debt assigned',
    costPerCollection: 'Operational cost / successful collection',
    portfolioPerformance: 'Partner-wise recovery analysis'
  }
};
```

---

## 🤝 Agent Collaboration Best Practices

### Code Review Guidelines

```typescript
const codeReviewChecklist = {
  businessLogic: [
    'Does it handle debt collection rules correctly?',
    'Are partner relationships validated?', 
    'Is customer data properly protected?',
    'Are financial calculations accurate?'
  ],
  
  technical: [
    'Follows established DTO patterns?',
    'Uses MockDataGenerator for testing?', 
    'Has comprehensive error handling?',
    'Includes performance considerations?'
  ],
  
  compliance: [
    'Maintains audit trails?',
    'Respects call time restrictions?',
    'Protects customer privacy?',
    'Follows regulatory requirements?'
  ]
};
```

### Communication Patterns

```typescript
const communicationGuidelines = {
  changeRequests: 'Use CR system for major changes',
  documentation: 'Update module READMEs for significant changes',
  testing: 'Include business scenario testing',
  deployment: 'Coordinate với operational team',
  issues: 'Report problems với business context'
};
```

---

## 📞 Agent Support Resources

### Quick Reference

```typescript
const quickReference = {
  testData: 'MockDataGenerator.generateDebtCollectionScenario()',
  validation: 'VALIDATION_HELPERS.validateDebtCollectionRules()',
  constants: 'DEBT_COLLECTION_CONSTANTS.AMOUNTS.MAX_TRANSACTION',
  patterns: 'Follow templates/ folder examples',
  troubleshooting: 'Check module README.md files'
};
```

### Useful Scripts

```bash
# Development utilities
./scripts/generate-module.sh <module-name>    # Generate new module
./scripts/run-tests.sh help                   # Test options
./scripts/test-database.sh help               # Database utilities

# Module generation
./scripts/generate-module.sh collection-agency
# Creates complete module structure với standardized patterns
```

### Emergency Procedures

```typescript
const emergencyProcedures = {
  serviceDown: {
    1: 'Check PM2 service status',
    2: 'Review application logs', 
    3: 'Verify database connectivity',
    4: 'Check RabbitMQ queue status',
    5: 'Restart services if needed'
  },
  
  dataCorruption: {
    1: 'Stop processing immediately',
    2: 'Isolate affected customer data',
    3: 'Restore from backup if needed',
    4: 'Verify data integrity',
    5: 'Resume operations cautiously'
  },
  
  performanceDegradation: {
    1: 'Check database query performance',
    2: 'Monitor memory usage',
    3: 'Review recent changes',
    4: 'Optimize slow queries',
    5: 'Scale resources if needed'
  }
};
```

---

## 🎯 Success Metrics for Agents

### Development Quality

- **Code Coverage:** > 80% test coverage
- **Performance:** < 300ms API response time
- **Reliability:** > 99.5% uptime
- **Business Accuracy:** 100% financial calculation accuracy

### Business Impact

- **Collection Efficiency:** Improved success rates
- **Compliance:** Zero regulatory violations
- **Customer Satisfaction:** Reduced complaints
- **Operational Cost:** Reduced cost per collection

---

*Agent Collaboration Guide for LCM Service*  
*Comprehensive debt collection management system*  
*TranGPT Company - Serving Hoàn Kim Law Firm*  
*Last Updated: 2025-01-17*