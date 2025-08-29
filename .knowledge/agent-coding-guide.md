# Unified Agent Coding Guide (LCM Service)

## 🎯 PRIMARY KNOWLEDGE HIERARCHY
1. This file - Main agent instructions
2. current-implementation.md - Live codebase status  
3. task-management.md - Approved tasks
4. deployment-guide.md - Build & deployment operations
5. docs/agent-guide.md - Architecture patterns
6. docs/business-workflows.md - Business domain knowledge

## 🤖 AGENT COORDINATION
### Roles:
- **VOA Agent**: Primary development, routine maintenance, staging deployments
- **Copilot**: Complex features, performance optimization, production deployments  
- **Human**: Strategic decisions, architecture changes, deployment approvals

### Workflow:
1. **Pre-work**: Check task-management.md for approved tasks
2. **Execution**: Follow NestJS/TypeScript patterns from architecture guide
3. **Post-work**: Update current-implementation.md
4. **Quality**: Validate against established patterns
5. **Deployment**: Follow deployment-guide.md for build & deploy operations

## 🎯 PROJECT-SPECIFIC CONTEXT

### **Technology Stack**
- **Framework**: NestJS (Node.js backend framework)
- **Language**: TypeScript
- **Database**: MongoDB (with TypeORM/Mongoose)
- **Authentication**: JWT + Basic Auth strategies
- **Architecture**: Modular monolith with microservice readiness
- **Deployment**: PM2, Docker containers, nginx proxy

### **Business Domain**
- **LCM**: Loans/Debt Collection Management system
- **Core Functions**: Customer management, call tracking, contract handling, automation workflows
- **Modules**: 20+ feature modules (customer, call, contract, automation, etc.)
- **Integration**: Multi-service ecosystem with shared permissions/resources

### **Key Architectural Patterns**

#### **Module Structure Pattern**
```typescript
modules/[feature-name]/
├── [feature].controller.ts      // REST API endpoints
├── [feature].service.ts         // Business logic
├── [feature].module.ts          // NestJS module definition
├── entity/[feature].entity.ts   // Database schema
├── dto/create.dto.ts            // Input validation DTOs
├── dto/find-one.dto.ts          // Query DTOs
├── dto/update-one.dto.ts        // Update DTOs
├── enum/[feature].enum.ts       // Feature-specific enums
└── README.md                    // Module documentation
```

#### **Base Classes Pattern**
- **BaseController**: Standard CRUD endpoints with auth/validation
- **BaseService**: Common database operations and business logic
- **BaseEntity**: Shared entity fields (id, createdAt, updatedAt, deletedAt)
- **Base DTOs**: Standardized input/output patterns

#### **Common Services Pattern**
- **Permissions System**: Complex role-based permissions by service/resource
- **Exception Handling**: Standardized business/technical exceptions
- **Validation**: DTO-based validation with transform pipes
- **Guards**: Auth guards with JWT/Basic Auth strategies

## 📋 DECISION FRAMEWORK

### ✅ Proceed Autonomously:
- **Module CRUD Operations**: Standard create/read/update/delete following existing patterns
- **DTO Updates**: Adding/modifying validation rules following established patterns
- **Enum Additions**: Adding new values to existing enums
- **Service Method Extensions**: Adding business logic following service patterns
- **Documentation Updates**: Module READMEs and inline documentation
- **Unit Test Creation**: Following existing test patterns
- **Staging Deployments**: With successful builds and tests
- **Bug Fixes**: Following established error handling patterns
- **Performance Optimizations**: Database query optimizations, caching improvements

### 🤔 Flag for Human Review:
- **New Module Creation**: Requires architecture alignment
- **Database Schema Changes**: Entity modifications affecting data integrity
- **Authentication/Authorization Changes**: Security-sensitive modifications
- **External Service Integrations**: API integrations with third parties
- **Production Deployments**: Always require approval
- **Permission System Changes**: Complex role/permission modifications
- **Cross-module Dependencies**: Changes affecting multiple modules
- **Breaking API Changes**: Modifications affecting existing endpoints
- **Infrastructure Changes**: Docker, PM2, nginx configurations

## 🔧 TECHNICAL GUIDELINES

### **Code Quality Standards**
- **TypeScript Strict Mode**: Enable all strict type checking
- **ESLint/Prettier**: Follow configured code formatting
- **Naming Conventions**: PascalCase classes, camelCase methods/variables
- **File Naming**: kebab-case for files, match class names
- **Import Organization**: Group imports (node_modules, relative, absolute)

### **NestJS Best Practices**
- **Dependency Injection**: Use constructor injection for services
- **Decorators**: Proper use of @Controller, @Service, @Injectable
- **Validation**: DTO validation with class-validator decorators
- **Exception Handling**: Use custom exceptions from common/exceptions
- **Module Organization**: Feature modules with clear boundaries

### **Database Guidelines**
- **Entity Design**: Extend BaseEntity for standard fields
- **Relationships**: Use TypeORM decorators (@OneToMany, @ManyToOne, etc.)
- **Indexes**: Add appropriate database indexes for performance
- **Migrations**: Handle schema changes through migrations
- **Soft Deletes**: Use soft delete pattern (deletedAt field)

### **API Design**
- **REST Conventions**: Standard HTTP methods and status codes
- **Response Format**: Consistent response structure with BaseController
- **Error Handling**: Standardized error responses with error codes
- **Pagination**: Use common pagination patterns from base classes
- **Validation**: Request validation with DTOs and validation pipes

### **Testing Approach**
- **Unit Tests**: Test services with mocked dependencies
- **Integration Tests**: Test controllers with test database
- **Test Structure**: Follow AAA pattern (Arrange, Act, Assert)
- **Mock Data**: Use mock-data.generator.ts for test data
- **Test Coverage**: Aim for >80% coverage on business logic

## 🚀 DEVELOPMENT WORKFLOW

### **Feature Development Process**
1. **Analysis**: Review existing similar modules for patterns
2. **Planning**: Define entities, DTOs, services, and controllers  
3. **Implementation**: Start with entity, then service, then controller
4. **Testing**: Write unit tests for service methods
5. **Documentation**: Update module README and API docs
6. **Integration**: Ensure proper module imports and dependencies

### **Code Review Checklist**
- [ ] Follows established module structure pattern
- [ ] Proper TypeScript typing (no `any` types)
- [ ] DTOs with proper validation decorators
- [ ] Service methods with proper error handling
- [ ] Controller endpoints with proper auth guards
- [ ] Unit tests covering business logic
- [ ] Documentation updated
- [ ] No breaking changes to existing APIs

### **Database Change Process**
1. **Entity Modification**: Update entity classes
2. **Migration**: Create database migration if needed
3. **Service Updates**: Update service methods for new fields
4. **DTO Updates**: Update DTOs for new validation rules
5. **Testing**: Test with migration on staging database
6. **Documentation**: Update database schema docs

---

**Last Updated**: 2025-01-17
**Technology Stack**: NestJS + TypeScript + MongoDB
**Architecture**: Modular monolith with 20+ feature modules