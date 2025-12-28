# Contract Module

**Business Purpose:** Quản lý chi tiết hợp đồng nợ và thông tin tài chính của từng khoản vay cần thu hồi

---

## 📋 Overview

Contract module quản lý thông tin chi tiết về các khoản nợ, bao gồm số tiền gốc, số dư hiện tại, số tiền quá hạn, lãi suất và các điều khoản tài chính. Đây là module quan trọng để xác định chiến lược thu hồi nợ.

### Business Context
- **Financial Details:** Thông tin chi tiết về khoản vay/nợ
- **Overdue Tracking:** Theo dõi số tiền và thời gian quá hạn
- **Payment History:** Lịch sử thanh toán và số dư
- **Interest Calculation:** Tính toán lãi suất và phí phạt

---

## 🏗 Technical Architecture

### Module Structure
```
src/modules/contract/
├── contract.controller.ts    # REST API endpoints
├── contract.service.ts       # Business logic & calculations
├── contract.module.ts        # NestJS module configuration
├── dto/
│   ├── create.dto.ts         # Contract creation với financial validation
│   ├── update-one.dto.ts     # Contract updates với amount validations
│   └── find-one.dto.ts       # Contract details với calculated fields
├── entity/
│   └── contract.entity.ts    # MongoDB schema với financial constraints
└── enum/
    └── contract.enum.ts      # ContractStatus, ProductType enums
```

### Database Connection
- **Primary:** MongoDB (default connection)
- **Collection:** `contracts`
- **Financial Indexes:** `customerCode`, `partnerCode`, `overdueAmount`, `status`

---

## 🛠 API Endpoints

### Core CRUD Operations
```typescript
GET    /contracts                     # List contracts với financial filtering
GET    /contracts/:id                 # Get contract với full financial details
POST   /contracts                     # Create new debt contract
PUT    /contracts/:id                 # Update contract information
DELETE /contracts/:id                 # Archive contract
```

### Financial Operations
```typescript
GET    /contracts/by-customer/:code         # Get customer's all contracts
GET    /contracts/overdue                   # List overdue contracts
GET    /contracts/high-amount              # High-value debt contracts
PUT    /contracts/:id/balance              # Update current balance
PUT    /contracts/:id/payment              # Record payment
POST   /contracts/:id/calculate-interest   # Calculate interest and penalties
GET    /contracts/:id/payment-schedule     # Get payment schedule
POST   /contracts/bulk-balance-update      # Bulk balance updates
```

### Analytics Endpoints
```typescript
GET    /contracts/analytics/overdue        # Overdue analytics by partner
GET    /contracts/analytics/performance    # Collection performance metrics
GET    /contracts/analytics/amounts        # Amount distribution analytics
```

---

## 📊 Business Logic

### Contract Lifecycle
1. **Origination:** Contract created when loan is disbursed
2. **Active Payments:** Customer makes regular payments
3. **Overdue:** Payment missed, enters collection workflow
4. **Collection:** Active debt recovery efforts
5. **Resolution:** Debt paid off or written off

### Financial Calculations
```typescript
// Key financial metrics
interface ContractFinancials {
  originalAmount: number;        // Original loan amount
  currentBalance: number;        // Remaining debt
  overdueAmount: number;         // Amount past due
  interestAccrued: number;       // Accumulated interest
  penaltyAmount: number;         // Late payment penalties
  totalAmountDue: number;        // Total owed including fees
  
  // Time-based calculations
  daysSinceOrigination: number;
  overdueDays: number;
  nextPaymentDue: Date;
  
  // Performance metrics
  paymentHistoryScore: number;
  collectionProbability: number;
}
```

### Business Rules
```typescript
// Contract validation rules
const businessRules = {
  amounts: {
    originalAmount: { min: 1000, max: 10000000000 },    // 1K to 10B VND
    currentBalance: { min: 0, max: 'originalAmount' },
    overdueAmount: { min: 0, max: 'currentBalance' },
    interestRate: { min: 0, max: 50 },                  // 0-50% annual
    penaltyRate: { min: 0, max: 100 }                   // 0-100% annual
  },
  
  dates: {
    startDate: 'must be <= today',
    endDate: 'must be > startDate',
    lastPaymentDate: 'must be >= startDate'
  },
  
  status: {
    validTransitions: {
      'Active': ['Overdue', 'Paid', 'Closed'],
      'Overdue': ['Active', 'Collection', 'Legal'],
      'Collection': ['Active', 'Legal', 'Written-off'],
      'Legal': ['Collection', 'Written-off', 'Settled'],
      'Written-off': ['Closed'],
      'Settled': ['Closed'],
      'Paid': ['Closed']
    }
  }
};
```

---

## 🔄 Integration Points

### Core Relationships
```typescript
// Required relationships
Customer ←→ Contract    // 1:N - Customer có nhiều contracts
Partner  ←→ Contract    // 1:N - Partner có nhiều contracts

// Dependent relationships  
Contract → Transaction  // 1:N - Contract có nhiều payments
Contract → Activity     // 1:N - Collection activities
Contract → Call        // 1:N - Collection calls
```

### Financial System Integration
- **Payment Gateway:** Process payments và update balances
- **Interest Calculator:** Daily interest accrual
- **Penalty Engine:** Late payment fee calculations
- **Accounting System:** Financial reporting integration

### External Services
- **Credit Bureau:** Credit score updates
- **Legal System:** Legal action tracking
- **Regulatory Reporting:** Financial authority reports

---

## 🧪 Testing

