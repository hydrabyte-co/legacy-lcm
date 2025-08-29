# Staff Module

**Business Purpose:** Quản lý nhân viên thu hồi nợ và phân công công việc

---

## 📋 Overview

Staff module quản lý thông tin nhân viên call center và field collection staff. Module này hỗ trợ phân công customer, theo dõi performance và quản lý team structure.

### Business Context
- **Workforce Management:** Staff assignment và scheduling
- **Performance Tracking:** Individual staff performance metrics
- **Team Organization:** Team structure và hierarchy
- **Skill Management:** Staff skills và specializations

### Key Features
- Staff information management với role-based permissions
- Customer assignment và workload distribution
- Performance metrics và KPI tracking
- Team management và hierarchy
- Skill-based routing cho specialized collections

---

## 🏗 Technical Architecture

### Module Structure
```
src/modules/staff/
├── staff.controller.ts      # Staff management APIs
├── staff.service.ts         # Business logic & assignments
├── staff.module.ts          # NestJS module configuration
├── dto/
│   ├── create.dto.ts        # Staff creation với validation
│   ├── update-one.dto.ts    # Staff profile updates
│   └── find-one.dto.ts      # Staff details với performance data
├── entity/
│   └── staff.entity.ts      # MongoDB schema
└── enum/
    └── staff.enum.ts        # StaffRole, Status enums
```

### Database Integration
- **Primary:** MongoDB (default connection)
- **Collection:** `staff`
- **Indexes:** `code`, `partnerCode`, `teamCode`, `status`

---

*Detailed documentation available in module source code*  
*Last Updated: 2025-01-17*