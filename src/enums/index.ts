// =====================================================
// LCM SERVICE - GLOBAL ENUMS & CONSTANTS
// =====================================================
// Centralized enums và constants cho debt collection system
// Last Updated: 2025-01-17

// =====================================================
// COMMON STATUS ENUMS (Used across multiple modules)
// =====================================================

export enum CommonStatus {
  Active = 'active',
  Inactive = 'inactive',
  Suspended = 'suspended',
  Deleted = 'deleted',
}

export enum ProcessingStatus {
  Pending = 'pending',
  Processing = 'processing', 
  Completed = 'completed',
  Failed = 'failed',
  Cancelled = 'cancelled',
}

export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}

// =====================================================
// DEBT COLLECTION BUSINESS ENUMS
// =====================================================

export enum CustomerStatus {
  Active = 'active',
  Inactive = 'inactive', 
  Collection = 'collection',
  Legal = 'legal',
  Resolved = 'resolved',
  WrittenOff = 'written-off',
  Closed = 'closed',
}

export enum ContractStatus {
  Active = 'active',
  Overdue = 'overdue',
  Collection = 'collection',
  Legal = 'legal',
  Paid = 'paid',
  Settled = 'settled',
  WrittenOff = 'written-off',
  Closed = 'closed',
}

export enum CallType {
  ClickToCall = 'click-to-call',
  AutoCall = 'auto-call',
  AutoDialer = 'auto-dialer',
}

export enum CallStatus {
  Queued = 'queued',
  Dialing = 'dialing',
  Ringing = 'ringing',
  Connected = 'connected',
  Completed = 'completed',
  Failed = 'failed',
  NoAnswer = 'no-answer',
  Busy = 'busy',
  Cancelled = 'cancelled',
}

export enum CallResult {
  // Positive outcomes
  PromiseToPay = 'promise-to-pay',
  PartialPayment = 'partial-payment', 
  PaymentArrangement = 'payment-arrangement',
  
  // Neutral outcomes
  ContactMade = 'contact-made',
  InfoUpdate = 'info-update',
  CallBack = 'call-back',
  
  // Negative outcomes
  Refused = 'refused',
  Dispute = 'dispute',
  Hostile = 'hostile',
  
  // Technical outcomes
  NoAnswer = 'no-answer',
  Busy = 'busy',
  InvalidNumber = 'invalid-number',
  TechnicalError = 'technical-error',
}

export enum TransactionType {
  Payment = 'payment',
  Refund = 'refund',
  Adjustment = 'adjustment',
  Fee = 'fee',
  Interest = 'interest',
  Penalty = 'penalty',
  WriteOff = 'write-off',
}

export enum PaymentMethod {
  BankTransfer = 'bank-transfer',
  ATMCard = 'atm-card',
  CreditCard = 'credit-card',
  EWallet = 'e-wallet',
  Cash = 'cash',
  Cheque = 'cheque',
}

export enum ActivityType {
  Call = 'call',
  Visit = 'visit',
  Email = 'email',
  SMS = 'sms',
  Letter = 'letter',
  Payment = 'payment',
  Legal = 'legal',
  Investigation = 'investigation',
  System = 'system',
}

// =====================================================
// ORGANIZATION & STAFF ENUMS  
// =====================================================

export enum StaffRole {
  CallAgent = 'call-agent',
  FieldAgent = 'field-agent', 
  TeamLeader = 'team-leader',
  Manager = 'manager',
  Admin = 'admin',
  SupervisorCall = 'supervisor-call',
  SupervisorField = 'supervisor-field',
}

export enum TeamType {
  CallCenter = 'call-center',
  FieldCollection = 'field-collection',
  Legal = 'legal',
  Investigation = 'investigation',
  Management = 'management',
}

// Legacy enums (kept for compatibility)
export enum TaskStatuses {
  Todo = 'todo',
  Done = 'done', 
  Canceled = 'canceled',
}

export enum TeamStatuses {
  Active = 'active',
  Inactive = 'inactive',
}

// =====================================================
// DATA PROCESSING ENUMS
// =====================================================

export enum ImportDataStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed', 
  Failed = 'failed',
  PartialSuccess = 'partial-success',
}

export enum DataMigrationType {
  Customer = 'customer',
  Contract = 'contract',
  Payment = 'payment',
  Activity = 'activity',
  Full = 'full',
}

export enum ReportType {
  Performance = 'performance',
  Collection = 'collection',
  Financial = 'financial',
  Regulatory = 'regulatory',
  Partner = 'partner',
  Custom = 'custom',
}

export enum ReportFormat {
  Excel = 'excel',
  PDF = 'pdf',
  CSV = 'csv',
  JSON = 'json',
}

