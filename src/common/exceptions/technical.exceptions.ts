import { HttpStatus } from '@nestjs/common';
import { LCMBaseException } from './base.exception';

/**
 * Technical Exceptions for LCM Service
 * Handles system-level errors, infrastructure failures, and technical integration issues
 */

// ==========================
// DATABASE EXCEPTIONS
// ==========================

export class DatabaseConnectionException extends LCMBaseException {
  constructor(databaseType: string, connectionDetails: string, context?: Record<string, any>) {
    super(
      `Database connection failed: ${databaseType} - ${connectionDetails}`,
      'DATABASE_CONNECTION_ERROR',
      HttpStatus.SERVICE_UNAVAILABLE,
      'INFRASTRUCTURE',
      { databaseType, connectionDetails, ...context },
    );
  }
}

export class DatabaseQueryTimeoutException extends LCMBaseException {
  constructor(queryType: string, timeoutMs: number, context?: Record<string, any>) {
    super(
      `Database query timeout: ${queryType} exceeded ${timeoutMs}ms`,
      'DATABASE_QUERY_TIMEOUT',
      HttpStatus.REQUEST_TIMEOUT,
      'INFRASTRUCTURE',
      { queryType, timeoutMs, ...context },
    );
  }
}

export class DatabaseConstraintViolationException extends LCMBaseException {
  constructor(constraintName: string, operation: string, context?: Record<string, any>) {
    super(
      `Database constraint violation: ${constraintName} during ${operation}`,
      'DATABASE_CONSTRAINT_VIOLATION',
      HttpStatus.CONFLICT,
      'INFRASTRUCTURE',
      { constraintName, operation, ...context },
    );
  }
}

export class DatabaseIndexException extends LCMBaseException {
  constructor(indexName: string, operation: string, context?: Record<string, any>) {
    super(
      `Database index error: ${indexName} during ${operation}`,
      'DATABASE_INDEX_ERROR',
      HttpStatus.INTERNAL_SERVER_ERROR,
      'INFRASTRUCTURE',
      { indexName, operation, ...context },
    );
  }
}

// ==========================
// AMQP/MESSAGE QUEUE EXCEPTIONS
// ==========================

export class AMQPConnectionException extends LCMBaseException {
  constructor(brokerUrl: string, error: string, context?: Record<string, any>) {
    super(
      `AMQP connection failed to ${brokerUrl}: ${error}`,
      'AMQP_CONNECTION_ERROR',
      HttpStatus.SERVICE_UNAVAILABLE,
      'INFRASTRUCTURE',
      { brokerUrl, error, ...context },
    );
  }
}

export class QueueProcessingException extends LCMBaseException {
  constructor(queueName: string, messageId: string, error: string, context?: Record<string, any>) {
    super(
      `Queue processing failed for ${queueName}, message ${messageId}: ${error}`,
      'QUEUE_PROCESSING_ERROR',
      HttpStatus.INTERNAL_SERVER_ERROR,
      'INFRASTRUCTURE',
      { queueName, messageId, error, ...context },
    );
  }
}

export class MessageSerializationException extends LCMBaseException {
  constructor(messageType: string, error: string, context?: Record<string, any>) {
    super(
      `Message serialization failed for ${messageType}: ${error}`,
      'MESSAGE_SERIALIZATION_ERROR',
      HttpStatus.INTERNAL_SERVER_ERROR,
      'INFRASTRUCTURE',
      { messageType, error, ...context },
    );
  }
}

// ==========================
// EXTERNAL SERVICE EXCEPTIONS
// ==========================

export class ExternalServiceException extends LCMBaseException {
  constructor(serviceName: string, operation: string, statusCode: number, context?: Record<string, any>) {
    super(
      `External service error: ${serviceName} ${operation} returned ${statusCode}`,
      'EXTERNAL_SERVICE_ERROR',
      HttpStatus.BAD_GATEWAY,
      'INTEGRATION',
      { serviceName, operation, statusCode, ...context },
    );
  }
}

export class ExternalServiceTimeoutException extends LCMBaseException {
  constructor(serviceName: string, timeoutMs: number, context?: Record<string, any>) {
    super(
      `External service timeout: ${serviceName} exceeded ${timeoutMs}ms`,
      'EXTERNAL_SERVICE_TIMEOUT',
      HttpStatus.GATEWAY_TIMEOUT,
      'INTEGRATION',
      { serviceName, timeoutMs, ...context },
    );
  }
}

