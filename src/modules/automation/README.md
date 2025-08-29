# Automation Module

**Business Purpose:** Quản lý các automation workflows trong hệ thống LCM, đặc biệt là Auto Dialer cho debt collection

---

## 📋 Overview

Automation module quản lý các quy trình tự động trong debt collection, bắt đầu với Auto Dialer - hệ thống tự động gọi điện cho customers và kết nối với staff khi có answer.

### Business Context
- **Auto Dialer:** Tự động gọi điện đến customers trong danh sách nợ
- **Staff Integration:** Kết nối cuộc gọi đến available staff members
- **Call Management:** Quản lý retry logic, concurrent calls, call routing
- **Performance Tracking:** Theo dõi success rates, execution metrics

---

## 🏗 Technical Architecture

### Module Structure
```
src/modules/automation/
├── automation.controller.ts    # REST API endpoints
├── automation.service.ts       # Business logic & automation management  
├── automation.module.ts        # NestJS module configuration
├── dto/
│   ├── create.dto.ts           # Create automation validation
│   ├── update-one.dto.ts       # Update automation validation
│   ├── find-one.dto.ts         # Search & response DTOs
│   └── automation-config.dto.ts # Config validation DTOs
├── entity/
│   ├── automation.entity.ts    # MongoDB automation schema
│   └── automation-config.interface.ts # Type-safe config interfaces
├── enum/
│   └── automation.enum.ts      # Automation types and statuses
└── README.md                   # Module documentation
└── examples/
    └── create-automation.example.ts # Usage examples
```

### Database Schema
```typescript
Automation {
  id: ObjectId;
  type: AutomationType;        // "auto-dialer" | "auto-sms" | etc.
  frequency: number;           // Execution interval (30-1800 seconds)
  workingHours?: number[];     // Working hours (0-23 array)
  workingDays?: WeekDay[];     // Working days restriction
  config: AutomationConfig;    // Type-specific configuration
  status: AutomationStatus;    // "active" | "inactive" only
  notes?: string;              // Optional notes
  
  // Base fields (inherited from Base entity)
  createdAt: Date;
  changedAt: Date;
  deletedAt?: Date;
  owner: DataOwner;
  createdBy: DataHandler;
  changedBy: DataHandler;
  deletedBy: DataHandler;
  isDeleted: boolean;
}
```

---

## 🎯 API Endpoints

### Core CRUD Operations
- `POST /automations` - Create new automation (returns full automation data)
- `GET /automations/:id` - Get automation by ID
- `GET /automations` - List automations with filtering (returns FindAllResult<Automation>)
- `PUT /automations/:id` - Update automation (returns full automation data)
- `DELETE /automations/:id` - Delete automation

### Automation Management
- `PATCH /automations/:id/status` - Update automation status

### Query Parameters
- `type`: Filter by automation type
- `status`: Filter by status
- `partnerId`: Filter by partner ID in config
- `staffId`: Filter by assigned staff ID
- `activeOnly`: Only active automations

---

## 🔧 Auto Dialer Configuration

### Config Structure
```typescript
AutoDialerConfig {
  // Partner information
  partner: {
    id: string;
    name: string;
    code: string;
  };
  
  // Staff assignment
  staffs: Array<{
    id: string;
    name: string;
    email: string;
    staffCode: string;
  }>;
  
  // Phone numbers for dialing
  phoneNumbers: string[];  // Array of phone numbers
  
  // Call configuration
  retryAttempts: number;       // 1-10 retry attempts
  concurrentCallRatio: number; // 0.5-2.0 multiplier for concurrent calls
}
```

---

## 🔗 Integration Points

### LCM Module Dependencies
- **Partner Module:** Target partners for automation
- **Customer Module:** Customer lists for dialing
- **Staff Module:** Available staff for call routing
- **Call Module:** Call record creation and tracking

### External Systems
- **Telecom APIs:** Viettel/FPT/VNPT for actual calling
- **AMQP Queue:** Async job processing
- **Scheduler Service:** Automated execution timing