### Financial Test Scenarios
```typescript
import { MockDataGenerator, VALIDATION_HELPERS } from '../../test-utils';

// Test overdue contract scenario
const overdueContract = MockDataGenerator.generateContract({
  originalAmount: 10000000,      // 10M VND
  currentBalance: 8500000,       // 8.5M VND remaining
  overdueAmount: 1500000,        // 1.5M VND overdue
  overdueDays: 30,              // 30 days past due
  interestRate: 18.0,           // 18% annual
  penaltyRate: 24.0,            // 24% annual penalty
  status: ContractStatus.Overdue
});

// Validate financial business rules
VALIDATION_HELPERS.validateDebtCollectionRules(
  testCustomer, 
  overdueContract
);
```

### Performance Testing
```typescript
// Test bulk financial calculations
const contracts = MockDataGenerator.generateBulkData('contract', 1000, {
  overdueAmount: { $gt: 0 },
  status: ContractStatus.Overdue
});

// Test interest calculation performance
const startTime = Date.now();
const results = await contractService.calculateBulkInterest(contracts);
const duration = Date.now() - startTime;
expect(duration).toBeLessThan(5000); // < 5 seconds for 1000 contracts
```

---

## 📈 Performance Considerations

### Database Optimization
```typescript
// Financial query indexes
db.contracts.createIndex({ 
  "partnerCode": 1, 
  "status": 1, 
  "overdueAmount": -1 
})  // Overdue contracts by partner

db.contracts.createIndex({ 
  "customerCode": 1, 
  "status": 1 
})  // Customer debt portfolio

db.contracts.createIndex({ 
  "overdueDate": 1, 
  "overdueAmount": -1 
})  // Overdue analysis

db.contracts.createIndex({ 
  "endDate": 1, 
  "status": 1 
})  // Contract expiration tracking
```

### Financial Calculation Optimization
- **Batch Processing:** Calculate interest in batches
- **Caching:** Cache calculated values for reporting
- **Approximation:** Use approximation for large datasets
- **Async Processing:** Background financial updates

---

## 🔒 Security & Compliance

### Financial Data Security
```typescript
// High-security financial fields
const sensitiveFinancialData = [
  'originalAmount',      // Loan amount - encrypt at rest
  'currentBalance',      // Current debt - audit all changes  
  'overdueAmount',       // Overdue debt - restricted access
  'interestRate',        // Rate information - contractual data
  'penaltyRate',         // Penalty rate - legal implications
  'accountNumber',       // Account details - PCI compliance
  'contractTerms'        // Contract details - legal document
];

// Audit requirements
const auditEvents = [
  'balance_update',      // All balance changes
  'payment_recorded',    // Payment processing
  'interest_calculated', // Interest calculations
  'penalty_applied',     // Penalty assessments
  'status_changed'       // Status transitions
];
```

### Regulatory Compliance
- **Banking Regulations:** Loan processing compliance
- **Consumer Protection:** Fair debt collection practices
- **Financial Reporting:** Regulatory report requirements
- **Data Retention:** Financial record keeping requirements

---

## 🐛 Common Issues & Troubleshooting

### Financial Calculation Issues
```javascript
// Debug interest calculation errors
db.contracts.find({
  $expr: {
    $gt: ["$overdueAmount", "$currentBalance"]
  }
})  // Overdue amount > current balance (invalid)

// Find contracts với negative balances
db.contracts.find({
  "currentBalance": { $lt: 0 }
})

// Verify payment calculations
db.contracts.find({
  $expr: {
    $gt: ["$totalPaid", "$originalAmount"]
  }
})  // Paid more than original (check for errors)
```

### Performance Issues
- **Slow Financial Queries:** Check compound indexes
- **Bulk Calculation Timeout:** Implement batch processing
- **Memory Usage:** Monitor large financial aggregations
- **Interest Accrual:** Optimize daily calculation jobs

### Data Integrity Issues
- **Balance Mismatches:** Reconcile với transaction history
- **Date Inconsistencies:** Validate date ranges
- **Status Conflicts:** Check status transition rules
- **Relationship Integrity:** Verify customer/partner links

---

## 📝 Development Notes

### Financial Business Logic
```typescript
// Interest calculation formula
const calculateDailyInterest = (balance, annualRate, days) => {
  return (balance * (annualRate / 100) * days) / 365;
};

// Penalty calculation
const calculatePenalty = (overdueAmount, penaltyRate, overdueDays) => {
  return (overdueAmount * (penaltyRate / 100) * overdueDays) / 365;
};

// Total amount due calculation
const calculateTotalDue = (contract) => {
  return contract.currentBalance + 
         contract.interestAccrued + 
         contract.penaltyAmount +
         contract.additionalFees;
};
```

### Recent Updates
- ✅ **2025-01-17:** Enhanced DTO validation for financial fields
- ✅ **2025-01-17:** Added comprehensive financial test scenarios
- ✅ **2025-01-17:** Improved performance indexes
- ✅ **2025-01-17:** Enhanced security for financial data

### Future Enhancements
- [ ] **Real-time Interest Calculation:** Live interest accrual
- [ ] **Payment Scheduling:** Automated payment plans
- [ ] **Risk Assessment:** ML-based collection probability
- [ ] **Regulatory Reporting:** Automated compliance reports

### Agent Development Tips
- Always validate financial calculations với test scenarios
- Use proper decimal arithmetic for money calculations
- Implement comprehensive audit trails for all changes
- Monitor performance for bulk financial operations
- Follow regulatory compliance guidelines

---

*Contract Module Documentation - LCM Service*  
*Critical financial component of debt collection*  
*Last Updated: 2025-01-17*