# Reference Module

**Business Purpose:** 

---

## 📋 Overview



### Business Context


---

## 🏗 Technical Architecture

### Module Structure
```
src/modules/reference/
├── reference.controller.ts    # REST API endpoints
├── reference.service.ts       # Business logic
├── reference.module.ts        # NestJS module configuration
├── dto/
│   ├── create.dto.ts        # Creation validation ✅
│   ├── update-one.dto.ts    # Update validation ✅
│   └── find-one.dto.ts      # Response format ✅
├── entity/
│   └── reference.entity.ts    # MongoDB schema
└── enum/
    └── reference.enum.ts      # Business enums
```

### Database Integration
- **Primary:** MongoDB (default connection)
- **Collection:** `references`
- **Indexes:** Optimized for business queries

### Key Features
- ✅ **Standardized DTOs:** Complete create/update/find-one DTO structure
- ✅ **Business Logic:** Domain-specific business rules
- ✅ **Integration Ready:** Compatible với other LCM modules
- ✅ **Test Support:** MockDataGenerator compatibility
- ✅ **Performance Optimized:** Database indexes và query optimization

---

## 🔄 Integration Points

### LCM Module Dependencies


---

## 🧪 Testing

### Test Data Generation
```typescript
import { MockDataGenerator } from '../../test-utils';

const testReference = MockDataGenerator.generateReference({
  // Test-specific overrides
});
```

### Business Test Scenarios
- ✅ **CRUD Operations:** Complete create, read, update, delete testing
- ✅ **Business Logic:** Domain-specific rule validation
- ✅ **Integration Testing:** Module interaction testing
- ✅ **Performance Testing:** Bulk operation testing
- ✅ **Error Handling:** Edge case và error scenarios

---

## 📈 Performance Considerations

### Database Optimization
- **Indexes:** Optimized for business queries
- **Queries:** Efficient data retrieval
- **Bulk Operations:** Batch processing support
- **Caching:** Appropriate caching strategies

---

## 🔒 Security & Compliance

### Data Protection


---

## 📝 Development Notes

### Recent Updates
- ✅ **2025-01-17:** Complete DTO standardization implemented
- ✅ **2025-01-17:** Enhanced business logic validation
- ✅ **2025-01-17:** Improved integration patterns
- ✅ **2025-01-17:** Added comprehensive test support

### Agent Development Tips
- Use MockDataGenerator.generateReference() for consistent testing
- Follow standardized DTO patterns for validation
- Implement proper error handling for business scenarios
- Monitor performance for bulk operations
- Maintain integration compatibility với other LCM modules

---

*Reference Module Documentation - LCM Service*  
*Part of comprehensive debt collection management system*  
*Last Updated: 2025-01-17*
