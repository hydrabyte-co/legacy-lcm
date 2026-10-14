/**
 * LCM Service Exception Classes
 * Centralized export for all custom exception classes
 */

// Base Exception
export { LCMBaseException, GenericLCMException } from './base.exception';

// Import for internal use
import { LCMBaseException, GenericLCMException } from './base.exception';
import {
  PartnerNotFoundException,
  CustomerNotFoundException, 
  ContractNotFoundException,
  StaffNotFoundException,
  TeamNotFoundException,
  DataValidationException,
  PaymentProcessingException,
  CallSystemUnavailableException
} from './business.exceptions';
import {
  InsufficientPermissionException,
  ExternalServiceException,
  DialerSystemException,
  DatabaseQueryTimeoutException,
  DatabaseConnectionException,
  DatabaseConstraintViolationException
} from './technical.exceptions';

// Business Exceptions - Debt Collection Domain Logic
export {
  // Partner Management
  PartnerNotFoundException,
  PartnerInactiveException,
  PartnerSLAViolationException,
  
  // Customer Management
  CustomerNotFoundException,
  CustomerPrivacyViolationException,
  CustomerConsentRequiredException,
  CustomerBlacklistedException,
  
  // Contract Management
  ContractNotFoundException,
  ContractClosedException,
  ContractBalanceException,
  ContractAssignmentException,
  
  // Call System
  CallSystemUnavailableException,
  CallLimitExceededException,
  CallTimeRestrictionException,
  CallInProgressException,
  
  // Payment Processing
  PaymentProcessingException,
  PaymentAllocationException,
  DuplicatePaymentException,
  InsufficientPaymentException,
  
  // Staff & Team Management
  StaffNotFoundException,
  StaffCaseloadExceededException,
  StaffPermissionException,
  TeamNotFoundException,
  
  // Data Processing
  DataImportException,
  DataValidationException,
  DataIntegrityException,
  
  // Compliance
  ComplianceViolationException,
  AuditTrailRequiredException,
} from './business.exceptions';

// Technical Exceptions - System Infrastructure
export {
  // Database
  DatabaseConnectionException,
  DatabaseQueryTimeoutException,
  DatabaseConstraintViolationException,
  DatabaseIndexException,
  
  // AMQP/Message Queue
  AMQPConnectionException,
  QueueProcessingException,
  MessageSerializationException,
  
  // External Services
  ExternalServiceException,
  ExternalServiceTimeoutException,
  APIRateLimitException,
  
  // Dialer System
  DialerSystemException,
  DialerCampaignException,
  CallRecordingException,
  
  // File Processing
  FileProcessingException,
  ExcelProcessingException,
  FileUploadException,
  FileSizeLimitException,
  
  // Authentication & Security
  AuthenticationFailedException,
  TokenExpiredException,
  InsufficientPermissionException,
  SecurityViolationException,
  
  // System Resources
  MemoryLimitException,
  ResourceUnavailableException,
  ConcurrencyLimitException,
  
  // Configuration
  ConfigurationException,
  EnvironmentVariableException,
  
  // Migration
  DataMigrationException,
  MigrationRollbackException,
} from './technical.exceptions';

/**
 * Exception Factory Functions
 * Helper functions to create common exceptions with standardized context
 */

export class LCMExceptionFactory {
  /**
   * Create entity not found exception
   */
  static entityNotFound(entityType: string, entityId: string, context?: Record<string, any>) {
    switch (entityType.toLowerCase()) {
      case 'partner':
        return new PartnerNotFoundException(entityId, context);
      case 'customer':
        return new CustomerNotFoundException(entityId, context);
      case 'contract':
        return new ContractNotFoundException(entityId, context);
      case 'staff':
        return new StaffNotFoundException(entityId, context);
      case 'team':
        return new TeamNotFoundException(entityId, context);
      default:
        return new GenericLCMException(
          `${entityType} with ID ${entityId} not found`,
          'ENTITY_NOT_FOUND',
          404,
          'GENERAL',
          { entityType, entityId, ...context },
        );
    }
  }

  /**
   * Create permission denied exception
   */
  static permissionDenied(userId: string, requiredPermission: string, operation: string, context?: Record<string, any>) {
    return new InsufficientPermissionException(userId, requiredPermission, operation, context);
  }

  /**
   * Create data validation exception
   */
  static dataValidation(fieldName: string, value: any, validationRule: string, context?: Record<string, any>) {
    return new DataValidationException(fieldName, value, validationRule, context);
  }

  /**
   * Create external service exception
   */
  static externalService(serviceName: string, operation: string, statusCode: number, context?: Record<string, any>) {
    return new ExternalServiceException(serviceName, operation, statusCode, context);
  }

  /**
   * Create payment processing exception
   */
  static paymentProcessing(transactionId: string, reason: string, context?: Record<string, any>) {
    return new PaymentProcessingException(transactionId, reason, context);
  }

  /**
   * Create call system exception
   */
  static callSystem(systemType: string, operation: string, error: string, context?: Record<string, any>) {
    if (operation === 'unavailable') {
      return new CallSystemUnavailableException(systemType, context);
    }
    return new DialerSystemException(systemType, operation, error, context);
  }

  /**
   * Create database exception
   */
  static database(operation: string, error: string, context?: Record<string, any>) {
    if (error.includes('timeout')) {
      const timeoutMs = context?.timeoutMs || 30000;
      return new DatabaseQueryTimeoutException(operation, timeoutMs, context);
    }
    if (error.includes('connection')) {
      const dbType = context?.databaseType || 'MongoDB';
      return new DatabaseConnectionException(dbType, error, context);
    }
    if (error.includes('constraint')) {
      const constraintName = context?.constraintName || 'unknown';
      return new DatabaseConstraintViolationException(constraintName, operation, context);
    }
    return new GenericLCMException(
      `Database error during ${operation}: ${error}`,
      'DATABASE_ERROR',
      500,
      'INFRASTRUCTURE',
      { operation, error, ...context },
    );
  }
}