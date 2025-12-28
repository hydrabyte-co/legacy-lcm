# Partner Module

**Business Purpose:** Quản lý đối tác tài chính gửi danh sách nợ cần thu hồi

---

## 📋 Overview

Partner module quản lý thông tin các tổ chức tài chính (ngân hàng, công ty tài chính) là đối tác của TranGPT trong việc thu hồi nợ. Đây là module core đầu tiên trong debt collection workflow.

### Business Context
- **Clients:** Các tổ chức tài chính cần thu hồi nợ
- **Data Source:** Partner cung cấp danh sách khách hàng nợ
- **SLA:** Theo dõi hiệu suất thu hồi nợ cho từng partner
- **Contract:** Quản lý hợp đồng và điều khoản hợp tác

---

## 🏗 Technical Architecture

### Module Structure
```
src/modules/partner/
├── partner.controller.ts    # REST API endpoints
├── partner.service.ts       # Business logic & DB operations  
├── partner.module.ts        # NestJS module configuration
├── dto/
│   ├── create.dto.ts        # Partner creation validation
│   ├── update-one.dto.ts    # Partner update validation
│   └── find-one.dto.ts      # Partner response format
├── entity/
│   └── partner.entity.ts    # MongoDB schema definition
└── enum/
    └── partner.enum.ts      # Partner-specific enums
```

### Database Connection
- **Primary:** MongoDB (default connection)
- **Collection:** `partners`
- **Indexes:** `code`, `businessCode`, `status`, `contractCode`

---

## 🛠 API Endpoints

### Core CRUD Operations
```typescript
GET    /partners              # List all partners with pagination
GET    /partners/:id          # Get partner by ID
POST   /partners              # Create new partner
PUT    /partners/:id          # Update partner
DELETE /partners/:id          # Delete partner
```

### Business Endpoints
```typescript
GET    /partners/by-code/:code           # Find partner by business code
GET    /partners/:id/performance         # Get partner collection performance
GET    /partners/:id/customers           # Get partner's customers
GET    /partners/:id/contracts           # Get partner's contracts
POST   /partners/:id/bulk-import         # Import partner data
```

---

## 📊 Business Logic

### Partner Lifecycle
1. **Registration:** Partner signs contract với TranGPT
2. **Data Integration:** Setup data import từ partner systems
3. **Customer Assignment:** Import customer lists từ partner
4. **Performance Monitoring:** Track collection KPIs
5. **Contract Renewal:** Monitor contract expiration

### Key Business Rules
- **Unique Codes:** `code`, `businessCode`, `contractCode` must be unique
- **Contract Validation:** `contractStartDate` < `contractEndDate`
- **Status Management:** Only `Active` partners can import data
- **SLA Tracking:** Monitor collection performance vs targets

### Data Validation
```typescript
// Core validations in CreatePartnerData
- code: Required, max 24 chars, unique
- businessCode: Required, max 24 chars, unique  
- contractCode: Required, max 24 chars
- name: Required, max 100 chars
- status: Enum [Active, Inactive, Suspended]
- contractStartDate: Required, ISO date
- contractEndDate: Required, > startDate
```

---

## 🔄 Integration Points

### Incoming Dependencies
- **Staff Module:** Partner có assigned staff members
- **Team Module:** Partner có organized teams

### Outgoing Dependencies  
- **Customer Module:** Partner.code → Customer.partnerCode
- **Contract Module:** Partner.code → Contract.partnerCode
- **Call Module:** Partner calls về customer debt
- **Transaction Module:** Partner nhận payments
- **Activity Module:** All activities link to partner
- **Report Module:** Partner performance reports

### External Integrations
- **Partner APIs:** Import customer/contract data
- **Payment Systems:** Receive payment confirmations
- **Compliance Systems:** Regulatory reporting

---

## 🧪 Testing

### Test Data Generation
```typescript
import { MockDataGenerator } from '../../test-utils';

const testPartner = MockDataGenerator.generatePartner({
  code: 'PTN_TEST_001',
  name: 'Test Financial Institution',
  status: PartnerStatus.Active
});
```

### Common Test Scenarios
- **Create Partner:** Valid data validation
- **Update Partner:** Status transitions
- **Delete Partner:** Cascade considerations
- **Performance Queries:** SLA calculations
- **Bulk Operations:** Data import testing

---

## 📈 Performance Considerations

### Database Optimization
- **Indexes:** Compound index on (status, contractEndDate)
- **Queries:** Use `findOneByCode()` for lookups
- **Bulk Operations:** Use MongoDB bulk insert for imports

### Monitoring Metrics
- **Collection Rate:** % of debts successfully collected
- **Customer Satisfaction:** Complaint rates
- **SLA Compliance:** Contract performance metrics
- **Data Quality:** Import success/error rates

---

## 🔒 Security & Compliance

### Data Protection
- **Sensitive Fields:** contractTerms, financialDetails
- **Access Control:** Role-based partner access
- **Audit Trail:** All changes logged
- **Data Retention:** Per contract requirements

### Business Compliance
- **Contract Validation:** Legal terms verification
- **Regulatory Reporting:** Partner performance reporting
- **Privacy Protection:** Customer data handling agreements

---

## 🐛 Common Issues & Troubleshooting

### Known Issues
1. **Duplicate Codes:** Ensure unique validation before creation
2. **Contract Expiry:** Monitor và alert before expiration
3. **Performance Degradation:** Check compound index usage
4. **Data Import Errors:** Validate partner API connectivity

### Debug Queries
```typescript
// Find partners with expired contracts
db.partners.find({
  contractEndDate: { $lt: new Date() },
  status: 'Active'
})

// Check partner performance
db.partners.aggregate([
  { $lookup: { from: 'customers', ... } },
  { $group: { _id: '$code', totalCustomers: { $sum: 1 } } }
])
```

---

## 📝 Development Notes

### Recent Updates
- ✅ **2025-01-17:** DTO standardization completed
- ✅ **2025-01-17:** Added find-one, update-one DTOs
- ✅ **2025-01-17:** Enhanced validation rules

### Future Enhancements
- [ ] **Partner API Integration:** Direct system-to-system imports
- [ ] **Real-time Performance Dashboard:** Live KPI tracking
- [ ] **Contract Auto-renewal:** Automated contract management
- [ ] **Multi-currency Support:** International partner support

### Agent Development Tips
- Use `MockDataGenerator.generatePartner()` for testing
- Follow DTO patterns for consistent validation
- Check partner status before major operations
- Monitor performance metrics for SLA compliance

---

*Partner Module Documentation - LCM Service*  
*Last Updated: 2025-01-17*  
*Part of Repository Optimization CR-2025-01-17-001*