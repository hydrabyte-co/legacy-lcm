# Customer Module

**Business Purpose:** Quản lý thông tin khách hàng nợ cần thu hồi từ các đối tác tài chính

---

## 📋 Overview

Customer module là trung tâm của debt collection workflow, quản lý toàn bộ thông tin khách hàng mắc nợ. Module này kết nối trực tiếp với call system, contract management và payment processing.

### Business Context
- **Primary Data:** Thông tin cá nhân khách hàng nợ
- **Source:** Import từ partner systems (banks, financial institutions)
- **Usage:** Call center agents liên hệ để thu hồi nợ
- **Privacy:** High-security data với strict access controls

---

## 🏗 Technical Architecture

### Module Structure
```
src/modules/customer/
├── customer.controller.ts    # REST API endpoints
├── customer.service.ts       # Business logic & DB operations
├── customer.module.ts        # NestJS module configuration
├── dto/
│   ├── create.dto.ts         # Customer creation với full validation
│   ├── update-one.dto.ts     # Customer update với selective fields
│   └── find-one.dto.ts       # Customer response với calculated fields
├── entity/
│   └── customer.entity.ts    # MongoDB schema với indexes
└── enum/
    └── customer.enum.ts      # CustomerStatus, Gender, Priority enums
```

### Database Connection
- **Primary:** MongoDB (default connection)
- **Collection:** `customers`
- **Critical Indexes:** `code`, `partnerCode`, `identityNumber`, `mobileNumber`

---

## 🛠 API Endpoints

### Core CRUD Operations
```typescript
GET    /customers                    # List customers với advanced filtering
GET    /customers/:id               # Get customer với full details
POST   /customers                   # Create new customer
PUT    /customers/:id               # Update customer information
DELETE /customers/:id               # Soft delete customer
```

### Business Operations
```typescript
GET    /customers/by-code/:code           # Find customer by unique code
GET    /customers/by-identity/:number     # Find by identity number
GET    /customers/by-phone/:phone         # Find by mobile number
GET    /customers/:id/contracts           # Get customer's debt contracts
GET    /customers/:id/calls               # Get call history
GET    /customers/:id/activities          # Get collection activities
GET    /customers/:id/transactions        # Get payment history
GET    /customers/:id/performance         # Get collection performance
POST   /customers/:id/assign-staff        # Assign staff to customer
POST   /customers/bulk-import             # Bulk customer import
```

### Advanced Search
```typescript
POST   /customers/search                  # Advanced search với filters
GET    /customers/overdue                 # Customers với overdue debts
GET    /customers/high-priority           # High priority customers
GET    /customers/recent-activity         # Recent collection activities
```

---

## 📊 Business Logic

### Customer Lifecycle
1. **Import:** Customer data imported from partner systems
2. **Assignment:** Assigned to call staff và field staff
3. **Collection:** Regular contact for debt recovery
4. **Payment:** Process payments và update balances
5. **Closure:** Close account when debt fully recovered

### Key Business Rules
- **Unique Identity:** `identityNumber` must be unique per partner
- **Contact Requirements:** Must have at least mobile number
- **Staff Assignment:** Both call staff và field staff can be assigned
- **Priority Management:** High priority = more frequent contact
- **Status Transitions:** Active → Collection → Resolved/Written-off

### Data Privacy & Security
```typescript
// Sensitive fields requiring encryption
- identityNumber: Encrypted at rest
- mobileNumber: Masked in logs
- email: PII protection
- addresses: Geo-data protection

// Access controls
- Only assigned staff can view full details
- Management can view aggregated data
- Audit trail for all access
```

### Calculated Fields (FindOneResult)
```typescript
// Performance metrics calculated on query
- lastActivityDate: Most recent collection activity
- acim: Activities count in month
- tpaim: Total payment amount in month
- tpafpim: Total payment from partner in month
- rcim: Result codes in month
- tbim: Total balance in month
- lovdd: Largest overdue days
- lastPaidDate: Most recent payment
```

---

## 🔄 Integration Points

### Core Relationships
- **Partner:** Customer.partnerCode → Partner.code (REQUIRED)
- **Contract:** Customer.code → Contract.customerCode (1:N)
- **Call:** Customer.code → Call.customerCode (1:N)
- **Activity:** Customer.code → Activity.customerCode (1:N)
- **Transaction:** Customer.code → Transaction.customerCode (1:N)

### Staff Assignments
- **Call Staff:** Handles phone-based debt collection
- **Field Staff:** Handles in-person visits và legal actions

### External Integrations
- **Identity Verification:** Government ID verification
- **Credit Bureau:** Credit score và history
- **Address Validation:** Geographic validation services
- **Phone Validation:** Mobile number verification

---

## 🧪 Testing

