# Transaction Module

**Business Purpose:** Quản lý các giao dịch thanh toán từ khách hàng và cập nhật số dư hợp đồng nợ

---

## 📋 Overview

Transaction module xử lý tất cả các giao dịch thanh toán trong debt collection workflow. Module này đảm bảo tính chính xác của tài chính và tích hợp với các hệ thống thanh toán để cập nhật số dư nợ real-time.

### Business Context
- **Payment Processing:** Thu thập và xử lý payments từ customers
- **Balance Updates:** Cập nhật current balance của contracts
- **Financial Reconciliation:** Đối soát với payment gateways
- **Reporting:** Financial reporting cho partners và management

---

## 🏗 Technical Architecture

### Module Structure
```
src/modules/transaction/
├── transaction.controller.ts    # REST API + payment webhook endpoints
├── transaction.service.ts       # Payment processing business logic
├── transaction.module.ts        # NestJS module với payment integrations
├── dto/
│   ├── create.dto.ts           # Transaction creation với amount validation
│   ├── update-one.dto.ts       # Transaction status updates
│   └── find-one.dto.ts         # Transaction details với audit trail
├── entity/
│   └── transaction.entity.ts   # MongoDB schema với financial constraints
└── enum/
    └── transaction.enum.ts     # TransactionType, PaymentMethod, Status enums
```

### Database Connection
- **Primary:** MongoDB (default connection)
- **Collection:** `transactions`
- **Financial Indexes:** `customerCode`, `contractCode`, `amount`, `transactionDate`

---

## 🛠 API Endpoints

### Core Transaction Operations
```typescript
GET    /transactions                    # List transactions với filtering
GET    /transactions/:id                # Get transaction details
POST   /transactions                    # Record new payment
PUT    /transactions/:id                # Update transaction status
DELETE /transactions/:id                # Void transaction (special permission)
```

### Payment Processing
```typescript
POST   /transactions/payment            # Process customer payment
POST   /transactions/refund             # Process refund
POST   /transactions/adjustment         # Financial adjustment
POST   /transactions/webhook/:gateway   # Payment gateway webhooks
GET    /transactions/:id/receipt        # Generate payment receipt
POST   /transactions/bulk-import        # Bulk transaction import
```

### Financial Operations
```typescript
GET    /transactions/by-customer/:code  # Customer's transaction history
GET    /transactions/by-contract/:code  # Contract payment history
GET    /transactions/pending            # Pending transactions
GET    /transactions/reconciliation     # Reconciliation report
POST   /transactions/reconcile          # Mark transactions reconciled
```

### Analytics Endpoints
```typescript
GET    /transactions/analytics/daily        # Daily payment volume
GET    /transactions/analytics/methods      # Payment method distribution
GET    /transactions/analytics/partner      # Partner payment performance
GET    /transactions/analytics/recovery     # Recovery rate analysis
```

---

## 📊 Business Logic

### Transaction Types
```typescript
enum TransactionType {
  Payment = 'payment',              // Customer debt payment
  Refund = 'refund',               // Payment reversal
  Adjustment = 'adjustment',        // Manual balance adjustment
  Fee = 'fee',                     // Service fees
  Interest = 'interest',           // Interest charges
  Penalty = 'penalty',             // Late payment penalties
  WriteOff = 'write-off'           // Debt written off
}
```

### Payment Processing Workflow
```typescript
const paymentWorkflow = {
  // 1. Payment Initiation
  initiation: {
    source: 'Customer, Staff, or Payment Gateway',
    validation: 'Amount, customer, contract validation',
    duplication: 'Check for duplicate payments'
  },
  
  // 2. Payment Processing
  processing: {
    gateway: 'Route to appropriate payment gateway',
    verification: 'Verify payment with bank/gateway',
    authorization: 'Get payment authorization',
    capture: 'Capture payment funds'
  },
  
  // 3. Balance Update
  balanceUpdate: {
    contract: 'Update contract current balance',
    overdue: 'Reduce overdue amount if applicable',
    interest: 'Apply payment to interest first',
    principal: 'Apply remaining to principal balance'
  },
  
  // 4. Notification & Activity
  completion: {
    receipt: 'Generate payment receipt',
    notification: 'Notify customer và staff',
    activity: 'Create activity record',
    reconciliation: 'Mark for financial reconciliation'
  }
};
```