---

## 📊 Business Rules

### Validation Rules
1. **Config Validation:** Config must match automation type (no type field in config)
2. **Active Deletion:** Cannot delete active automations
3. **Concurrent Limits:** ConcurrentCallRatio between 0.5-2.0
4. **Frequency Range:** Frequency between 30-1800 seconds (30s - 30 minutes)
5. **Required Fields:** Partner, staffs, phoneNumbers required for auto-dialer
6. **Working Hours:** WorkingHours array values between 0-23
7. **Retry Attempts:** Between 1-10 attempts
8. **Phone Numbers:** Must be array with at least one phone number

### Execution Rules
1. **Working Hours:** Respect workingHours array constraints (0-23)
2. **Working Days:** Only execute on specified days
3. **Simple Status:** Only active/inactive status management
4. **Resource Limits:** Respect concurrentCallRatio setting

---

## 🚧 Implementation Status

### ✅ Phase 1: Core CRUD (Completed)
- [x] Entity and interfaces
- [x] DTO validation classes
- [x] Service with CRUD operations
- [x] Controller with REST endpoints
- [x] Module configuration

### 🔄 Phase 2: Execution Engine (Next)
- [ ] Automation scheduler service
- [ ] Call execution logic
- [ ] Staff routing algorithms
- [ ] Error handling and retry logic

### 🔮 Phase 3: Integration (Future)
- [ ] Telecom API integration
- [ ] AMQP queue processing
- [ ] Performance monitoring
- [ ] Advanced filtering and reporting

---

## 🎯 Usage Examples

### Create Auto Dialer Automation
```typescript
const createData: CreateAutomationData = {
  type: AutomationType.AutoDialer,
  frequency: 300, // 5 minutes (30-1800 seconds)
  workingHours: [8, 9, 10, 11, 13, 14, 15, 16, 17], // 8AM-6PM excluding lunch
  workingDays: [WeekDay.Monday, WeekDay.Tuesday, WeekDay.Wednesday, WeekDay.Thursday, WeekDay.Friday],
  config: {
    partner: {
      id: "partner_123",
      name: "Hoàn Kim Law Firm", 
      code: "HKLF_001"
    },
    staffs: [
      {
        id: "staff_456",
        name: "Nguyễn Văn A",
        email: "nguyenvana@hoankimlaw.com",
        staffCode: "NVA001"
      },
      {
        id: "staff_789", 
        name: "Trần Thị B",
        email: "tranthib@hoankimlaw.com",
        staffCode: "TTB002"
      }
    ],
    phoneNumbers: ["+84901234567", "+84901234568"], // Array of phone numbers
    retryAttempts: 3,
    concurrentCallRatio: 1.5 // 1.5x multiplier for concurrent calls
  },
  status: AutomationStatus.Inactive,
  notes: "Auto dialer for debt collection calls during business hours"
};

// Response example - now returns full automation data
const response: CreateAutomationResult = {
  id: "64f7b1234567890abcdef123",
  type: "auto-dialer",
  frequency: 300,
  workingHours: [8, 9, 10, 11, 13, 14, 15, 16, 17],
  workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  config: {
    partner: {
      id: "partner_123",
      name: "Hoàn Kim Law Firm",
      code: "HKLF_001"
    },
    staffs: [
      {
        id: "staff_456",
        name: "Nguyễn Văn A", 
        email: "nguyenvana@hoankimlaw.com",
        staffCode: "NVA001"
      }
    ],
    phoneNumbers: ["+84901234567", "+84901234568"],
    retryAttempts: 3,
    concurrentCallRatio: 1.5
  },
  status: "inactive",
  notes: "Auto dialer for debt collection calls during business hours",
  createdAt: "2025-08-29T10:30:00.000Z",
  updatedAt: "2025-08-29T10:30:00.000Z"
};
```

---

*Auto Dialer Module cho LCM Debt Collection System*  
*Phase 1 Implementation - Core CRUD Complete*