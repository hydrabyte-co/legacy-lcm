import { HttpStatus } from '@nestjs/common';
import { LCMBaseException } from './base.exception';

/**
 * Business Logic Exceptions for LCM Service
 * Handles debt collection business rule violations and domain-specific errors
 */

// ==========================
// PARTNER BUSINESS EXCEPTIONS
// ==========================

export class PartnerNotFoundException extends LCMBaseException {
  constructor(partnerId: string, context?: Record<string, any>) {
    super(
      `Partner with ID ${partnerId} not found`,
      'PARTNER_NOT_FOUND',
      HttpStatus.NOT_FOUND,
      'PARTNER_MANAGEMENT',
      { partnerId, ...context },
    );
  }
}

export class PartnerInactiveException extends LCMBaseException {
  constructor(partnerId: string, status: string, context?: Record<string, any>) {
    super(
      `Partner ${partnerId} is inactive with status: ${status}`,
      'PARTNER_INACTIVE',
      HttpStatus.BAD_REQUEST,
      'PARTNER_MANAGEMENT',
      { partnerId, currentStatus: status, ...context },
    );
  }
}

export class PartnerSLAViolationException extends LCMBaseException {
  constructor(partnerId: string, violationType: string, context?: Record<string, any>) {
    super(
      `Partner ${partnerId} SLA violation: ${violationType}`,
      'PARTNER_SLA_VIOLATION',
      HttpStatus.BAD_REQUEST,
      'PARTNER_MANAGEMENT',
      { partnerId, violationType, ...context },
    );
  }
}

// ==========================
// CUSTOMER BUSINESS EXCEPTIONS
// ==========================

export class CustomerNotFoundException extends LCMBaseException {
  constructor(customerId: string, context?: Record<string, any>) {
    super(
      `Customer with ID ${customerId} not found`,
      'CUSTOMER_NOT_FOUND',
      HttpStatus.NOT_FOUND,
      'CUSTOMER_MANAGEMENT',
      { customerId, ...context },
    );
  }
}

export class CustomerPrivacyViolationException extends LCMBaseException {
  constructor(customerId: string, violation: string, context?: Record<string, any>) {
    super(
      `Customer privacy violation for ${customerId}: ${violation}`,
      'CUSTOMER_PRIVACY_VIOLATION',
      HttpStatus.FORBIDDEN,
      'CUSTOMER_MANAGEMENT',
      { customerId, violationType: violation, ...context },
    );
  }
}

export class CustomerConsentRequiredException extends LCMBaseException {
  constructor(customerId: string, consentType: string, context?: Record<string, any>) {
    super(
      `Customer ${customerId} consent required for: ${consentType}`,
      'CUSTOMER_CONSENT_REQUIRED',
      HttpStatus.FORBIDDEN,
      'CUSTOMER_MANAGEMENT',
      { customerId, requiredConsent: consentType, ...context },
    );
  }
}

export class CustomerBlacklistedException extends LCMBaseException {
  constructor(customerId: string, reason: string, context?: Record<string, any>) {
    super(
      `Customer ${customerId} is blacklisted: ${reason}`,
      'CUSTOMER_BLACKLISTED',
      HttpStatus.FORBIDDEN,
      'CUSTOMER_MANAGEMENT',
      { customerId, blacklistReason: reason, ...context },
    );
  }
}

// ==========================
// CONTRACT BUSINESS EXCEPTIONS
// ==========================

export class ContractNotFoundException extends LCMBaseException {
  constructor(contractId: string, context?: Record<string, any>) {
    super(
      `Contract with ID ${contractId} not found`,
      'CONTRACT_NOT_FOUND',
      HttpStatus.NOT_FOUND,
      'CONTRACT_MANAGEMENT',
      { contractId, ...context },
    );
  }
}

export class ContractClosedException extends LCMBaseException {
  constructor(contractId: string, status: string, context?: Record<string, any>) {
    super(
      `Contract ${contractId} is closed with status: ${status}`,
      'CONTRACT_CLOSED',
      HttpStatus.BAD_REQUEST,
      'CONTRACT_MANAGEMENT',
      { contractId, contractStatus: status, ...context },
    );
  }
}

