# GitHub Copilot Instructions for LCM Service

## 📋 Primary Reference - KNOWLEDGE BASE INTEGRATION

**ALWAYS consult in this order:**
1. **`.knowledge/agent-coding-guide.md`** - Unified agent instructions & NestJS patterns
2. **`.knowledge/current-implementation.md`** - Live codebase status and recent changes
3. **`.knowledge/task-management.md`** - Current approved tasks and progress tracking
4. **`.knowledge/deployment-guide.md`** - Build & deployment operations (PM2, multi-VM)
5. **`.knowledge/patterns-reference.md`** - Complete CRUD module patterns & comprehensive code templates
6. **`.knowledge/sync-protocols.md`** - Documentation update requirements
7. **`docs/business-workflows.md`** - Business domain knowledge (if exists)

## 🤖 AGENT COORDINATION

### **Work Mode**: Sequential with VOA Agent
- **Task Source**: Pick up approved tasks from `.knowledge/task-management.md`
- **Consistency**: Follow same patterns as VOA Agent using `.knowledge/patterns-reference.md`
- **Updates**: Use same format for documentation updates (see sync-protocols.md)
- **Communication**: Use task-management.md for coordination and handoff messages

### **Before Starting Any Work:**
1. Read current-implementation.md to understand latest codebase state
2. Check task-management.md for approved tasks and VOA Agent progress
3. Review patterns-reference.md for established code templates
4. Ensure no conflicts with ongoing VOA Agent work

## 🎯 PROJECT CONTEXT - LCM SERVICE

### **Business Domain**
- **LCM System**: Loans/Debt Collection Management for Hoàn Kim Law Firm
- **Purpose**: Customer management, call tracking, contract handling, automation workflows
- **Industry**: Legal services with telecom integration
- **Users**: Law firm staff, call center operators, managers

### **Technical Architecture**
- **Framework**: NestJS (Node.js backend framework)
- **Language**: TypeScript with strict mode enabled
- **Database**: MongoDB with TypeORM
- **Authentication**: JWT + Basic Auth with role-based permissions (20+ services, complex resource permissions)
- **Process Management**: PM2 with 5 different services (API, file microservice, sync microservice, 2 workers)
- **Deployment**: Multi-VM production environment (10.10.0.70, 10.10.0.71, 10.10.0.72)

### **Codebase Structure**
```
src/
├── modules/                    # 20+ feature modules
│   ├── customer/              # Customer management
│   ├── call/                  # Call tracking  
│   ├── contract/              # Contract handling
│   ├── automation/            # Workflow automation
│   └── [other-modules]/       # Activity, performance, etc.
├── common/                    # Shared functionality
│   ├── modules/base/          # Base classes (Entity, Service, Controller)
│   ├── guards/auth/           # Authentication & authorization
│   ├── exceptions/            # Custom exception handling
│   ├── enums/                 # Permissions, resources, roles (complex system)
│   └── utils/                 # Helper functions
└── workers/                   # Background processing
```

## 🔧 CODING STANDARDS & PATTERNS

### **Module Development Pattern (MANDATORY)**
Follow this exact structure for any new modules:
```typescript
// 1. Entity (extends BaseEntity for id, timestamps, soft delete)
@Entity('[module-name]')
export class FeatureEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;
  // Additional fields...
}

// 2. DTOs with validation (create.dto.ts, find-one.dto.ts, update-one.dto.ts)
export class CreateFeatureDto {
  @ApiProperty({ description: 'Feature name' })
  @IsString()
  @MaxLength(255)
  name: string;
  // Additional fields with validation...
}

// 3. Service (extends BaseService for common CRUD)
@Injectable()
export class FeatureService extends BaseService<FeatureEntity> {
  protected entityClass = FeatureEntity;
  
  // Business logic methods...
}

// 4. Controller (extends BaseController for standard endpoints)
@Controller('features')
@UseGuards(AuthGuard)
export class FeatureController extends BaseController<FeatureEntity> {
  constructor(private readonly featureService: FeatureService) {
    super(featureService);
  }
  // Custom endpoints...
}

// 5. Module configuration
@Module({
  imports: [TypeOrmModule.forFeature([FeatureEntity])],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
```

### **Code Quality Requirements**
- **TypeScript Strict**: No `any` types, strict null checks
- **Validation**: All DTOs must use class-validator decorators
- **Authentication**: Use existing guard patterns (`@UseGuards(AuthGuard)`)
- **Permissions**: Follow complex role-based permission system in `common/enums/permissions/`
- **Exception Handling**: Use custom exceptions from `common/exceptions/`
- **Naming**: PascalCase classes, camelCase methods, kebab-case files

### **Business Logic Patterns**
- **Services**: Business logic goes in service layer, not controllers
- **Validation**: Complex validation in service methods with custom exceptions
- **Database**: Use repository pattern with TypeORM, prefer QueryBuilder for complex queries
- **Async/Await**: Always use async/await, handle errors properly
- **Soft Deletes**: Use soft delete pattern (deletedAt field) for important data

## 🚀 DEVELOPMENT WORKFLOW

### **Feature Development Process**
1. **Reference Check**: Review similar existing modules (customer, contract, call) for patterns
2. **Implementation Order**: Entity → DTOs → Service → Controller → Module → Tests
3. **Base Class Usage**: Always extend BaseEntity, BaseService, BaseController when applicable
4. **Permission Integration**: Add appropriate permissions from existing permission enums
5. **Testing**: Write unit tests for service business logic using Jest patterns