// =====================================================
// SYSTEM & INTEGRATION ENUMS
// =====================================================

export enum EventType {
  System = 'system',
  Business = 'business',
  Integration = 'integration',
  Notification = 'notification',
  Audit = 'audit',
}

export enum EventPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high', 
  Critical = 'critical',
}

export enum EventStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
  Retrying = 'retrying',
}

// =====================================================
// BUSINESS CONSTANTS
// =====================================================

export const DEBT_COLLECTION_CONSTANTS = {
  // Financial limits (in VND)
  AMOUNTS: {
    MIN_PAYMENT: 1000,                    // 1,000 VND minimum payment
    MAX_TRANSACTION: 10000000000,         // 10B VND maximum per transaction
    MIN_DEBT_COLLECTION: 10000,           // 10,000 VND minimum debt for collection
    HIGH_VALUE_THRESHOLD: 100000000,      // 100M VND high-value debt threshold
  },
  
  // Time limits
  TIME: {
    CALL_TIMEOUT: 300,                    // 5 minutes call timeout
    MAX_DAILY_CALLS_PER_CUSTOMER: 3,     // Maximum calls per day per customer
    OVERDUE_GRACE_PERIOD_DAYS: 7,        // 7 days grace period before collection
    LEGAL_ACTION_THRESHOLD_DAYS: 90,     // 90 days before legal action
  },
  
  // Call system limits
  CALL_SYSTEM: {
    WORKING_HOURS_START: 8,               // 8 AM start time
    WORKING_HOURS_END: 21,                // 9 PM end time
    MAX_QUEUE_SIZE: 10000,                // Maximum call queue size
    MAX_RETRY_ATTEMPTS: 3,                // Maximum call retry attempts
  },
  
  // Data processing limits
  DATA_PROCESSING: {
    MAX_BULK_IMPORT_RECORDS: 10000,       // Maximum records per bulk import
    MAX_REPORT_RECORDS: 100000,           // Maximum records per report
    BATCH_SIZE: 1000,                     // Standard batch processing size
    MAX_FILE_SIZE_MB: 50,                 // Maximum file upload size
  },
  
  // Performance targets
  PERFORMANCE_TARGETS: {
    API_RESPONSE_TIME_MS: 300,            // Target API response time
    DATABASE_QUERY_TIME_MS: 100,          // Target DB query time
    BULK_PROCESSING_RECORDS_PER_SEC: 100, // Target bulk processing rate
    CALL_CONNECTION_TIME_S: 3,            // Target call connection time
  },
  
  // Business rules
  BUSINESS_RULES: {
    DEFAULT_INTEREST_RATE: 18.0,          // Default annual interest rate (%)
    DEFAULT_PENALTY_RATE: 24.0,           // Default penalty rate (%)
    MAX_CUSTOMER_PRIORITY: 5,             // Highest priority level
    MIN_CUSTOMER_PRIORITY: 1,             // Lowest priority level
  },
} as const;

// =====================================================
// ERROR CODES & MESSAGES
// =====================================================

export enum ErrorCode {
  // General errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  
  // Business errors
  CUSTOMER_NOT_FOUND = 'CUSTOMER_NOT_FOUND',
  CONTRACT_NOT_ACTIVE = 'CONTRACT_NOT_ACTIVE', 
  PAYMENT_AMOUNT_INVALID = 'PAYMENT_AMOUNT_INVALID',
  CALL_TIME_RESTRICTED = 'CALL_TIME_RESTRICTED',
  PARTNER_INACTIVE = 'PARTNER_INACTIVE',
  
  // System errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  QUEUE_FULL = 'QUEUE_FULL',
  FILE_PROCESSING_ERROR = 'FILE_PROCESSING_ERROR',
}

// =====================================================
// MODULE MAPPING (for agent reference)
// =====================================================

export const LCM_MODULES = {
  CORE_BUSINESS: [
    'partner', 'customer', 'contract', 'call', 'activity', 'transaction'
  ],
  MANAGEMENT: [
    'staff', 'team', 'task', 'performance', 'report', 'result'
  ],
  DATA_OPERATIONS: [
    'data-migration', 'import-data', 'export-data', 'data-handler'
  ],
  SUPPORT: [
    'investigation', 'reference', 'event', 'utils'
  ]
} as const;

// =====================================================
// TYPE EXPORTS (for TypeScript support)
// =====================================================

export type LCMModule = typeof LCM_MODULES[keyof typeof LCM_MODULES][number];
export type DebtCollectionConstant = typeof DEBT_COLLECTION_CONSTANTS;
export type LCMErrorCode = keyof typeof ErrorCode;