### Payment Application Rules
```typescript
// Standard payment application priority
const paymentApplication = {
  priority: [
    'fees',           // Service fees first
    'penalties',      // Late payment penalties  
    'interest',       // Accrued interest
    'principal'       // Remaining principal balance
  ],
  
  // Business rules
  rules: {
    minimumAmount: 1000,          // Minimum 1,000 VND payment
    maximumAmount: 1000000000,    // Maximum 1B VND per transaction
    partialPayments: true,        // Allow partial payments
    overpayments: 'credit',       // Handle overpayments as credit
    currency: 'VND'               // Vietnamese Dong only
  }
};
```

---

## 🔄 Integration Points

### Core Relationships
```typescript
// Required relationships
Customer ←→ Transaction  // 1:N - Customer makes payments
Contract ←→ Transaction  // 1:N - Contract receives payments
Staff    ←→ Transaction  // 1:N - Staff processes payments
Partner  ←→ Transaction  // 1:N - Partner receives collections

// Generated relationships
Transaction → Activity   // 1:1 - Each transaction creates activity
Transaction → Receipt    // 1:1 - Payment receipt generation
```

### Payment Gateway Integration
```typescript
interface PaymentGatewayIntegration {
  // Supported payment methods
  methods: {
    'bank-transfer': 'Internet banking transfer',
    'atm-card': 'ATM card payment',
    'credit-card': 'Credit card payment',
    'e-wallet': 'Mobile wallet payment',
    'cash': 'Cash payment at office',
    'cheque': 'Bank cheque payment'
  },
  
  // Webhook handling
  webhooks: {
    success: 'Payment successful',
    failed: 'Payment failed',
    pending: 'Payment pending verification',
    cancelled: 'Payment cancelled by user'
  },
  
  // Reconciliation data
  reconciliation: {
    batchId: string,
    settlementDate: Date,
    fees: number,
    netAmount: number
  }
}
```

### Financial System Integration
- **Accounting System:** Post transactions to general ledger
- **Bank Reconciliation:** Match với bank statements
- **Tax System:** Generate tax reports for payments
- **Compliance Reporting:** Financial authority reports

---

## 🧪 Testing

### Transaction Testing Scenarios
```typescript
import { MockDataGenerator, VALIDATION_HELPERS } from '../../test-utils';

// Test payment processing scenario
const paymentScenario = MockDataGenerator.generateDebtCollectionScenario();
const testTransaction = MockDataGenerator.generateTransaction({
  customerCode: paymentScenario.customer.code,
  contractCode: paymentScenario.contract.code,
  partnerCode: paymentScenario.partner.code,
  staffCode: paymentScenario.staff.code,
  amount: 1000000,                    // 1M VND payment
  transactionType: TransactionType.Payment,
  paymentMethod: PaymentMethod.BankTransfer,
  status: TransactionStatus.Completed
});

// Validate transaction business rules
VALIDATION_HELPERS.validateTransactionData(
  testTransaction,
  paymentScenario.customer,
  paymentScenario.contract
);
```

### Financial Integrity Testing
```typescript
// Test balance calculation accuracy
const contract = MockDataGenerator.generateContract({
  originalAmount: 10000000,    // 10M VND
  currentBalance: 8000000      // 8M VND remaining
});

const payment = MockDataGenerator.generateTransaction({
  contractCode: contract.code,
  amount: 2000000,             // 2M VND payment
  transactionType: TransactionType.Payment
});

// After payment processing
await transactionService.processPayment(payment);
const updatedContract = await contractService.findById(contract.id);
expect(updatedContract.currentBalance).toBe(6000000); // 8M - 2M = 6M
```

---

## 📈 Performance Considerations

### Database Optimization
```typescript
// Transaction performance indexes
db.transactions.createIndex({ 
  "customerCode": 1, 
  "transactionDate": -1 
})  // Customer payment history

db.transactions.createIndex({ 
  "contractCode": 1, 
  "status": 1,
  "transactionDate": -1 
})  // Contract payment tracking

db.transactions.createIndex({ 
  "partnerCode": 1, 
  "transactionType": 1,
  "transactionDate": -1 
})  // Partner collection analysis

db.transactions.createIndex({ 
  "status": 1, 
  "amount": -1,
  "transactionDate": -1 
})  // High-value transaction monitoring
```

### Payment Processing Performance
- **Transaction Speed:** < 2 seconds for payment processing
- **Bulk Processing:** Handle 10,000+ transactions per batch
- **Reconciliation:** Daily automated reconciliation
- **Webhook Response:** < 500ms for payment gateway webhooks

