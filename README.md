# LCM Service - Loans Collection Management

<p align="center">
  <img src="https://nestjs.com/img/logo_text.svg" width="200" alt="Nest Logo" />
</p>

<p align="center">
  <strong>Loans Collection Management Microservice</strong><br/>
  Built with NestJS for TranGPT Company - Hoàn Kim Law Firm
</p>

---

## 📋 Project Overview

**LCM Service** là hệ thống quản lý thu hồi nợ (Loans Collection Management) được phát triển cho **Văn phòng luật sư Hoàn Kim** bởi **Công ty TNHH MTV TranGPT**.

### 🏢 Company Information
- **Client:** Hoàn Kim Law Firm
- **Developer:** TranGPT Company (MST: 0110773355)
- **CEO & Founder:** Hoàng Việt Dũng (Tony)
- **Address:** Tầng 7, Tòa nhà Việt Á, số 9 Phố Duy Tân, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội

### 🎯 Business Domain
Hệ thống quản lý thu hồi nợ toàn diện cho các tổ chức tài chính:
- **Partners:** Quản lý đối tác tài chính
- **Customers:** Quản lý khách hàng nợ
- **Contracts:** Quản lý hợp đồng nợ
- **Call Management:** Hệ thống cuộc gọi đòi nợ (Click-to-Call, Auto Call, Auto Dialer)
- **Transactions:** Xử lý thanh toán
- **Reports:** Báo cáo hiệu suất thu hồi nợ

## 🛠 Technology Stack

### Core Framework
- **NestJS 8.x** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Node.js** - Runtime environment

### Databases
- **MongoDB** - Primary database với Mongoose ODM
- **Microsoft SQL Server (MSSQL)** - Legacy system integration

### Communication
- **AMQP/RabbitMQ** - Message queue với amqp-connection-manager
- **RESTful APIs** - HTTP/HTTPS endpoints

### Security & Authentication
- **JWT** - JSON Web Tokens
- **Passport** - Authentication middleware
- **Role-based Access Control** - Staff permissions

### File Processing
- **Excel Processing** - read-excel-file, write-excel-file
- **Data Import/Export** - Bulk operations support

### Testing
- **Jest** - Unit và integration testing
- **E2E Testing** - End-to-end testing với Supertest

## 🏗 Architecture Overview

LCM Service được thiết kế theo kiến trúc **Microservice** với 3 chế độ hoạt động:

### Service Modes
- **🌐 API Mode** (`npm run api`) - RESTful API server (Port: 3005)
- **⚙️ Microservice Mode** (`npm run ms:dev`) - Message queue processing
- **👷 Worker Mode** (`npm run wrk:dev`) - Background task processing
- **💳 Payment Migration Worker** (`npm run wrk-payment:dev`) - Specialized payment migration

### PM2 Ecosystem
```javascript
// Production services managed by PM2
- lcm-api               // API server
- lcm-ms-file          // File processing microservice
- lcm-ms-sync          // Data sync microservice  
- lcm-wrk              // General worker
- lcm-wrk:payment-migration  // Payment migration worker
```

## 📂 Project Structure

### Core Modules (160+ TypeScript files) ✅ **Recently Optimized**
```
src/
├── modules/           # Business domain modules
│   ├── partner/       # Đối tác tài chính
│   ├── customer/      # Khách hàng nợ
│   ├── contract/      # Hợp đồng nợ
│   ├── call/          # Quản lý cuộc gọi
│   ├── activity/      # Hoạt động đòi nợ
│   ├── transaction/   # Giao dịch thanh toán
│   ├── staff/         # Nhân viên
│   ├── team/          # Nhóm làm việc
│   ├── task/          # Nhiệm vụ
│   ├── investigation/ # Điều tra nợ
│   ├── reference/     # Dữ liệu tham chiếu
│   ├── performance/   # Hiệu suất
│   ├── report/        # Báo cáo
│   ├── result/        # Kết quả thu hồi
│   ├── data-migration/ # Di chuyển dữ liệu
│   ├── import-data/   # Import dữ liệu
│   ├── export-data/   # Export dữ liệu
│   ├── data-handler/  # Xử lý dữ liệu
│   ├── event/         # Sự kiện hệ thống
│   └── utils/         # Tiện ích
├── workers/           # Background workers
├── common/           # Shared utilities (base classes, guards, utils)
├── constants/        # Application constants
└── test-utils/       # Testing infrastructure ✅ NEW
```

### Module Pattern ✅ **Standardized**
Mỗi business module tuân theo chuẩn NestJS:
```
module/
├── module.controller.ts  # RESTful endpoints
├── module.service.ts     # Business logic
├── module.module.ts      # NestJS module definition
├── dto/                  # Data Transfer Objects ✅ STANDARDIZED
│   ├── create.dto.ts     # ✅ All 20 modules
│   ├── update-one.dto.ts # ✅ All 20 modules  
│   └── find-one.dto.ts   # ✅ All 20 modules
├── entity/
│   └── module.entity.ts  # Database schema
└── enum/
    └── module.enum.ts    # Business enums
```

