# Contributing to LCM Service

Welcome to the **Loans Collection Management (LCM) Service** development guide! This document outlines the development workflow, coding standards, and best practices for contributing to this debt collection management system.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Change Request Process](#change-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Business Domain Guidelines](#business-domain-guidelines)
- [Deployment Process](#deployment-process)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 16.x
- **MongoDB** (Primary database)
- **Microsoft SQL Server** (Legacy integration)
- **RabbitMQ** (Message queue)
- **Git** với proper SSH setup
- **VSCode** với recommended extensions

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd lcm-service

# Install dependencies
npm install

# Setup development environment
npm run start:dev

# Verify setup
npm run test
```

### Development Environment

```bash
# API Server mode (Port: 3005)
npm run api

# Microservice mode  
npm run ms:dev

# Worker mode
npm run wrk:dev

# Payment migration worker
npm run wrk-payment:dev
```

---

## 🔄 Development Workflow

### Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: Individual feature development
- **hotfix/***: Critical production fixes
- **release/***: Release preparation

### Standard Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/customer-payment-tracking
   ```

2. **Development với Testing**
   ```bash
   # Run tests continuously
   npm run test:watch
   
   # Test specific module
   ./scripts/run-tests.sh module customer
   ```

3. **Commit Changes**
   ```bash
   # Stage changes
   git add .
   
   # Commit với descriptive message
   git commit -m "feat: enhance customer payment tracking with overdue alerts"
   ```

4. **Pull Request**
   - Create PR to `develop` branch
   - Include comprehensive description
   - Ensure all tests pass
   - Request code review

---

## 📋 Change Request Process

### When CR is Required

**⚠️ CRITICAL:** All major changes must follow the Change Request process:

- New debt collection features
- Customer data schema changes
- Payment processing modifications  
- Call system integration changes
- Security/compliance updates
- Performance optimization requiring architecture changes

### CR Workflow

1. **Create Change Request**
   ```bash
   # Use CR template
   cp change-requests/templates/cr-template.md change-requests/pending/CR-YYYY-MM-DD-XXX-description.md
   ```

2. **Fill CR Details**
   - Business requirements và justification
   - Technical impact analysis
   - LCM-specific considerations
   - Implementation plan

3. **Submit for Approval**
   - Update `change-requests/cr-tracking.json`
   - Move CR to appropriate status folder
   - Wait for CEO/management approval

4. **Implementation**
   - Follow approved implementation plan
   - Update progress trong CR file
   - Test thoroughly before completion

### CR Template Location
📋 **[Change Request Templates](./change-requests/templates/)**

---

## 💻 Coding Standards

### TypeScript Guidelines

```typescript
// ✅ Good: Proper typing và validation
export class CreateCustomerData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  code = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  fullname = '';

  @IsEnum(CustomerStatus)
  status = CustomerStatus.Active;
}

// ❌ Bad: Missing validation và typing
export class CreateCustomerData {
  code: any;
  fullname: string;
  status: string;
}
```

### DTO Design Principles

**⚠️ MANDATORY:** Follow standardized DTO patterns:
📋 **[DTO Design Principles](./change-requests/templates/dto-design-principles.md)**

**Core Pattern: ID-to-Object Resolution**
```typescript
// ✅ DTOs receive IDs
export class CreateCallData {
  @IsString()
  @IsNotEmpty()
  customerCode = '';  // ID input
  
  @IsString()
  @IsNotEmpty()
  staffCode = '';     // ID input
}

// ✅ Service resolves IDs to objects
const customer = await customerService.findByCode(createData.customerCode);
const staff = await staffService.findByCode(createData.staffCode);

// ✅ Entity stores complete objects
const call = await callRepository.save({
  ...createData,
  customer: customer,  // Full object
  staff: staff        // Full object
});
```

### Module Structure

**✅ Standard Structure (All 20 modules)**
```
src/modules/<module>/
├── <module>.controller.ts    # REST API endpoints
├── <module>.service.ts       # Business logic
├── <module>.module.ts        # NestJS module
├── dto/
│   ├── create.dto.ts         # ✅ Required
│   ├── update-one.dto.ts     # ✅ Required
│   └── find-one.dto.ts       # ✅ Required
├── entity/
│   └── <module>.entity.ts    # Database schema
├── enum/
│   └── <module>.enum.ts      # Business enums
└── README.md                 # ✅ Module documentation
```

### Naming Conventions

```typescript
// Files: kebab-case
customer.service.ts
create-customer.dto.ts

// Classes: PascalCase
export class CustomerService {}
export class CreateCustomerData {}

// Variables/functions: camelCase  
const customerService = new CustomerService();
async function findCustomerByCode() {}

// Constants: SCREAMING_SNAKE_CASE
const MAX_DEBT_AMOUNT = 10000000000;
const DEFAULT_CALL_TIMEOUT = 30000;

// Database: snake_case
collection: 'customers'
field: 'partner_code'
```

---

## 🧪 Testing Guidelines

### Test Structure

```typescript
describe('CustomerService', () => {
  describe('CRUD Operations', () => {
    it('should create customer with valid data', async () => {
      const testData = MockDataGenerator.generateCustomer();
      const result = await service.create(testData);
      expect(result).toBeDefined();
    });
  });

  describe('Business Logic', () => {
    it('should validate debt collection business rules', async () => {
      const scenario = MockDataGenerator.generateDebtCollectionScenario();
      VALIDATION_HELPERS.validateDebtCollectionRules(
        scenario.customer, 
        scenario.contract
      );
    });
  });

  describe('Integration', () => {
    it('should integrate with partner systems', async () => {
      // Test partner API integration
    });
  });
});
```

### Test Data Generation

```typescript
import { MockDataGenerator, TestDatabaseHelper } from '../../test-utils';

// Generate realistic test data
const testCustomer = MockDataGenerator.generateCustomer({
  partnerCode: 'PTN_TEST_001',
  status: CustomerStatus.Active,
  overdueAmount: 1000000
});

// Generate complete business scenarios
const scenario = MockDataGenerator.generateDebtCollectionScenario();
expect(scenario.customer.partnerCode).toBe(scenario.partner.code);
```

### Testing Commands

```bash
# Run all tests
./scripts/run-tests.sh all

# Test specific module
./scripts/run-tests.sh module customer

# Test business logic
./scripts/run-tests.sh business

# Performance tests
./scripts/run-tests.sh performance

# Database tests
./scripts/run-tests.sh database
```

---

## 💼 Business Domain Guidelines

### Debt Collection Principles

**🎯 Business Context**
- **Partners**: Financial institutions sending debt lists
- **Customers**: Debtors requiring collection efforts
- **Contracts**: Detailed debt information và terms
- **Activities**: All collection interactions must be logged

### Data Validation Rules

```typescript
// Financial validation
const validateAmount = (amount: number) => {
  if (amount < 0) throw new Error('Amount cannot be negative');
  if (amount > 10000000000) throw new Error('Exceeds maximum limit (10B VND)');
};

// Customer data validation
const validateCustomer = (customer: any) => {
  if (!customer.identityNumber || customer.identityNumber.length !== 12) {
    throw new Error('Invalid identity number format');
  }
  if (!customer.mobileNumber || !/^[0-9]{10,11}$/.test(customer.mobileNumber)) {
    throw new Error('Invalid mobile number format');
  }
};
```

### Compliance Requirements

- **Data Privacy**: Customer information must be encrypted
- **Audit Trails**: All interactions must be logged
- **Call Regulations**: Respect call time restrictions (8AM-9PM)
- **Legal Compliance**: Follow debt collection laws

### Performance Targets

- **API Response**: < 300ms for debt lookup operations
- **Database Queries**: Proper indexing cho large customer datasets
- **Call Processing**: < 3 seconds call connection time
- **Report Generation**: < 30 seconds for monthly reports

---

## 🚀 Deployment Process

### Pre-deployment Checklist

- [ ] All tests passing (`npm run test`)
- [ ] E2E tests passing (`npm run test:e2e`)
- [ ] Code coverage > 80%
- [ ] Security scan completed
- [ ] Database migrations prepared
- [ ] Change Request approved (if applicable)

### Deployment Modes

```bash
# API Server deployment
npm run build
npm run start:prod

# Full microservice deployment
./deploy-prod.sh

# Individual service deployment
pm2 start ecosystem.config.js --only lcm-api
pm2 start ecosystem.config.js --only lcm-ms-file
```

### Monitoring

- **Health Checks**: Monitor service endpoints
- **Database Performance**: Query optimization
- **Message Queues**: RabbitMQ queue status
- **Business Metrics**: Debt collection KPIs

---

## 🤖 Agent Collaboration

### Agent Development Tips

- **Use MockDataGenerator**: Consistent test data generation
- **Follow DTO Patterns**: Standardized validation patterns
- **Implement Business Rules**: Debt collection compliance
- **Test Integration**: End-to-end workflow testing
- **Monitor Performance**: Optimize for high-volume operations

### Common Patterns

```typescript
// Standard service method pattern
async createCustomer(data: CreateCustomerData): Promise<Customer> {
  // 1. Validate business rules
  await this.validateCustomerRules(data);
  
  // 2. Resolve references (Partner must exist)
  const partner = await this.partnerService.findByCode(data.partnerCode);
  if (!partner) throw new Error('Partner not found');
  
  // 3. Create entity
  const customer = await this.repository.save(data);
  
  // 4. Create audit trail
  await this.activityService.logActivity({
    type: 'customer_created',
    customerCode: customer.code,
    details: 'Customer created successfully'
  });
  
  return customer;
}
```

---

## 📞 Support

### Development Support

- **Technical Issues**: Check troubleshooting guide trong module READMEs
- **Business Questions**: Consult debt collection domain documentation
- **Integration Help**: Review LCM module integration points
- **Performance Issues**: Use performance testing scripts

### Contact Information

- **Development Team**: TranGPT Development Team
- **Project Owner**: Hoàng Việt Dũng (Tony) - CEO TranGPT
- **Client**: Hoàn Kim Law Firm

---

*Contributing Guidelines for LCM Service*  
*Loans Collection Management System*  
*TranGPT Company © 2025*