export class APIRateLimitException extends LCMBaseException {
  constructor(serviceName: string, limitType: string, resetTime: Date, context?: Record<string, any>) {
    super(
      `API rate limit exceeded for ${serviceName}: ${limitType}, resets at ${resetTime}`,
      'API_RATE_LIMIT_EXCEEDED',
      HttpStatus.TOO_MANY_REQUESTS,
      'INTEGRATION',
      { serviceName, limitType, resetTime, ...context },
    );
  }
}

// ==========================
// DIALER SYSTEM EXCEPTIONS
// ==========================

export class DialerSystemException extends LCMBaseException {
  constructor(dialerType: string, operation: string, error: string, context?: Record<string, any>) {
    super(
      `Dialer system error: ${dialerType} ${operation} - ${error}`,
      'DIALER_SYSTEM_ERROR',
      HttpStatus.BAD_GATEWAY,
      'CALL_INFRASTRUCTURE',
      { dialerType, operation, error, ...context },
    );
  }
}

export class DialerCampaignException extends LCMBaseException {
  constructor(campaignId: string, operation: string, error: string, context?: Record<string, any>) {
    super(
      `Dialer campaign error: ${campaignId} ${operation} - ${error}`,
      'DIALER_CAMPAIGN_ERROR',
      HttpStatus.BAD_REQUEST,
      'CALL_INFRASTRUCTURE',
      { campaignId, operation, error, ...context },
    );
  }
}

export class CallRecordingException extends LCMBaseException {
  constructor(callId: string, operation: string, error: string, context?: Record<string, any>) {
    super(
      `Call recording error for ${callId}: ${operation} - ${error}`,
      'CALL_RECORDING_ERROR',
      HttpStatus.INTERNAL_SERVER_ERROR,
      'CALL_INFRASTRUCTURE',
      { callId, operation, error, ...context },
    );
  }
}

// ==========================
// FILE PROCESSING EXCEPTIONS
// ==========================

export class FileProcessingException extends LCMBaseException {
  constructor(fileName: string, operation: string, error: string, context?: Record<string, any>) {
    super(
      `File processing error: ${fileName} ${operation} - ${error}`,
      'FILE_PROCESSING_ERROR',
      HttpStatus.BAD_REQUEST,
      'DATA_PROCESSING',
      { fileName, operation, error, ...context },
    );
  }
}

export class ExcelProcessingException extends LCMBaseException {
  constructor(fileName: string, sheetName: string, row: number, error: string, context?: Record<string, any>) {
    super(
      `Excel processing error: ${fileName}[${sheetName}] row ${row} - ${error}`,
      'EXCEL_PROCESSING_ERROR',
      HttpStatus.BAD_REQUEST,
      'DATA_PROCESSING',
      { fileName, sheetName, row, error, ...context },
    );
  }
}

export class FileUploadException extends LCMBaseException {
  constructor(fileName: string, fileSize: number, error: string, context?: Record<string, any>) {
    super(
      `File upload error: ${fileName} (${fileSize} bytes) - ${error}`,
      'FILE_UPLOAD_ERROR',
      HttpStatus.BAD_REQUEST,
      'DATA_PROCESSING',
      { fileName, fileSize, error, ...context },
    );
  }
}

export class FileSizeLimitException extends LCMBaseException {
  constructor(fileName: string, actualSize: number, maxSize: number, context?: Record<string, any>) {
    super(
      `File size limit exceeded: ${fileName} ${actualSize} bytes exceeds limit of ${maxSize} bytes`,
      'FILE_SIZE_LIMIT_EXCEEDED',
      HttpStatus.PAYLOAD_TOO_LARGE,
      'DATA_PROCESSING',
      { fileName, actualSize, maxSize, ...context },
    );
  }
}

// ==========================
// AUTHENTICATION & SECURITY EXCEPTIONS
// ==========================

export class AuthenticationFailedException extends LCMBaseException {
  constructor(reason: string, context?: Record<string, any>) {
    super(
      `Authentication failed: ${reason}`,
      'AUTHENTICATION_FAILED',
      HttpStatus.UNAUTHORIZED,
      'SECURITY',
      { reason, ...context },
    );
  }
}

