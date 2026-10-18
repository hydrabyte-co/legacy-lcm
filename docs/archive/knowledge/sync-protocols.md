# Documentation Sync Protocols

## 🔄 UPDATE RESPONSIBILITIES

### **After Code Changes - MANDATORY UPDATES:**

1. **current-implementation.md** - ALWAYS update after any code changes
   - **Format**: Add entry to "Recent Changes Log" section
   - **Content**: Date, files changed, patterns used, impact description
   - **Example**:
     ```markdown
     **2025-01-17**: Added CustomerService validation logic
     - Location: src/modules/customer/customer.service.ts  
     - Pattern: Business logic validation in service layer
     - Features: Email uniqueness validation, phone number formatting
     - Impact: Enhanced data integrity for customer creation
     ```

2. **patterns-reference.md** - Update when new patterns are established
   - **Trigger**: New reusable code patterns created
   - **Content**: Add new pattern with complete code example
   - **Categories**: Module structure, validation, business logic, etc.

3. **task-management.md** - Update task progress and completion
   - **Trigger**: Task started, progress made, or completed
   - **Format**: Update progress percentages, mark completed tasks
   - **Add new tasks**: When discovering sub-tasks during implementation

### **After Architecture Changes - FLAG FOR HUMAN REVIEW:**

1. **agent-coding-guide.md** - Core instruction changes
   - **Trigger**: New technology introduced, major pattern changes
   - **Process**: Flag for human review before updating
   - **Content**: Framework guidelines, decision frameworks

2. **deployment-guide.md** - Infrastructure changes
   - **Trigger**: New deployment steps, environment changes
   - **Process**: Test changes before documenting
   - **Content**: Build commands, deployment steps, monitoring

## 🚨 VALIDATION RULES

### **Documentation-Code Consistency:**
- Every commit with code changes MUST include documentation update
- Flag any inconsistencies between documentation and actual code
- Regular consistency checks (weekly)

### **Update Format Standards:**

#### **current-implementation.md Updates:**
```markdown
**[DATE]**: [Brief description of change]
- Location: [Specific file paths]
- Pattern: [Which established pattern was followed]
- Features: [New capabilities added]
- Impact: [Effect on system/users]
- Tests: [Testing status - passed/failed]
- Deploy: [Deployment status if applicable]
```

#### **task-management.md Updates:**
```markdown
- [x] **Subtask X.Y**: [Description] 
  - **Completed**: [Date and time]
  - **Files affected**: [List of modified files]
  - **Pattern followed**: [Reference to pattern used]
  - **Testing**: [Unit tests added/modified]
  - **Notes**: [Any issues or learnings]
```

## 📋 AGENT SYNCHRONIZATION PROTOCOLS

### **VOA Agent Update Process:**
1. **Before starting work**: Read current-implementation.md for latest state
2. **During work**: Update task-management.md with progress
3. **After completing work**: Update current-implementation.md with changes
4. **Pattern compliance**: Reference patterns-reference.md for consistency

### **Copilot Update Process:**
1. **Session start**: Review .knowledge/ files for current context
2. **Follow same patterns**: Use identical update formats as VOA Agent
3. **Cross-reference work**: Check what VOA Agent completed recently
4. **Maintain consistency**: Use same architectural patterns and naming

### **Human Review Triggers:**
- Architecture guide modifications
- New deployment procedures
- Security-related changes
- Cross-module dependencies
- Breaking changes to APIs
- Database schema modifications

## 🔍 CONSISTENCY CHECKING

### **Weekly Validation Checklist:**
- [ ] Code matches patterns in patterns-reference.md
- [ ] current-implementation.md reflects actual codebase state
- [ ] All completed tasks marked in task-management.md
- [ ] Deployment guide matches actual scripts and procedures
- [ ] No outdated information in any knowledge files

### **Automated Consistency Checks:**
```bash
# Check if build still works with documented commands
npm run build
npm test
npm run lint

# Verify deployment scripts match documentation
./scripts/deploy-production.sh --dry-run

# Check PM2 configuration matches docs
pm2 ecosystem ecosystem.config.js --only lcm-api --dry
```

### **Manual Review Points:**
- **Code Pattern Compliance**: Do new modules follow established patterns?
- **Documentation Completeness**: Are all new features documented?
- **Deployment Accuracy**: Do deployment docs match actual scripts?
- **Task Tracking**: Are all tasks properly tracked and updated?

## ⚠️ CONFLICT RESOLUTION

### **When Documentation Conflicts with Code:**
1. **Immediate Action**: Flag the conflict in task-management.md
2. **Investigation**: Determine which is correct (code or docs)
3. **Resolution**: Update the incorrect source
4. **Prevention**: Document the lesson learned

### **When Agents Have Conflicting Updates:**
1. **Last Writer Wins**: Later update takes precedence
2. **Merge Conflicts**: Human intervention required
3. **Communication**: Use task-management.md for coordination
4. **Resolution**: Clear task assignment to prevent overlap

## 📊 UPDATE FREQUENCY GUIDELINES

### **Real-time Updates (Immediate):**
- current-implementation.md after code changes
- task-management.md progress updates
- Error/blocker notifications

### **Daily Updates:**
- Task completion status
- Build/test results
- Deployment status

### **Weekly Updates:**
- patterns-reference.md with new patterns
- Consistency validation
- Knowledge base health check

### **Monthly Reviews:**
- agent-coding-guide.md optimization
- deployment-guide.md updates
- Overall framework effectiveness

## 🔧 TOOLING AND AUTOMATION

### **Recommended Update Tools:**
- **Git hooks**: Pre-commit checks for documentation updates
- **Scripts**: Automated timestamp and formatting
- **Templates**: Standard update formats in task-management

### **Update Templates:**

#### **Code Change Template:**
```bash
# After any code modification, add to current-implementation.md:
echo "**$(date +%Y-%m-%d)**: [DESCRIPTION]
- Location: [FILES]
- Pattern: [PATTERN_USED]  
- Features: [NEW_CAPABILITIES]
- Impact: [SYSTEM_EFFECT]" >> .knowledge/current-implementation.md
```

#### **Task Completion Template:**
```bash
# Mark task complete in task-management.md:
# Replace [ ] with [x] for completed task
# Add completion details with timestamp
```

## 🎯 SUCCESS METRICS

### **Documentation Quality Indicators:**
- **Freshness**: Current-implementation.md updated within 24h of code changes
- **Accuracy**: Documentation matches actual codebase 100%
- **Completeness**: All features documented within 48h of implementation
- **Consistency**: Both agents follow identical update formats

### **Agent Coordination Metrics:**
- **Conflict Rate**: <5% of updates require conflict resolution
- **Response Time**: Documentation updates within 1 hour of code changes
- **Pattern Compliance**: >95% of code follows documented patterns
- **Task Completion**: >90% of tasks completed within estimated timeframes

---

**Last Updated**: 2025-01-17  
**Updated By**: Workspace Manager  
**Next Review**: Weekly (every Monday)  
**Compliance Status**: Framework established, ready for agent integration