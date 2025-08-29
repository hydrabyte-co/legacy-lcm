/**
 * Test Utils Index
 * Centralized exports for all testing utilities
 */

export { MockDataGenerator } from './mock-data.generator';
export { TestDatabaseHelper } from './test-database.helper';
export { ServiceTestTemplate } from './unit-test.template';

// Re-export commonly used testing utilities
export const TestUtils = {
  MockDataGenerator,
  TestDatabaseHelper,
  ServiceTestTemplate
};

// Test configuration constants
export const TEST_CONFIG = {
  // Database timeouts
  DB_TIMEOUT: 30000,
  
  // Test data limits
  BULK_TEST_LIMIT: 1000,
  PERFORMANCE_TEST_LIMIT: 5000,
  
  // Test identifiers
  TEST_PREFIX: 'TEST_',
  TEST_SUFFIX: '_test',
  
  // Test scenarios
  SCENARIOS: {
    DEBT_COLLECTION: 'debt_collection',
    PAYMENT_PROCESSING: 'payment_processing',
    CALL_MANAGEMENT: 'call_management',
    PERFORMANCE_TESTING: 'performance_testing'
  }
};

// Common test assertions
export const COMMON_ASSERTIONS = {
  // Entity existence
  ENTITY_EXISTS: (entity: any) => {
    expect(entity).toBeDefined();
    expect(entity).not.toBeNull();
    expect(entity.id).toBeDefined();
  },
  
  // Code format validation
  VALID_CODE_FORMAT: (code: string, prefix: string) => {
    expect(code).toBeDefined();
    expect(code).toMatch(new RegExp(`^${prefix}\\d+`));
  },
  
  // Date validation
  VALID_DATE: (date: any) => {
    expect(date).toBeDefined();
    expect(new Date(date).getTime()).not.toBeNaN();
  },
  
  // Amount validation (for financial data)
  VALID_AMOUNT: (amount: number) => {
    expect(amount).toBeDefined();
    expect(typeof amount).toBe('number');
    expect(amount).toBeGreaterThanOrEqual(0);
  },
  
  // Status validation
  VALID_STATUS: (status: string, validStatuses: string[]) => {
    expect(status).toBeDefined();
    expect(validStatuses).toContain(status);
  }
};

// Test data validation helpers
export const VALIDATION_HELPERS = {
  // Validate debt collection business rules
  validateDebtCollectionRules: (customer: any, contract: any) => {
    // Customer must be active for debt collection
    expect(customer.status).toBe('active');
    
    // Contract must have overdue amount for collection
    expect(contract.overdueAmount).toBeGreaterThan(0);
    
    // Contract must be active or overdue
    expect(['active', 'overdue']).toContain(contract.status);
  },
  
  // Validate partner relationship integrity
  validatePartnerRelationships: (partner: any, customers: any[], contracts: any[]) => {
    // All customers must belong to partner
    customers.forEach(customer => {
      expect(customer.partnerCode).toBe(partner.code);
    });
    
    // All contracts must belong to partner
    contracts.forEach(contract => {
      expect(contract.partnerCode).toBe(partner.code);
    });
  },
  
  // Validate call system data
  validateCallData: (call: any, customer: any, staff: any) => {
    expect(call.customerCode).toBe(customer.code);
    expect(call.staffCode).toBe(staff.code);
    expect(call.phoneNumber).toBeDefined();
    expect(['click-to-call', 'auto-call', 'auto-dialer']).toContain(call.callType);
  },
  
  // Validate transaction data
  validateTransactionData: (transaction: any, customer: any, contract: any) => {
    expect(transaction.customerCode).toBe(customer.code);
    expect(transaction.contractCode).toBe(contract.code);
    expect(transaction.amount).toBeGreaterThan(0);
    expect(['payment', 'adjustment', 'fee']).toContain(transaction.transactionType);
  }
};