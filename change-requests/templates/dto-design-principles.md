# DTO Design Principles - LCM Service

## 🎯 LCM DTO Design Standards

### Core Pattern: ID-to-Object Resolution cho Debt Collection

LCM service handles sensitive debt collection data requiring careful validation và reference management.

## 📋 Standard Pattern Implementation

### 1. DTOs nhận IDs cho References
```typescript
// ❌ WRONG - Nhận full objects
export class CreateContractDto {
  partnerId: string;          // ✅ CORRECT
  customerId: string;         // ✅ CORRECT  
  debtAmount: number;
  dueDate: Date;
  // partner: Partner;        // ❌ WRONG
  // customer: Customer;      // ❌ WRONG
}
```

### 2. Service Methods Validate References
```typescript
async createContract(createContractDto: CreateContractDto) {
  // Validate partner exists
  const partner = await this.validatePartnerExists(createContractDto.partnerId);
  
  // Validate customer exists
  const customer = await this.validateCustomerExists(createContractDto.customerId);
  
  // Create contract với resolved objects
  const contract = new Contract({
    ...createContractDto,
    partner: this.buildPartnerInfo(partner),
    customer: this.buildCustomerInfo(customer),
    createdAt: new Date(),
  });
  
  return await contract.save();
}
```

### 3. Build Info Objects cho Entity Storage
```typescript
private buildPartnerInfo(partner: Partner): PartnerInfo {
  return {
    _id: partner._id,
    name: partner.name,
    type: partner.type,
    contactEmail: partner.contactEmail,
    // Include essential fields only
  };
}

private buildCustomerInfo(customer: Customer): CustomerInfo {
  return {
    _id: customer._id,
    fullName: customer.fullName,
    phoneNumber: customer.phoneNumber,
    address: customer.address,
    // Sensitive data properly handled
  };
}
```

## 🏦 LCM-Specific Entity Relationships

### Partner → Contract → Customer Flow
```typescript
// Contract Entity includes resolved references
export class Contract {
  @Prop({ required: true })
  contractNumber: string;

  @Prop({ required: true, type: PartnerInfo })
  partner: PartnerInfo;           // Resolved from partnerId

  @Prop({ required: true, type: CustomerInfo })
  customer: CustomerInfo;         // Resolved from customerId

  @Prop({ required: true })
  debtAmount: number;

  @Prop({ required: true })
  originalDebtAmount: number;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ type: [CallInfo] })
  calls: CallInfo[];              // Call history

  @Prop({ type: [TransactionInfo] })
  transactions: TransactionInfo[]; // Payment history
}
```

### Call Management References
```typescript
export class CreateCallDto {
  contractId: string;      // Reference to debt contract
  staffId: string;         // Staff making the call
  customerId: string;      // Customer being called
  callType: CallType;      // MANUAL, AUTO, DIALER
  
  // Validation in service:
  // - Contract exists and is active
  // - Staff has permission to call this customer
  // - Customer contact info is valid
  // - Call type matches available systems
}
```

## 🔒 Security & Compliance Considerations

### Customer Data Protection
```typescript
private buildCustomerInfo(customer: Customer): CustomerInfo {
  return {
    _id: customer._id,
    fullName: customer.fullName,
    // Sensitive fields properly masked/encrypted
    phoneNumber: this.maskPhoneNumber(customer.phoneNumber),
    address: customer.address,
    consentStatus: customer.consentStatus,
    dataRetentionDate: customer.dataRetentionDate,
  };
}
```

### Audit Trail Integration
```typescript
async createContract(createContractDto: CreateContractDto) {
  // Standard validation
  const partner = await this.validatePartnerExists(createContractDto.partnerId);
  const customer = await this.validateCustomerExists(createContractDto.customerId);
  
  // Audit trail
  await this.auditService.log({
    action: 'CONTRACT_CREATE',
    userId: this.getCurrentUserId(),
    partnerId: createContractDto.partnerId,
    customerId: createContractDto.customerId,
    sensitiveData: true,
  });
  
  // Continue với creation...
}
```

## 📊 Search DTO Patterns cho Debt Collection

### Multi-criteria Search
```typescript
export class FindContractsDto {
  // ID-based filters
  partnerId?: string;
  customerId?: string;
  staffId?: string;
  
  // Business filters
  status?: ContractStatus;
  debtAmountRange?: {
    min: number;
    max: number;
  };
  dueDateRange?: {
    from: Date;
    to: Date;
  };
  
  // Full-text search
  customerName?: string;
  contractNumber?: string;
  
  // Pagination
  page?: number;
  limit?: number;
}
```

### Performance Optimization
```typescript
async findContracts(findContractsDto: FindContractsDto) {
  const query: any = {};
  
  // Indexed fields first
  if (findContractsDto.partnerId) {
    query['partner._id'] = new Types.ObjectId(findContractsDto.partnerId);
  }
  
  if (findContractsDto.customerId) {
    query['customer._id'] = new Types.ObjectId(findContractsDto.customerId);
  }
  
  // Range queries
  if (findContractsDto.debtAmountRange) {
    query.debtAmount = {
      $gte: findContractsDto.debtAmountRange.min,
      $lte: findContractsDto.debtAmountRange.max,
    };
  }
  
  // Text search with proper indexing
  if (findContractsDto.customerName) {
    query['customer.fullName'] = new RegExp(findContractsDto.customerName, 'i');
  }
  
  return await this.contractModel
    .find(query)
    .limit(findContractsDto.limit || 50)
    .skip((findContractsDto.page || 0) * (findContractsDto.limit || 50))
    .exec();
}
```

## ✅ LCM DTO Validation Checklist

### Business Rule Validation:
- [ ] Partner exists và is active
- [ ] Customer exists và consent is valid
- [ ] Contract terms comply với regulations
- [ ] Staff has appropriate permissions
- [ ] Debt amounts are positive và reasonable
- [ ] Call schedules respect customer preferences
- [ ] Payment amounts don't exceed debt balance

### Technical Validation:
- [ ] All IDs are valid MongoDB ObjectIds
- [ ] Required fields are present
- [ ] Data types are correct
- [ ] Business enums are valid
- [ ] Date ranges are logical
- [ ] Phone numbers are properly formatted
- [ ] Email addresses are valid (if applicable)

### Security Validation:
- [ ] Customer data access is authorized
- [ ] Sensitive data is properly handled
- [ ] Audit trails are created
- [ ] Data retention policies are followed
- [ ] GDPR/privacy compliance is maintained

## 🎯 LCM-Specific Info Objects

### Essential Entity Info Types:
```typescript
// Partner financial institution info
interface PartnerInfo {
  _id: ObjectId;
  name: string;
  type: PartnerType;
  contactEmail: string;
  slaTerms: string;
}

// Customer debtor info
interface CustomerInfo {
  _id: ObjectId;
  fullName: string;
  phoneNumber: string;
  address: string;
  consentStatus: ConsentStatus;
  preferredContactTime: string;
}

// Staff/Agent info
interface StaffInfo {
  _id: ObjectId;
  fullName: string;
  employeeId: string;
  team: TeamInfo;
  permissions: Permission[];
}

// Call activity info
interface CallInfo {
  _id: ObjectId;
  callType: CallType;
  startTime: Date;
  duration: number;
  result: CallResult;
  notes: string;
  staff: StaffInfo;
}
```

---

*DTO Design Principles específicamente tailored cho LCM debt collection business*
*Ensuring compliance, security, và performance cho sensitive financial data*