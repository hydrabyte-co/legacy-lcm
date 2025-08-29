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
│   └── find-one.dto.ts         # Search & response DTOs
├── entity/
│   ├── automation.entity.ts    # MongoDB automation schema
│   └── automation-config.interface.ts # Type-safe config interfaces
├── enum/
│   └── automation.enum.ts      # Automation types and statuses
└── README.md                   # Module documentation
```

### Database Schema
```typescript
Automation {
  id: ObjectId;
  code: string;              // Unique identifier (AUTO_DIALER_001)
  name: string;              // Human-readable name
  type: AutomationType;      // "auto-dialer" | "auto-sms" | etc.
  frequency: number;         // Execution interval (seconds)
  config: AutomationConfig;  // Type-specific configuration
  status: AutomationStatus;  // "active" | "inactive" | "paused" | "error"
  priority: number;          // 1-10 execution priority
  
  // Execution tracking
  lastExecutedAt?: Date;
  nextExecutionAt?: Date;
  executionCount: number;
  successCount: number;
  errorCount: number;
  
  // Business constraints
  startTime?: string;        // Daily start time (HH:MM)
  endTime?: string;          // Daily end time (HH:MM)
  workingDays?: WeekDay[];   // Working days restriction
  maxConcurrentJobs?: number;
  
  // Base fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isDeleted: boolean;
}
```

---

## 🎯 API Endpoints

### Core CRUD Operations
- `POST /automations` - Create new automation
- `GET /automations/:id` - Get automation by ID
- `GET /automations` - List automations with filtering
- `PUT /automations/:id` - Update automation
- `DELETE /automations/:id` - Delete automation

### Automation Management
- `PATCH /automations/:id/status` - Update automation status
- `GET /automations/by-code/:code` - Find by automation code

### Query Parameters
- `type`: Filter by automation type
- `status`: Filter by status
- `partnerId`: Filter by partner
- `staffId`: Filter by assigned staff
- `activeOnly`: Only active automations
- `priorityMin/Max`: Priority range filtering

---

## 🔧 Auto Dialer Configuration

### Config Structure
```typescript
AutoDialerConfig {
  type: "auto-dialer";
  
  // Target partners
  partners: PartnerInfo[];
  
  // Staff assignment
  staffAssignment: {
    mode: "round-robin" | "skill-based" | "availability-based";
    staffs: StaffInfo[];
    maxCallsPerStaff: number;
  };
  
  // Phone system
  phoneSystem: {
    provider: "viettel" | "fpt" | "vnpt";
    phoneNumbers: PhoneNumberInfo[];
    callTimeout: number;
  };
  
  // Call rules
  callRules: {
    retryAttempts: number;
    retryInterval: number;
    concurrentCallRatio: number; // 0.5 - 2.0
    customerFilters?: CustomerFilter[];
  };
  
  // Call handling
  callHandling: {
    onAnswer: "connect-to-staff" | "play-message" | "record-message";
    onNoAnswer: "retry" | "sms-followup" | "mark-attempted";
    onBusy: "retry-later" | "try-alternate-number";
    onError: "retry" | "escalate" | "pause-automation";
  };
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
1. **Unique Code:** Each automation must have unique code
2. **Config Validation:** Config must match automation type
3. **Active Deletion:** Cannot delete active automations
4. **Concurrent Limits:** ConcurrentCallRatio between 0.1-5.0
5. **Required Fields:** Partners, staffs, phone numbers required

### Execution Rules
1. **Business Hours:** Respect startTime/endTime constraints
2. **Working Days:** Only execute on specified days
3. **Priority Order:** Higher priority automations execute first
4. **Resource Limits:** Respect maxConcurrentJobs setting

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
  code: "AUTO_DIALER_001",
  name: "Auto Dialer - Partner ABC",
  type: AutomationType.AutoDialer,
  frequency: 300, // 5 minutes
  config: {
    type: AutomationType.AutoDialer,
    partners: [{ id: "partner1", name: "Partner ABC", code: "ABC" }],
    staffAssignment: {
      mode: "round-robin",
      staffs: [{ id: "staff1", name: "John Doe", email: "john@company.com", staffCode: "JD001" }],
      maxCallsPerStaff: 5
    },
    phoneSystem: {
      provider: "viettel",
      phoneNumbers: [{ id: "phone1", number: "1900123456", description: "Main line", provider: "viettel", isActive: true }],
      callTimeout: 30
    },
    callRules: {
      retryAttempts: 3,
      retryInterval: 60,
      concurrentCallRatio: 1.5
    },
    callHandling: {
      onAnswer: "connect-to-staff",
      onNoAnswer: "retry",
      onBusy: "retry-later",
      onError: "retry"
    }
  },
  status: AutomationStatus.Inactive,
  startTime: "09:00",
  endTime: "17:00",
  workingDays: [WeekDay.Monday, WeekDay.Tuesday, WeekDay.Wednesday, WeekDay.Thursday, WeekDay.Friday]
};
```

---

*Auto Dialer Module cho LCM Debt Collection System*  
*Phase 1 Implementation - Core CRUD Complete*