export class ContractBalanceException extends LCMBaseException {
  constructor(contractId: string, currentBalance: number, requiredBalance: number, context?: Record<string, any>) {
    super(
      `Contract ${contractId} balance error: current ${currentBalance}, required ${requiredBalance}`,
      'CONTRACT_BALANCE_ERROR',
      HttpStatus.BAD_REQUEST,
      'CONTRACT_MANAGEMENT',
      { contractId, currentBalance, requiredBalance, ...context },
    );
  }
}

export class ContractAssignmentException extends LCMBaseException {
  constructor(contractId: string, staffId: string, reason: string, context?: Record<string, any>) {
    super(
      `Contract ${contractId} cannot be assigned to staff ${staffId}: ${reason}`,
      'CONTRACT_ASSIGNMENT_ERROR',
      HttpStatus.BAD_REQUEST,
      'CONTRACT_MANAGEMENT',
      { contractId, staffId, reason, ...context },
    );
  }
}

// ==========================
// CALL SYSTEM EXCEPTIONS
// ==========================

export class CallSystemUnavailableException extends LCMBaseException {
  constructor(systemType: string, context?: Record<string, any>) {
    super(
      `Call system unavailable: ${systemType}`,
      'CALL_SYSTEM_UNAVAILABLE',
      HttpStatus.SERVICE_UNAVAILABLE,
      'CALL_MANAGEMENT',
      { systemType, ...context },
    );
  }
}

export class CallLimitExceededException extends LCMBaseException {
  constructor(customerId: string, dailyLimit: number, currentCount: number, context?: Record<string, any>) {
    super(
      `Daily call limit exceeded for customer ${customerId}: ${currentCount}/${dailyLimit}`,
      'CALL_LIMIT_EXCEEDED',
      HttpStatus.TOO_MANY_REQUESTS,
      'CALL_MANAGEMENT',
      { customerId, dailyLimit, currentCount, ...context },
    );
  }
}

export class CallTimeRestrictionException extends LCMBaseException {
  constructor(customerId: string, currentTime: string, allowedWindow: string, context?: Record<string, any>) {
    super(
      `Call time restriction for customer ${customerId}: current ${currentTime}, allowed ${allowedWindow}`,
      'CALL_TIME_RESTRICTION',
      HttpStatus.BAD_REQUEST,
      'CALL_MANAGEMENT',
      { customerId, currentTime, allowedWindow, ...context },
    );
  }
}

export class CallInProgressException extends LCMBaseException {
  constructor(customerId: string, activeCallId: string, context?: Record<string, any>) {
    super(
      `Call already in progress for customer ${customerId}: ${activeCallId}`,
      'CALL_IN_PROGRESS',
      HttpStatus.CONFLICT,
      'CALL_MANAGEMENT',
      { customerId, activeCallId, ...context },
    );
  }
}

// ==========================
// PAYMENT PROCESSING EXCEPTIONS
// ==========================

export class PaymentProcessingException extends LCMBaseException {
  constructor(transactionId: string, reason: string, context?: Record<string, any>) {
    super(
      `Payment processing failed for transaction ${transactionId}: ${reason}`,
      'PAYMENT_PROCESSING_ERROR',
      HttpStatus.BAD_REQUEST,
      'PAYMENT_PROCESSING',
      { transactionId, failureReason: reason, ...context },
    );
  }
}

export class PaymentAllocationException extends LCMBaseException {
  constructor(contractId: string, amount: number, reason: string, context?: Record<string, any>) {
    super(
      `Payment allocation failed for contract ${contractId}, amount ${amount}: ${reason}`,
      'PAYMENT_ALLOCATION_ERROR',
      HttpStatus.BAD_REQUEST,
      'PAYMENT_PROCESSING',
      { contractId, paymentAmount: amount, reason, ...context },
    );
  }
}

export class DuplicatePaymentException extends LCMBaseException {
  constructor(reference: string, originalTransactionId: string, context?: Record<string, any>) {
    super(
      `Duplicate payment detected with reference ${reference}, original transaction: ${originalTransactionId}`,
      'DUPLICATE_PAYMENT',
      HttpStatus.CONFLICT,
      'PAYMENT_PROCESSING',
      { paymentReference: reference, originalTransactionId, ...context },
    );
  }
}