### Financial Calculation Performance
- **Balance Updates:** Real-time balance calculation
- **Interest Application:** Accurate interest calculation
- **Currency Handling:** Proper decimal precision for VND
- **Report Generation:** Optimized financial report queries

---

## 🔒 Security & Compliance

### Financial Data Security
```typescript
// High-security transaction fields
const sensitiveTransactionData = [
  'amount',              // Payment amount - audit all changes
  'accountNumber',       // Bank account - encrypt at rest
  'paymentDetails',      // Payment references - secure storage
  'gatewayResponse',     // Gateway data - log securely
  'refundDetails'        // Refund information - audit trail
];

// Financial audit requirements
const auditEvents = [
  'transaction_created',    // New transaction
  'payment_processed',      // Payment completion
  'refund_issued',         // Refund processing
  'adjustment_made',       // Manual adjustments
  'status_changed',        // Status updates
  'amount_modified'        // Amount changes (special permission)
];
```

### Payment Security
- **PCI Compliance:** Credit card data handling
- **Encryption:** All financial data encrypted
- **Access Controls:** Role-based transaction access
- **Fraud Detection:** Suspicious transaction monitoring

### Regulatory Compliance
- **Anti-Money Laundering (AML):** Large transaction reporting
- **Financial Reporting:** Regulatory authority compliance
- **Tax Compliance:** VAT và withholding tax handling
- **Data Retention:** Financial record keeping requirements

---

## 🐛 Common Issues & Troubleshooting

### Payment Processing Issues
```javascript
// Find failed transactions
db.transactions.find({
  "status": "failed",
  "transactionDate": { $gte: new Date(Date.now() - 24*60*60*1000) }
})

// Check for duplicate payments
db.transactions.aggregate([
  { $group: {
    _id: { customerCode: "$customerCode", amount: "$amount", date: "$transactionDate" },
    count: { $sum: 1 },
    transactions: { $push: "$_id" }
  }},
  { $match: { count: { $gt: 1 } } }
])

// Verify balance consistency
db.contracts.find({
  $expr: {
    $lt: ["$currentBalance", 0]
  }
})  // Negative balances (should not exist)
```

### Reconciliation Issues
- **Missing Transactions:** Compare với gateway reports
- **Amount Mismatches:** Verify currency conversion
- **Status Discrepancies:** Check webhook processing
- **Timing Issues:** Verify transaction timestamps

### Performance Issues
- **Slow Payment Processing:** Check gateway response times
- **Large Transaction Queries:** Implement pagination
- **Balance Calculation Delays:** Optimize update queries
- **Report Generation Timeout:** Use aggregation pipelines

---

## 📝 Development Notes

### Payment Processing Logic
```typescript
// Standard payment processing flow
const processPayment = async (transactionData: CreateTransactionData) => {
  // 1. Validation
  await validatePaymentData(transactionData);
  
  // 2. Create transaction record
  const transaction = await transactionRepository.save({
    ...transactionData,
    status: TransactionStatus.Pending
  });
  
  // 3. Process through payment gateway
  const gatewayResult = await paymentGateway.processPayment(transaction);
  
  // 4. Update transaction status
  transaction.status = gatewayResult.success ? 
    TransactionStatus.Completed : TransactionStatus.Failed;
  transaction.gatewayReference = gatewayResult.reference;
  await transactionRepository.save(transaction);
  
  // 5. Update contract balance if successful
  if (transaction.status === TransactionStatus.Completed) {
    await updateContractBalance(transaction);
  }
  
  return transaction;
};
```

### Recent Updates
- ✅ **2025-01-17:** Enhanced transaction DTO validation
- ✅ **2025-01-17:** Improved payment gateway integration
- ✅ **2025-01-17:** Added comprehensive financial test scenarios
- ✅ **2025-01-17:** Enhanced security for financial data

### Future Enhancements
- [ ] **Real-time Payment Tracking:** Live payment status updates
- [ ] **Multi-currency Support:** International payment processing
- [ ] **Payment Analytics:** ML-based payment prediction
- [ ] **Automated Reconciliation:** AI-powered reconciliation

### Agent Development Tips
- Always validate payment amounts với proper decimal precision
- Implement comprehensive audit trails for all financial operations
- Use proper error handling for payment gateway failures
- Monitor transaction processing performance continuously
- Follow PCI compliance guidelines for sensitive data

---

*Transaction Module Documentation - LCM Service*  
*Critical financial component of debt collection payment processing*  
*Last Updated: 2025-01-17*