export class TokenExpiredException extends LCMBaseException {
  constructor(tokenType: string, expiredAt: Date, context?: Record<string, any>) {
    super(
      `Token expired: ${tokenType} expired at ${expiredAt}`,
      'TOKEN_EXPIRED',
      HttpStatus.UNAUTHORIZED,
      'SECURITY',
      { tokenType, expiredAt, ...context },
    );
  }
}

export class InsufficientPermissionException extends LCMBaseException {
  constructor(userId: string, requiredPermission: string, operation: string, context?: Record<string, any>) {
    super(
      `Insufficient permission: User ${userId} lacks ${requiredPermission} for ${operation}`,
      'INSUFFICIENT_PERMISSION',
      HttpStatus.FORBIDDEN,
      'SECURITY',
      { userId, requiredPermission, operation, ...context },
    );
  }
}

export class SecurityViolationException extends LCMBaseException {
  constructor(violationType: string, userId: string, details: string, context?: Record<string, any>) {
    super(
      `Security violation: ${violationType} by user ${userId} - ${details}`,
      'SECURITY_VIOLATION',
      HttpStatus.FORBIDDEN,
      'SECURITY',
      { violationType, userId, details, ...context },
    );
  }
}

// ==========================
// SYSTEM RESOURCE EXCEPTIONS
// ==========================

export class MemoryLimitException extends LCMBaseException {
  constructor(operation: string, memoryUsed: number, memoryLimit: number, context?: Record<string, any>) {
    super(
      `Memory limit exceeded during ${operation}: ${memoryUsed}MB used, limit ${memoryLimit}MB`,
      'MEMORY_LIMIT_EXCEEDED',
      HttpStatus.SERVICE_UNAVAILABLE,
      'INFRASTRUCTURE',
      { operation, memoryUsed, memoryLimit, ...context },
    );
  }
}

export class ResourceUnavailableException extends LCMBaseException {
  constructor(resourceType: string, resourceId: string, reason: string, context?: Record<string, any>) {
    super(
      `Resource unavailable: ${resourceType} ${resourceId} - ${reason}`,
      'RESOURCE_UNAVAILABLE',
      HttpStatus.SERVICE_UNAVAILABLE,
      'INFRASTRUCTURE',
      { resourceType, resourceId, reason, ...context },
    );
  }
}

export class ConcurrencyLimitException extends LCMBaseException {
  constructor(operation: string, currentConnections: number, maxConnections: number, context?: Record<string, any>) {
    super(
      `Concurrency limit exceeded for ${operation}: ${currentConnections}/${maxConnections}`,
      'CONCURRENCY_LIMIT_EXCEEDED',
      HttpStatus.SERVICE_UNAVAILABLE,
      'INFRASTRUCTURE',
      { operation, currentConnections, maxConnections, ...context },
    );
  }
}

// ==========================
// CONFIGURATION EXCEPTIONS
// ==========================

export class ConfigurationException extends LCMBaseException {
  constructor(configKey: string, reason: string, context?: Record<string, any>) {
    super(
      `Configuration error: ${configKey} - ${reason}`,
      'CONFIGURATION_ERROR',
      HttpStatus.INTERNAL_SERVER_ERROR,
      'INFRASTRUCTURE',
      { configKey, reason, ...context },
    );
  }
}

export class EnvironmentVariableException extends LCMBaseException {
  constructor(variableName: string, context?: Record<string, any>) {
    super(
      `Required environment variable missing: ${variableName}`,
      'ENVIRONMENT_VARIABLE_MISSING',
      HttpStatus.INTERNAL_SERVER_ERROR,
      'INFRASTRUCTURE',
      { variableName, ...context },
    );
  }
}

// ==========================
// MIGRATION EXCEPTIONS
// ==========================

export class DataMigrationException extends LCMBaseException {
  constructor(migrationName: string, step: string, error: string, context?: Record<string, any>) {
    super(
      `Data migration failed: ${migrationName} at step ${step} - ${error}`,
      'DATA_MIGRATION_ERROR',
      HttpStatus.INTERNAL_SERVER_ERROR,
      'DATA_MIGRATION',
      { migrationName, step, error, ...context },
    );
  }
}

export class MigrationRollbackException extends LCMBaseException {
  constructor(migrationName: string, error: string, context?: Record<string, any>) {
    super(
      `Migration rollback failed: ${migrationName} - ${error}`,
      'MIGRATION_ROLLBACK_ERROR',
      HttpStatus.INTERNAL_SERVER_ERROR,
      'DATA_MIGRATION',
      { migrationName, error, ...context },
    );
  }
}