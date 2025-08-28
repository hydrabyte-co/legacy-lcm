# Activity Module

**Business Purpose:** Theo dõi và ghi lại tất cả hoạt động thu hồi nợ và tương tác với khách hàng

---

## 📋 Overview

Activity module ghi lại audit trail chi tiết của tất cả các hoạt động trong debt collection process. Module này đảm bảo compliance và cung cấp lịch sử đầy đủ của các tương tác với khách hàng.

### Business Context
- **Audit Trail:** Complete history của customer interactions
- **Compliance:** Regulatory compliance cho debt collection activities
- **Performance Tracking:** Staff performance monitoring
- **Legal Documentation:** Evidence cho legal proceedings

### Key Features
- Comprehensive activity logging cho all customer interactions
- Integration với call, transaction, và other business modules
- Advanced search và filtering capabilities
- Performance analytics và reporting
- Compliance tracking và documentation

---

## 🏗 Technical Architecture

### Module Structure
```
src/modules/activity/
├── activity.controller.ts    # Activity tracking APIs
├── activity.service.ts       # Business logic & audit trails
├── activity.module.ts        # NestJS module configuration
├── dto/
│   ├── create.dto.ts         # Activity creation với validation
│   ├── update-one.dto.ts     # Activity updates
│   └── find-one.dto.ts       # Activity details với metadata
├── entity/
│   └── activity.entity.ts    # MongoDB schema với indexes
└── enum/
    └── activity.enum.ts      # ActivityType, ResultCode enums
```

### Database Integration
- **Primary:** MongoDB (default connection)
- **Collection:** `activities`
- **Indexes:** `customerCode`, `staffCode`, `activityType`, `activityDate`

---

*Detailed documentation available in module source code*  
*Last Updated: 2025-01-17*