export class InsufficientPaymentException extends LCMBaseException {
  constructor(contractId: string, minimumAmount: number, providedAmount: number, context?: Record<string, any>) {
    super(
      `Insufficient payment for contract ${contractId}: minimum ${minimumAmount}, provided ${providedAmount}`,
      'INSUFFICIENT_PAYMENT',
      HttpStatus.BAD_REQUEST,
      'PAYMENT_PROCESSING',
      { contractId, minimumAmount, providedAmount, ...context },
    );
  }
}

// ==========================
// STAFF & TEAM EXCEPTIONS
// ==========================

export class StaffNotFoundException extends LCMBaseException {
  constructor(staffId: string, context?: Record<string, any>) {
    super(
      `Staff member with ID ${staffId} not found`,
      'STAFF_NOT_FOUND',
      HttpStatus.NOT_FOUND,
      'STAFF_MANAGEMENT',
      { staffId, ...context },
    );
  }
}

export class StaffCaseloadExceededException extends LCMBaseException {
  constructor(staffId: string, currentLoad: number, maxLoad: number, context?: Record<string, any>) {
    super(
      `Staff ${staffId} caseload exceeded: ${currentLoad}/${maxLoad}`,
      'STAFF_CASELOAD_EXCEEDED',
      HttpStatus.BAD_REQUEST,
      'STAFF_MANAGEMENT',
      { staffId, currentLoad, maxLoad, ...context },
    );
  }
}

export class StaffPermissionException extends LCMBaseException {
  constructor(staffId: string, requiredPermission: string, context?: Record<string, any>) {
    super(
      `Staff ${staffId} lacks required permission: ${requiredPermission}`,
      'STAFF_PERMISSION_DENIED',
      HttpStatus.FORBIDDEN,
      'STAFF_MANAGEMENT',
      { staffId, requiredPermission, ...context },
    );
  }
}

export class TeamNotFoundException extends LCMBaseException {
  constructor(teamId: string, context?: Record<string, any>) {
    super(
      `Team with ID ${teamId} not found`,
      'TEAM_NOT_FOUND',
      HttpStatus.NOT_FOUND,
      'TEAM_MANAGEMENT',
      { teamId, ...context },
    );
  }
}

// ==========================
// DATA PROCESSING EXCEPTIONS
// ==========================

export class DataImportException extends LCMBaseException {
  constructor(fileName: string, errorDetails: string, context?: Record<string, any>) {
    super(
      `Data import failed for file ${fileName}: ${errorDetails}`,
      'DATA_IMPORT_ERROR',
      HttpStatus.BAD_REQUEST,
      'DATA_PROCESSING',
      { fileName, errorDetails, ...context },
    );
  }
}

export class DataValidationException extends LCMBaseException {
  constructor(fieldName: string, value: any, validationRule: string, context?: Record<string, any>) {
    super(
      `Data validation failed for field ${fieldName} with value "${value}": ${validationRule}`,
      'DATA_VALIDATION_ERROR',
      HttpStatus.BAD_REQUEST,
      'DATA_PROCESSING',
      { fieldName, invalidValue: value, validationRule, ...context },
    );
  }
}

export class DataIntegrityException extends LCMBaseException {
  constructor(entityType: string, entityId: string, integrityRule: string, context?: Record<string, any>) {
    super(
      `Data integrity violation for ${entityType} ${entityId}: ${integrityRule}`,
      'DATA_INTEGRITY_ERROR',
      HttpStatus.CONFLICT,
      'DATA_PROCESSING',
      { entityType, entityId, integrityRule, ...context },
    );
  }
}

// ==========================
// COMPLIANCE EXCEPTIONS
// ==========================

export class ComplianceViolationException extends LCMBaseException {
  constructor(violationType: string, regulation: string, details: string, context?: Record<string, any>) {
    super(
      `Compliance violation: ${violationType} under ${regulation} - ${details}`,
      'COMPLIANCE_VIOLATION',
      HttpStatus.FORBIDDEN,
      'COMPLIANCE',
      { violationType, regulation, details, ...context },
    );
  }
}

export class AuditTrailRequiredException extends LCMBaseException {
  constructor(operation: string, entityType: string, entityId: string, context?: Record<string, any>) {
    super(
      `Audit trail required for ${operation} on ${entityType} ${entityId}`,
      'AUDIT_TRAIL_REQUIRED',
      HttpStatus.FORBIDDEN,
      'COMPLIANCE',
      { operation, entityType, entityId, ...context },
    );
  }
}