### Test Data Generation
```typescript
import { MockDataGenerator } from '../../test-utils';

const testCustomer = MockDataGenerator.generateCustomer({
  code: 'CUS_TEST_001',
  partnerCode: 'PTN_TEST_001',
  fullname: 'Nguyen Van Test',
  status: CustomerStatus.Active,
  identityNumber: '123456789012',
  mobileNumber: '0987654321'
});
```

### Business Test Scenarios
```typescript
// High-priority debt collection scenario
const scenario = MockDataGenerator.generateDebtCollectionScenario();
expect(scenario.customer.partnerCode).toBe(scenario.partner.code);
expect(scenario.contract.customerCode).toBe(scenario.customer.code);
```

---

## 📈 Performance Considerations

### Database Optimization
```typescript
// Critical indexes for performance
db.customers.createIndex({ "code": 1 })                    // Unique lookup
db.customers.createIndex({ "partnerCode": 1, "status": 1 }) // Partner queries
db.customers.createIndex({ "callStaffCode": 1 })           // Staff assignment
db.customers.createIndex({ "priority": -1, "status": 1 })  // Priority sorting
db.customers.createIndex({ "identityNumber": 1 })          // Identity lookup
db.customers.createIndex({ "mobileNumber": 1 })            // Phone lookup
```

### Query Optimization
- Use `findOneByCode()` for single customer lookup
- Paginate customer lists với proper sorting
- Cache calculated fields for performance metrics
- Use aggregation pipeline for complex reporting

### Memory Management
- Limit customer data in memory for bulk operations
- Use streaming for large exports
- Implement proper cleanup for test data

---

## 🔒 Security & Compliance

### Data Protection (GDPR/Local Laws)
```typescript
// PII fields requiring special handling
const sensitiveFields = [
  'identityNumber',    // National ID - encrypted
  'mobileNumber',      // Phone - masked in logs
  'officeNumber',      // Work phone - masked
  'email',             // Email - PII protection
  'temporaryAddress',  // Address - geo-privacy
  'permanentAddress',  // Address - geo-privacy
  'officeAddress'      // Work address - geo-privacy
];
```

### Access Controls
- **Role-based Access:** Staff can only see assigned customers
- **Audit Logging:** All customer access logged
- **Data Masking:** Sensitive fields masked in non-production
- **Retention Policy:** Customer data lifecycle management

### Compliance Requirements
- **Debt Collection Laws:** Comply với local regulations
- **Privacy Laws:** GDPR/local privacy requirements
- **Financial Regulations:** Banking secrecy laws
- **Contact Restrictions:** Time/frequency limitations

---

## 🐛 Common Issues & Troubleshooting

### Data Quality Issues
```bash
# Find customers với missing required data
db.customers.find({
  $or: [
    { "identityNumber": { $exists: false } },
    { "mobileNumber": { $exists: false } },
    { "fullname": { $exists: false } }
  ]
})

# Find customers với invalid phone numbers
db.customers.find({
  "mobileNumber": { $not: /^[0-9]{10,11}$/ }
})
```

### Performance Issues
- **Slow Queries:** Check index usage với explain()
- **Large Result Sets:** Implement pagination
- **Memory Usage:** Monitor bulk operations
- **Cache Misses:** Review calculated field caching

### Integration Issues
- **Partner Mismatch:** Validate partnerCode exists
- **Staff Assignment:** Ensure staff belongs to partner
- **Contract Sync:** Verify customer-contract relationships

---

## 📝 Development Notes

### Recent Updates
- ✅ **2025-01-17:** Complete DTO standardization
- ✅ **2025-01-17:** Enhanced find-one với calculated fields
- ✅ **2025-01-17:** Improved validation rules
- ✅ **2025-01-17:** Added comprehensive test data generator

### Business Rules Implementation
```typescript
// Priority-based contact frequency
const contactFrequency = {
  1: 'Daily',      // Highest priority
  2: 'Weekly',     // High priority  
  3: 'Bi-weekly',  // Medium priority
  4: 'Monthly',    // Low priority
  5: 'Quarterly'   // Lowest priority
};

// Status transition rules
const validTransitions = {
  'Active': ['Collection', 'Inactive'],
  'Collection': ['Active', 'Resolved', 'Legal'],
  'Legal': ['Collection', 'Written-off'],
  'Resolved': ['Closed'],
  'Written-off': ['Closed']
};
```

### Agent Development Tips
- Always validate partnerCode before customer creation
- Use MockDataGenerator for consistent test scenarios  
- Implement proper error handling for PII operations
- Monitor performance metrics for collection efficiency
- Follow GDPR guidelines for data access và retention

---

*Customer Module Documentation - LCM Service*  
*Critical component of debt collection workflow*  
*Last Updated: 2025-01-17*