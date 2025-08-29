# Database Schema Documentation - LCM Service

## 📊 OVERVIEW

LCM (Loans Collection Management) Service sử dụng dual database architecture:
- **Primary Database:** MongoDB (Operational data)
- **Legacy Database:** Microsoft SQL Server (Legacy integration)

---

## 🏗️ DATABASE ARCHITECTURE

### Primary Storage (MongoDB)
```
Database: lcm-production
Collections: 20 business entities
Connection: Via Mongoose ODM
```

### Legacy Integration (MSSQL)
```
Database: LegacyLCM
Tables: Partner legacy data
Connection: Via TypeORM
```

---

## 📋 CORE ENTITIES

### 1. Partner (Financial Institutions)
```typescript
// MongoDB Collection: partners
{
  _id: ObjectId,
  code: String,           // Unique partner code
  name: String,           // Partner name
  type: PartnerType,      // BANK, CREDIT_COMPANY, LEASING
  status: PartnerStatus,  // ACTIVE, INACTIVE, SUSPENDED
  contactInfo: {
    phone: String,
    email: String,
    address: String
  },
  businessInfo: {
    taxCode: String,
    license: String,
    establishedDate: Date
  },
  contractTerms: {
    commissionRate: Number,
    paymentTerms: String,
    slaRequirements: Object
  },
  metadata: {
    createdAt: Date,
    updatedAt: Date,
    createdBy: ObjectId,
    isDeleted: Boolean
  }
}
```

### 2. Customer (Debtors)
```typescript
// MongoDB Collection: customers
{
  _id: ObjectId,
  partnerId: ObjectId,      // Reference to Partner
  customerCode: String,     // Partner's customer code
  personalInfo: {
    fullName: String,
    identityNumber: String,  // CCCD/CMND
    dateOfBirth: Date,
    gender: Gender,         // MALE, FEMALE, OTHER
    nationality: String
  },
  contactInfo: {
    phone: String,
    alternativePhone: String,
    email: String,
    address: {
      street: String,
      district: String,
      city: String,
      zipCode: String
    }
  },
  financialInfo: {
    income: Number,
    occupation: String,
    workPlace: String
  },
  riskLevel: RiskLevel,     // LOW, MEDIUM, HIGH, CRITICAL
  blacklistStatus: Boolean,
  consentStatus: {
    dataProcessing: Boolean,
    marketing: Boolean,
    thirdPartySharing: Boolean
  },
  metadata: {
    createdAt: Date,
    updatedAt: Date,
    lastContactAt: Date,
    isDeleted: Boolean
  }
}
```

### 3. Contract (Debt Contracts)
```typescript
// MongoDB Collection: contracts
{
  _id: ObjectId,
  partnerId: ObjectId,      // Reference to Partner
  customerId: ObjectId,     // Reference to Customer
  contractCode: String,     // Unique contract identifier
  contractDetails: {
    type: ContractType,     // LOAN, CREDIT_CARD, LEASING
    originalAmount: Number,
    currentBalance: Number,
    interestRate: Number,
    currency: String,       // VND, USD
    startDate: Date,
    maturityDate: Date,
    gracePeriod: Number     // Days
  },
  debtInfo: {
    totalDebt: Number,
    principalAmount: Number,
    interestAmount: Number,
    penaltyAmount: Number,
    daysOverdue: Number,
    lastPaymentDate: Date
  },
  collectionInfo: {
    assignedStaffId: ObjectId,
    assignedTeamId: ObjectId,
    priority: Priority,      // LOW, MEDIUM, HIGH, URGENT
    stage: CollectionStage,  // EARLY, MIDDLE, LATE, LEGAL
    status: ContractStatus   // ACTIVE, SETTLED, WRITTEN_OFF
  },
  legalStatus: {
    isLegalAction: Boolean,
    lawyerAssigned: String,
    courtCase: String,
    legalNotes: String
  },
  metadata: {
    createdAt: Date,
    updatedAt: Date,
    importedAt: Date,
    lastModifiedBy: ObjectId
  }
}
```

### 4. Call (Call Management)
```typescript
// MongoDB Collection: calls
{
  _id: ObjectId,
  contractId: ObjectId,     // Reference to Contract
  customerId: ObjectId,     // Reference to Customer
  staffId: ObjectId,        // Reference to Staff
  callInfo: {
    type: CallType,         // MANUAL, AUTO_CALL, AUTO_DIALER
    direction: CallDirection, // OUTBOUND, INBOUND
    phoneNumber: String,
    startTime: Date,
    endTime: Date,
    duration: Number,       // Seconds
    recordingUrl: String
  },
  callResult: {
    status: CallStatus,     // CONNECTED, NO_ANSWER, BUSY, FAILED
    contactResult: ContactResult, // CONTACTED, PROMISE_TO_PAY, REFUSED
    nextAction: NextAction, // RECALL, VISIT, LEGAL_ACTION
    nextContactDate: Date,
    notes: String,
    paymentPromise: {
      amount: Number,
      promiseDate: Date,
      confirmed: Boolean
    }
  },
  systemInfo: {
    dialerSystem: String,   // AUTO_DIALER, CLICK_TO_CALL
    campaignId: String,
    queueId: String,
    attemptNumber: Number
  },
  metadata: {
    createdAt: Date,
    createdBy: ObjectId
  }
}
```