### Testing Infrastructure ✅ **NEW**
```
src/test-utils/
├── mock-data.generator.ts    # Realistic test data for all entities
├── test-database.helper.ts   # Database testing utilities
├── unit-test.template.ts     # Consistent test patterns
└── index.ts                  # Centralized test exports
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js >= 16.x
- MongoDB (Primary database)
- Microsoft SQL Server (Legacy integration)
- RabbitMQ (Message queue)

### Installation
```bash
git clone https://github.com/hydrabyte-co/legacy-lcm.git lcm-service
cd lcm-service
cp .env.example .env                 # cấu hình app, điền giá trị thật
cp .env.deploy.example .env.deploy   # chỉ cần nếu bạn deploy prod
npm install
npm run build
```

`src/common` là code thường trong repo (trước đây là submodule, đã gộp vào từ commit `610cc43`).

## 🏃‍♂️ Running the Application

### Development Modes
```bash
# API Server (Port: 3005)
npm run api

# Microservice mode
npm run ms:dev

# General worker
npm run wrk:dev

# Payment migration worker
npm run wrk-payment:dev

# Standard development
npm run start:dev
```

### Production
```bash
# Production build
npm run build

# Start production server
npm run start:prod

# Deploy to production
npm run deploy:prod
```

### Deploy production
```bash
./deploy-prod.sh            # build local, rsync dist lên các host trong DEPLOY_HOSTS, restart pm2
./scripts/check-status.sh   # kiểm tra sau deploy
```
Chi tiết (debug prod, rollback, quy trình hotfix/CR): xem [CLAUDE.md](./CLAUDE.md).

## 🧪 Testing ✅ **Enhanced Infrastructure**

```bash
# Unit tests với new templates
npm run test

# End-to-end tests với database helpers
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch

# Debug tests
npm run test:debug
```

### New Testing Features:
- **MockDataGenerator**: Realistic test data cho all 20 modules
- **TestDatabaseHelper**: Integration testing với cleanup
- **ServiceTestTemplate**: Consistent CRUD testing patterns
- **DebtCollectionScenarios**: Complete business workflow testing
- **PerformanceTestSuite**: Bulk operation testing

## 🔧 Development Guidelines

### Change Request Process
Quy trình hotfix / Change Request: xem [CLAUDE.md](./CLAUDE.md#quy-trình-làm-việc).
CR lưu tại [docs/change-requests/](./docs/change-requests/), change log tại [docs/change-logs/](./docs/change-logs/).

### DTO Design Principles
**📐 MANDATORY:** Reference DTO design standards:
📋 **[DTO Design Principles](./docs/dto-design-principles.md)**

### Core Development Rules
- **ID-to-Object Resolution Pattern** cho tất cả DTOs
- **Reference validation** cho business entities
- **Audit trail** cho sensitive operations
- **Customer data encryption** và access control
- **Compliance validation** theo quy định thu hồi nợ

## 🔒 Security & Compliance

### Data Protection
- **Customer Information:** Encrypted storage và controlled access
- **Financial Data:** PCI-DSS compliance considerations
- **Audit Trails:** Complete logging của debt collection activities
- **Role-based Permissions:** Staff access control

### Authentication
- **JWT Tokens** với Passport strategies
- **Role-based Authorization** cho staff hierarchy
- **Session Management** với proper timeout

## 📊 Business Operations

### Debt Collection Workflow
1. **Partner Onboarding** - Tổ chức tài chính đăng ký
2. **Data Import** - Import danh sách nợ từ Excel/CSV
3. **Customer Assignment** - Phân công nhân viên
4. **Call Management** - Thực hiện cuộc gọi đòi nợ
5. **Activity Tracking** - Theo dõi hoạt động
6. **Payment Processing** - Xử lý thanh toán
7. **Reporting** - Báo cáo hiệu suất

### Call System Integration
- **Click-to-Call:** Manual dialing
- **Auto Call (ATC):** Automated calling system
- **Auto Dialer:** Automatic number dialing với agent transfer

## 🐛 Troubleshooting

### Common Issues
- **Database Connection:** Check MongoDB/MSSQL connectivity
- **Message Queue:** Verify RabbitMQ service status
- **Call System:** Validate telecom integration
- **Excel Processing:** Monitor memory usage for large files

### Performance Monitoring
- **API Response Time:** Target <300ms for debt lookup
- **Database Queries:** Optimized indexing for large datasets
- **Memory Management:** Prevent leaks during bulk processing
- **Queue Processing:** Ensure reliable call queue handling

## 📞 Support

For technical support và business inquiries:
- **Development Team:** TranGPT Development Team
- **Project Owner:** Hoàng Việt Dũng (Tony) - CEO TranGPT
- **Client:** Hoàn Kim Law Firm

## 📄 License

This project is proprietary software developed for Hoàn Kim Law Firm by TranGPT Company.
All rights reserved - TranGPT Company © 2024
