import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';
import {
  HealthCheckResult,
  SystemHealthResponse,
  BusinessMetricsResponse,
  ServiceStatusResponse,
} from './dto/health-response.dto';

/**
 * Health Check Controller for LCM Service
 * Provides comprehensive health monitoring for debt collection operations
 */
@ApiTags('Health Monitoring')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Basic health check endpoint
   * Returns simple status for load balancers and monitoring systems
   */
  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @ApiResponse({ status: 503, description: 'Service is unhealthy' })
  async getHealth(): Promise<HealthCheckResult> {
    return await this.healthService.getBasicHealth();
  }

  /**
   * Detailed system health check
   * Returns comprehensive system status including all dependencies
   */
  @Get('system')
  @ApiOperation({ summary: 'Detailed system health check' })
  @ApiResponse({ 
    status: 200, 
    description: 'Detailed system health information',
    type: SystemHealthResponse
  })
  async getSystemHealth(): Promise<SystemHealthResponse> {
    return await this.healthService.getSystemHealth();
  }

  /**
   * Database health check
   * Verifies MongoDB and MSSQL connectivity and performance
   */
  @Get('database')
  @ApiOperation({ summary: 'Database health check' })
  @ApiResponse({ status: 200, description: 'Database health status' })
  async getDatabaseHealth(): Promise<any> {
    return await this.healthService.getDatabaseHealth();
  }

  /**
   * Message queue health check
   * Verifies AMQP/RabbitMQ connectivity and queue status
   */
  @Get('queue')
  @ApiOperation({ summary: 'Message queue health check' })
  @ApiResponse({ status: 200, description: 'Queue health status' })
  async getQueueHealth(): Promise<any> {
    return await this.healthService.getQueueHealth();
  }

  /**
   * Call system health check
   * Verifies dialer system connectivity and call processing capability
   */
  @Get('call-system')
  @ApiOperation({ summary: 'Call system health check' })
  @ApiResponse({ status: 200, description: 'Call system health status' })
  async getCallSystemHealth(): Promise<any> {
    return await this.healthService.getCallSystemHealth();
  }

  /**
   * External services health check
   * Verifies connectivity to payment gateways, partner APIs, etc.
   */
  @Get('external-services')
  @ApiOperation({ summary: 'External services health check' })
  @ApiResponse({ status: 200, description: 'External services health status' })
  async getExternalServicesHealth(): Promise<any> {
    return await this.healthService.getExternalServicesHealth();
  }

  /**
   * Business metrics health check
   * Returns key business metrics for debt collection operations
   */
  @Get('business-metrics')
  @ApiOperation({ summary: 'Business metrics health check' })
  @ApiResponse({ 
    status: 200, 
    description: 'Business metrics and KPIs',
    type: BusinessMetricsResponse
  })
  async getBusinessMetrics(): Promise<BusinessMetricsResponse> {
    return await this.healthService.getBusinessMetrics();
  }

  /**
   * Service readiness check
   * Returns whether the service is ready to handle debt collection requests
   */
  @Get('ready')
  @ApiOperation({ summary: 'Service readiness check' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service readiness status',
    type: ServiceStatusResponse
  })
  async getReadiness(): Promise<ServiceStatusResponse> {
    return await this.healthService.getReadiness();
  }

  /**
   * Service liveness check
   * Returns whether the service is alive and responding
   */
  @Get('live')
  @ApiOperation({ summary: 'Service liveness check' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  async getLiveness(): Promise<HealthCheckResult> {
    return await this.healthService.getLiveness();
  }

  /**
   * Performance metrics
   * Returns system performance metrics for monitoring and alerting
   */
  @Get('metrics')
  @ApiOperation({ summary: 'Performance metrics' })
  @ApiResponse({ status: 200, description: 'Performance metrics' })
  async getMetrics(): Promise<any> {
    return await this.healthService.getPerformanceMetrics();
  }
}