### **Code Review Self-Checklist**
- [ ] Follows established module structure pattern
- [ ] Extends base classes where appropriate
- [ ] DTOs have proper validation decorators
- [ ] Service methods include error handling
- [ ] Controller has authentication guards
- [ ] Permissions properly configured
- [ ] No `any` types in TypeScript
- [ ] Unit tests for business logic

## 📋 DECISION FRAMEWORK

### ✅ **Autonomous Development (No Approval Needed)**

#### **Standard CRUD Operations**
- Adding new modules following established patterns
- CRUD endpoints with standard authentication
- DTO validation rules following existing patterns
- Service methods with business logic
- Database queries and optimizations
- Unit test creation

#### **Code Quality & Maintenance**
- Bug fixes using established error handling patterns
- Performance optimizations (database queries, caching)
- Code refactoring maintaining existing APIs
- Documentation updates (module READMEs, inline docs)
- Linting and formatting improvements

#### **Development Operations**
- Local testing and validation
- Staging environment testing
- Build and compilation fixes
- Dependency updates (minor versions)

### 🚨 **Human Approval Required**

#### **Architecture & Security**
- Database schema changes affecting data integrity
- Authentication/authorization system modifications
- Permission system changes (roles, resources)
- External service integrations
- API breaking changes

#### **Production & Deployment**
- Production deployments (always require approval)
- PM2 service configuration changes
- Environment variable modifications
- Database migrations in production
- Infrastructure changes (Docker, nginx, VM config)

#### **Business Logic Changes**
- Contract calculation algorithms
- Customer workflow modifications
- Payment processing logic
- Legal compliance features
- Audit trail modifications

## 🔄 **Documentation Update Requirements (MANDATORY)**

After completing any work, update the following files using the formats specified in `.knowledge/sync-protocols.md`:

### **Always Update:**
- **`.knowledge/current-implementation.md`**: Add entry with date, files changed, patterns used, impact
- **`.knowledge/task-management.md`**: Mark progress/completion, add notes about implementation

### **Update When Applicable:**
- **`.knowledge/patterns-reference.md`**: Add new reusable code patterns
- **Module README.md**: Update module documentation for new features

### **Update Format Example:**
```markdown
**2025-01-17**: Implemented CustomerService validation enhancement
- Location: src/modules/customer/customer.service.ts
- Pattern: Business logic validation with custom exceptions
- Features: Email uniqueness check, phone number formatting
- Impact: Enhanced data integrity for customer creation
- Tests: Added unit tests for validation methods
```

## 🧪 **Testing Approach**

### **Unit Testing Requirements**
- Test all service business logic methods
- Use Jest framework with TypeORM testing utilities
- Mock external dependencies and database calls
- Follow AAA pattern (Arrange, Act, Assert)
- Achieve >80% coverage for new code

### **Testing Pattern Example**
```typescript
describe('FeatureService', () => {
  let service: FeatureService;
  let repository: Repository<FeatureEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FeatureService,
        { provide: getRepositoryToken(FeatureEntity), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<FeatureService>(FeatureService);
    repository = module.get<Repository<FeatureEntity>>(getRepositoryToken(FeatureEntity));
  });

  // Test cases following established patterns...
});
```

## 🔧 **Build & Deployment**

### **Local Development**
```bash
npm run start:dev          # Development with watch mode
npm run api               # API server mode
npm run ms:dev            # Microservice mode
npm run wrk:dev           # Worker mode
```

### **Build Validation**
```bash
npm run build             # Production build
npm run lint              # Code quality
npm test                  # Unit tests
npm run test:e2e          # Integration tests
```

### **Staging Deployment (Approved for Copilot)**
- Use deployment scripts in `/scripts/` directory
- Follow deployment guide for PM2 service management
- Verify health endpoints after deployment
- Monitor logs for issues

### **Production Deployment (Human Approval Required)**
- Always requires explicit human approval
- Use comprehensive deployment script with rollback capability
- Multi-VM deployment with health checks
- Backup and monitoring procedures

## 📊 **Performance & Monitoring**

### **Performance Guidelines**
- API responses <500ms for standard CRUD operations
- Database queries optimized with proper indexes
- Memory usage within PM2 limits (1GB API, 4GB workers)
- Proper error handling without crashing services

### **Monitoring Integration**
- Use existing health check endpoints
- Follow logging patterns for error tracking
- PM2 process monitoring compliance
- Resource usage awareness

---

## 💡 **Best Practices Summary**

1. **Always** read the knowledge base before starting work
2. **Follow** established patterns from patterns-reference.md
3. **Extend** base classes instead of creating from scratch
4. **Document** changes in current-implementation.md immediately
5. **Test** business logic with comprehensive unit tests
6. **Validate** with build, lint, and test commands before committing
7. **Coordinate** with VOA Agent through task-management.md
8. **Respect** human approval requirements for complex changes

---

**Knowledge Base Path**: `.knowledge/` directory in repository root  
**Last Updated**: 2025-01-17  
**Framework**: Dual-Agent Repository Maintenance  
**Coordination**: Sequential work with VOA Agent via shared knowledge base