### 5. Activity (Activity Tracking)
```typescript
// MongoDB Collection: activities
{
  _id: ObjectId,
  contractId: ObjectId,     // Reference to Contract
  customerId: ObjectId,     // Reference to Customer
  staffId: ObjectId,        // Reference to Staff
  activityInfo: {
    type: ActivityType,     // CALL, SMS, EMAIL, VISIT, LETTER
    category: ActivityCategory, // REMINDER, NEGOTIATION, THREAT
    description: String,
    outcome: ActivityOutcome, // SUCCESSFUL, FAILED, PARTIAL
    followUpRequired: Boolean,
    followUpDate: Date
  },
  customerResponse: {
    attitude: CustomerAttitude, // COOPERATIVE, HOSTILE, EVASIVE
    paymentCapability: PaymentCapability, // ABLE, UNABLE, PARTIAL
    contactPreference: ContactPreference, // PHONE, EMAIL, SMS
    bestContactTime: String
  },
  documentation: {
    attachments: [String],  // File URLs
    screenshots: [String],
    voiceRecording: String,
    notes: String
  },
  metadata: {
    createdAt: Date,
    location: String,       // For field visits
    duration: Number        // Minutes spent
  }
}
```

### 6. Transaction (Payment Transactions)
```typescript
// MongoDB Collection: transactions
{
  _id: ObjectId,
  contractId: ObjectId,     // Reference to Contract
  customerId: ObjectId,     // Reference to Customer
  partnerId: ObjectId,      // Reference to Partner
  transactionInfo: {
    type: TransactionType,  // PAYMENT, REFUND, ADJUSTMENT
    amount: Number,
    currency: String,
    method: PaymentMethod,  // CASH, BANK_TRANSFER, CARD, E_WALLET
    reference: String,      // Bank reference number
    description: String
  },
  allocation: {
    principalAmount: Number,
    interestAmount: Number,
    penaltyAmount: Number,
    feeAmount: Number
  },
  status: {
    current: TransactionStatus, // PENDING, COMPLETED, FAILED, CANCELLED
    verification: VerificationStatus, // VERIFIED, UNVERIFIED, DISPUTED
    reconciliation: ReconciliationStatus // MATCHED, UNMATCHED, MANUAL
  },
  bankingInfo: {
    bankCode: String,
    accountNumber: String,
    accountName: String,
    transactionTime: Date,
    clearingDate: Date
  },
  verification: {
    verifiedBy: ObjectId,
    verifiedAt: Date,
    verificationNotes: String,
    proofDocuments: [String]
  },
  metadata: {
    createdAt: Date,
    processedAt: Date,
    importSource: String,   // MANUAL, BANK_FILE, API
    batchId: String
  }
}
```

### 7. Staff (Collection Staff)
```typescript
// MongoDB Collection: staff
{
  _id: ObjectId,
  employeeCode: String,     // Unique employee ID
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    position: StaffPosition, // COLLECTOR, SUPERVISOR, MANAGER
    department: String
  },
  workInfo: {
    teamId: ObjectId,       // Reference to Team
    hireDate: Date,
    status: StaffStatus,    // ACTIVE, INACTIVE, ON_LEAVE
    workingHours: {
      startTime: String,
      endTime: String,
      timezone: String
    }
  },
  performance: {
    currentCaseload: Number,
    maxCaseload: Number,
    totalCalls: Number,
    successfulContacts: Number,
    collectionsThisMonth: Number,
    targetAmount: Number
  },
  permissions: {
    canMakeCall: Boolean,
    canViewCustomerData: Boolean,
    canProcessPayment: Boolean,
    canAccessReports: Boolean,
    specialPermissions: [String]
  },
  metadata: {
    createdAt: Date,
    updatedAt: Date,
    lastLoginAt: Date
  }
}
```

### 8. Team (Collection Teams)
```typescript
// MongoDB Collection: teams
{
  _id: ObjectId,
  teamCode: String,         // Unique team identifier
  teamInfo: {
    name: String,
    description: String,
    type: TeamType,         // EARLY_COLLECTION, LATE_COLLECTION, LEGAL
    managerId: ObjectId,    // Reference to Staff (Manager)
    status: TeamStatus      // ACTIVE, INACTIVE, DISBANDED
  },
  assignment: {
    partnerIds: [ObjectId], // Assigned partners
    riskLevels: [RiskLevel], // Handled risk levels
    contractTypes: [ContractType],
    regions: [String],      // Geographic coverage
    languages: [String]     // Supported languages
  },
  performance: {
    totalStaff: Number,
    totalCases: Number,
    monthlyTarget: Number,
    monthlyAchieved: Number,
    averageResolutionTime: Number,
    successRate: Number
  },
  schedule: {
    workingHours: {
      monday: { start: String, end: String },
      tuesday: { start: String, end: String },
      wednesday: { start: String, end: String },
      thursday: { start: String, end: String },
      friday: { start: String, end: String },
      saturday: { start: String, end: String },
      sunday: { start: String, end: String }
    },
    timezone: String
  },
  metadata: {
    createdAt: Date,
    updatedAt: Date,
    lastRestructuredAt: Date
  }
}
```

