import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LCMBaseException } from '../exceptions/base.exception';

/**
 * Global Exception Filter for LCM Service
 * Handles all exceptions with standardized error responses and comprehensive logging
 */
@Catch()
export class LCMExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LCMExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request);
    
    // Log the exception with appropriate level
    this.logException(exception, request, errorResponse);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  /**
   * Build standardized error response
   */
  private buildErrorResponse(exception: unknown, request: Request): ErrorResponse {
    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;
    const userAgent = request.get('User-Agent') || 'Unknown';
    const requestId = request.headers['x-request-id'] as string || this.generateRequestId();

    // Handle LCM custom exceptions
    if (exception instanceof LCMBaseException) {
      return {
        statusCode: exception.getStatus(),
        timestamp,
        path,
        method,
        requestId,
        error: {
          code: exception.errorCode,
          message: exception.message,
          businessDomain: exception.businessDomain,
          details: this.sanitizeContext(exception.context),
        },
        metadata: {
          userAgent,
          processingTime: this.calculateProcessingTime(request),
        },
      };
    }

    // Handle standard HTTP exceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      
      return {
        statusCode: status,
        timestamp,
        path,
        method,
        requestId,
        error: {
          code: this.getErrorCodeFromStatus(status),
          message: typeof response === 'string' ? response : (response as any).message || exception.message,
          businessDomain: 'GENERAL',
          details: typeof response === 'object' ? response : undefined,
        },
        metadata: {
          userAgent,
          processingTime: this.calculateProcessingTime(request),
        },
      };
    }

    // Handle unexpected errors
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp,
      path,
      method,
      requestId,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        businessDomain: 'SYSTEM',
        details: process.env.NODE_ENV === 'development' ? {
          originalError: exception instanceof Error ? exception.message : String(exception),
          stack: exception instanceof Error ? exception.stack : undefined,
        } : undefined,
      },
      metadata: {
        userAgent,
        processingTime: this.calculateProcessingTime(request),
      },
    };
  }

  /**
   * Log exception with appropriate level and context
   */
  private logException(exception: unknown, request: Request, errorResponse: ErrorResponse): void {
    const logContext = {
      requestId: errorResponse.requestId,
      method: request.method,
      path: request.url,
      statusCode: errorResponse.statusCode,
      userAgent: request.get('User-Agent'),
      userId: this.extractUserId(request),
      ip: request.ip,
      businessDomain: errorResponse.error.businessDomain,
    };

    // Determine log level based on error type and severity
    const logLevel = this.determineLogLevel(exception, errorResponse.statusCode);
    const message = `${errorResponse.error.code}: ${errorResponse.error.message}`;

    switch (logLevel) {
      case 'error':
        this.logger.error(message, exception instanceof Error ? exception.stack : undefined, logContext);
        break;
      case 'warn':
        this.logger.warn(message, logContext);
        break;
      case 'debug':
        this.logger.debug(message, logContext);
        break;
      default:
        this.logger.log(message, logContext);
    }

    // Special handling for business-critical errors
    if (this.isCriticalBusinessError(exception)) {
      this.handleCriticalBusinessError(exception, request, errorResponse);
    }

    // Special handling for security violations
    if (this.isSecurityViolation(exception)) {
      this.handleSecurityViolation(exception, request, errorResponse);
    }
  }

  /**
   * Determine appropriate log level
   */
  private determineLogLevel(exception: unknown, statusCode: number): string {
    // Security violations and critical business errors
    if (this.isSecurityViolation(exception) || this.isCriticalBusinessError(exception)) {
      return 'error';
    }

    // Server errors (5xx)
    if (statusCode >= 500) {
      return 'error';
    }

    // Client errors (4xx) but not validation errors
    if (statusCode >= 400 && statusCode !== 400 && statusCode !== 422) {
      return 'warn';
    }

    // Validation errors and bad requests
    if (statusCode === 400 || statusCode === 422) {
      return 'debug';
    }

    return 'log';
  }

  /**
   * Check if exception is a critical business error
   */
  private isCriticalBusinessError(exception: unknown): boolean {
    if (!(exception instanceof LCMBaseException)) {
      return false;
    }

    const criticalDomains = [
      'PAYMENT_PROCESSING',
      'CUSTOMER_MANAGEMENT',
      'CONTRACT_MANAGEMENT',
      'COMPLIANCE',
    ];

    const criticalErrorCodes = [
      'PAYMENT_PROCESSING_ERROR',
      'DUPLICATE_PAYMENT',
      'CUSTOMER_PRIVACY_VIOLATION',
      'CONTRACT_BALANCE_ERROR',
      'COMPLIANCE_VIOLATION',
      'DATA_INTEGRITY_ERROR',
    ];

    return criticalDomains.includes(exception.businessDomain) || 
           criticalErrorCodes.includes(exception.errorCode);
  }

  /**
   * Check if exception is a security violation
   */
  private isSecurityViolation(exception: unknown): boolean {
    if (!(exception instanceof LCMBaseException)) {
      return false;
    }

    return exception.businessDomain === 'SECURITY' || 
           exception.errorCode.includes('SECURITY_VIOLATION') ||
           exception.errorCode.includes('AUTHENTICATION_FAILED') ||
           exception.errorCode.includes('PERMISSION_DENIED');
  }

  /**
   * Handle critical business errors with special processing
   */
  private handleCriticalBusinessError(exception: unknown, request: Request, errorResponse: ErrorResponse): void {
    // Log to audit trail
    this.logger.error(`CRITICAL BUSINESS ERROR: ${errorResponse.error.code}`, {
      exception: exception instanceof LCMBaseException ? exception.getErrorDetails() : exception,
      request: {
        method: request.method,
        url: request.url,
        userId: this.extractUserId(request),
        ip: request.ip,
        timestamp: new Date().toISOString(),
      },
      severity: 'CRITICAL',
      requiresAction: true,
    });

    // TODO: Implement alerting mechanism for critical errors
    // - Send notification to CEO Tony
    // - Create incident ticket
    // - Trigger monitoring alerts
  }

  /**
   * Handle security violations with enhanced logging
   */
  private handleSecurityViolation(exception: unknown, request: Request, errorResponse: ErrorResponse): void {
    this.logger.error(`SECURITY VIOLATION: ${errorResponse.error.code}`, {
      securityEvent: true,
      exception: exception instanceof LCMBaseException ? exception.getErrorDetails() : exception,
      request: {
        method: request.method,
        url: request.url,
        userId: this.extractUserId(request),
        ip: request.ip,
        userAgent: request.get('User-Agent'),
        timestamp: new Date().toISOString(),
        headers: this.sanitizeHeaders(request.headers),
      },
      severity: 'HIGH',
      requiresInvestigation: true,
    });

    // TODO: Implement security incident response
    // - Log to security audit system
    // - Block suspicious IP if needed
    // - Notify security team
  }

  /**
   * Sanitize context data for client response
   */
  private sanitizeContext(context?: Record<string, any>): Record<string, any> | undefined {
    if (!context) return undefined;

    const sensitiveKeys = [
      'password', 'token', 'secret', 'key', 'authorization',
      'personalInfo', 'identityNumber', 'phone', 'email',
      'bankAccount', 'cardNumber', 'pin',
    ];

    const sanitized = { ...context };
    
    Object.keys(sanitized).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Sanitize request headers
   */
  private sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    
    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Extract user ID from request
   */
  private extractUserId(request: Request): string | undefined {
    // Try to extract from JWT token or session
    const user = (request as any).user;
    return user?.id || user?.sub || undefined;
  }

  /**
   * Calculate request processing time
   */
  private calculateProcessingTime(request: Request): number | undefined {
    const startTime = (request as any).startTime;
    return startTime ? Date.now() - startTime : undefined;
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get error code from HTTP status
   */
  private getErrorCodeFromStatus(status: number): string {
    const statusCodes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      405: 'METHOD_NOT_ALLOWED',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
      504: 'GATEWAY_TIMEOUT',
    };

    return statusCodes[status] || `HTTP_${status}`;
  }
}

/**
 * Standardized Error Response Interface
 */
interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  requestId: string;
  error: {
    code: string;
    message: string;
    businessDomain: string;
    details?: any;
  };
  metadata: {
    userAgent: string;
    processingTime?: number;
  };
}