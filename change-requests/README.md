# Change Request Process - LCM Service

## 📋 Quy trình Change Request (CR) cho LCM Service

### Mục đích
Đảm bảo tất cả major changes đối với LCM (Loans Collection Management) service được review kỹ lưỡng, documented đầy đủ và implement an toàn.

## 🔄 Workflow

### 1. CR Creation (CEO Tony)
- Tạo CR file từ template trong `/templates/`
- Đặt tên file: `CR-YYYY-MM-DD-XXX-brief-description.md`
- Đặt trong thư mục `pending/`

### 2. Analysis & Planning (LCM Agent) 
- Agent phân tích impact
- Propose technical solution
- Estimate effort và timeline
- Update CR file với analysis

### 3. Approval (CEO Tony)
- Review agent's analysis
- Approve/reject/request modifications
- Move file to `approved/` hoặc `rejected/`

### 4. Implementation (LCM Agent)
- Move file to `in-progress/`
- Implement theo approved plan
- Update progress realtime trong CR file
- Regular status updates

### 5. Completion
- Final testing và validation
- Update documentation
- Move file to `completed/`

## 📁 Thư mục Structure

```
change-requests/
├── templates/           # CR templates
├── pending/            # Chờ approval từ CEO Tony
├── approved/           # Được approve, chờ implementation
├── in-progress/        # Đang implement
├── completed/          # Hoàn thành
└── rejected/           # Bị reject
```

## ⚠️ Các loại changes cần CR

### Major Changes:
- **New modules/entities** - Partner, Customer, Contract modifications
- **Database schema changes** - MongoDB/MSSQL structure updates
- **API contract changes** - Endpoint modifications affecting frontend
- **Business logic changes** - Debt collection workflow modifications
- **Security/compliance changes** - Customer data protection updates
- **Integration changes** - Call system, payment processing integrations
- **Performance architecture changes** - Caching, scaling modifications

### Minor Changes (No CR needed):
- Bug fixes không affect business logic
- Documentation updates
- Code refactoring không change behavior
- Minor UI/UX improvements
- Log message updates

## 🎯 LCM-Specific Considerations

### Business Impact Assessment:
- **Customer Data Security** - Any changes affecting customer privacy
- **Compliance Impact** - Debt collection regulation compliance
- **Partner Integration** - Changes affecting financial partner systems
- **Call System Impact** - Auto dialer, click-to-call functionality
- **Payment Processing** - Transaction handling modifications
- **Report Accuracy** - Business intelligence và performance metrics

### Technical Considerations:
- **Database Migration** - MongoDB và MSSQL schema updates
- **Excel Processing** - Large file handling improvements
- **Message Queue** - AMQP/RabbitMQ queue processing
- **API Performance** - Response time cho debt lookup operations
- **Data Migration** - Legacy system integration impacts

## 🔗 Templates Available

1. **`cr-template.md`** - Standard CR template
2. **`dto-design-principles.md`** - DTO development guidelines
3. **`impact-analysis-template.md`** - Technical impact assessment
4. **`testing-checklist.md`** - Testing requirements

## 📊 Tracking

File `cr-tracking.json` contains metadata về all CRs:
- Creation date
- Current status
- Assignee
- Priority level
- Business impact classification

---

*Quản lý bởi LCM Service Development Agent*
*Phục vụ debt collection business requirements cho khách hàng Hoàn Kim*