---

## 🔗 RELATIONSHIPS

### Entity Relationships
```
Partner (1) ──── (n) Customer
Partner (1) ──── (n) Contract
Customer (1) ──── (n) Contract
Contract (1) ──── (n) Call
Contract (1) ──── (n) Activity
Contract (1) ──── (n) Transaction
Staff (1) ──── (n) Call
Staff (1) ──── (n) Activity
Team (1) ──── (n) Staff
Team (n) ──── (n) Contract (assignments)
```

### Reference Integrity Rules
- All foreign key references must exist
- Soft delete: Set isDeleted flag instead of hard delete
- Cascade rules: Maintain data integrity on related operations
- Audit trail: Track all changes to sensitive entities

---

## 📊 INDEXES

### Performance Indexes
```javascript
// Partners
db.partners.createIndex({ "code": 1 }, { unique: true })
db.partners.createIndex({ "status": 1, "isDeleted": 1 })

// Customers
db.customers.createIndex({ "partnerId": 1, "customerCode": 1 }, { unique: true })
db.customers.createIndex({ "personalInfo.identityNumber": 1 }, { sparse: true })
db.customers.createIndex({ "contactInfo.phone": 1 })

// Contracts
db.contracts.createIndex({ "partnerId": 1, "contractCode": 1 }, { unique: true })
db.contracts.createIndex({ "customerId": 1 })
db.contracts.createIndex({ "collectionInfo.assignedStaffId": 1 })
db.contracts.createIndex({ "collectionInfo.status": 1, "collectionInfo.priority": 1 })
db.contracts.createIndex({ "debtInfo.daysOverdue": 1 })

// Calls
db.calls.createIndex({ "contractId": 1, "callInfo.startTime": -1 })
db.calls.createIndex({ "customerId": 1, "callInfo.startTime": -1 })
db.calls.createIndex({ "staffId": 1, "callInfo.startTime": -1 })
db.calls.createIndex({ "callResult.nextContactDate": 1 })

// Activities
db.activities.createIndex({ "contractId": 1, "createdAt": -1 })
db.activities.createIndex({ "staffId": 1, "createdAt": -1 })
db.activities.createIndex({ "activityInfo.followUpRequired": 1, "activityInfo.followUpDate": 1 })

// Transactions
db.transactions.createIndex({ "contractId": 1, "createdAt": -1 })
db.transactions.createIndex({ "transactionInfo.reference": 1 })
db.transactions.createIndex({ "status.current": 1, "createdAt": -1 })
db.transactions.createIndex({ "bankingInfo.transactionTime": -1 })
```

---

## 🛡️ SECURITY CONSIDERATIONS

### Data Protection
- **Customer PII:** Encrypted at field level
- **Financial Data:** Encrypted and access-controlled
- **Phone Numbers:** Masked in logs and non-privileged views
- **Identity Numbers:** Hashed with salt for search, encrypted for storage

### Access Control
- **Role-based permissions:** Staff, Supervisor, Manager, Admin
- **Data segregation:** Partner-based data isolation
- **Audit logging:** All data access and modifications tracked
- **Session management:** JWT with appropriate expiration

### Compliance
- **GDPR Compliance:** Data minimization, consent tracking, right to erasure
- **Local Regulations:** Vietnam personal data protection compliance
- **Financial Regulations:** Banking secrecy and debt collection law compliance

---

## 🔄 DATA MIGRATION

### Legacy Integration Points
- **Partner Data:** MSSQL → MongoDB synchronization
- **Customer Import:** Excel/CSV bulk import utilities
- **Transaction Reconciliation:** Bank file processing
- **Historical Data:** Archive strategy for old contracts

### Migration Tools
- **Data Handlers:** Automated import/export utilities
- **Validation Rules:** Business logic validation during migration
- **Error Handling:** Failed record processing and retry mechanisms
- **Progress Tracking:** Real-time migration status monitoring

---

## 📋 MAINTENANCE TASKS

### Regular Maintenance
- **Index Optimization:** Monthly index usage analysis
- **Data Cleanup:** Quarterly soft-deleted record archival
- **Performance Monitoring:** Daily query performance review
- **Backup Verification:** Weekly backup integrity checks

### Business Rules Enforcement
- **Data Validation:** Real-time business rule validation
- **Constraint Checking:** Foreign key integrity maintenance
- **Duplicate Prevention:** Unique constraint enforcement
- **Audit Trail:** Complete change history maintenance

---

*Database Schema Documentation for LCM Service*  
*Designed for Loans Collection Management Operations*  
*TranGPT LCM Service Development Team*