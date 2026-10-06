import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base Exception Class for LCM Service
 * Provides standardized error handling for debt collection business operations
 */
export abstract class LCMBaseException extends HttpException {
  public readonly errorCode: string;
  public readonly context?: Record<string, any>;
  public readonly timestamp: Date;
  public readonly businessDomain: string;

  constructor(
    message: string,
    errorCode: string,
    httpStatus: HttpStatus,
    businessDomain: string,
    context?: Record<string, any>,
  ) {
    super(
      {
        message,
        errorCode,
        businessDomain,
        timestamp: new Date().toISOString(),
        context,
      },
      httpStatus,
    );

    this.errorCode = errorCode;
    this.context = context;
    this.timestamp = new Date();
    this.businessDomain = businessDomain;
  }

  /**
   * Get error details for logging
   */
  public getErrorDetails() {
    return {
      name: this.constructor.name,
      message: this.message,
      errorCode: this.errorCode,
      businessDomain: this.businessDomain,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }

  /**
   * Get sanitized error for client response
   */
  public getClientError() {
    return {
      message: this.message,
      errorCode: this.errorCode,
      businessDomain: this.businessDomain,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * Generic LCM Exception for cases where no specific exception type is needed
 */
export class GenericLCMException extends LCMBaseException {
  constructor(
    message: string,
    errorCode: string,
    httpStatus: HttpStatus,
    businessDomain: string,
    context?: Record<string, any>,
  ) {
    super(message, errorCode, httpStatus, businessDomain, context);
  }
}