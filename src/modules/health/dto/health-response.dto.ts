import { ApiProperty } from '@nestjs/swagger';

/**
 * Health Check Response DTOs for LCM Service
 * Standardized response formats for health monitoring endpoints
 */

export class HealthCheckResult {
  @ApiProperty({ description: 'Health status', enum: ['ok', 'error'] })
  status: 'ok' | 'error';

  @ApiProperty({ description: 'Timestamp of the health check' })
  timestamp: string;

  @ApiProperty({ description: 'Service uptime in milliseconds' })
  uptime: number;

  @ApiProperty({ description: 'Service name' })
  service: string;

  @ApiProperty({ description: 'Service version' })
  version: string;

  @ApiProperty({ description: 'Error message if status is error', required: false })
  error?: string;

  @ApiProperty({ description: 'Additional message', required: false })
  message?: string;
}

export class DatabaseHealthStatus {
  @ApiProperty({ description: 'Database health status', enum: ['healthy', 'unhealthy', 'slow'] })
  status: 'healthy' | 'unhealthy' | 'slow';

  @ApiProperty({ description: 'Timestamp of the check' })
  timestamp: string;

  @ApiProperty({ description: 'MongoDB connection details', required: false })
  mongodb?: {
    status: string;
    responseTime: number;
    connectionCount: number;
    databaseSize?: number;
    collections?: number;
  };

  @ApiProperty({ description: 'MSSQL connection details', required: false })
  mssql?: {
    status: string;
    responseTime: number;
    connectionCount: number;
  };

  @ApiProperty({ description: 'Error message if unhealthy', required: false })
  error?: string;
}

export class QueueHealthStatus {
  @ApiProperty({ description: 'Queue system health status' })
  status: 'healthy' | 'unhealthy' | 'not_configured';

  @ApiProperty({ description: 'Timestamp of the check' })
  timestamp: string;

  @ApiProperty({ description: 'Connection status' })
  connection: string;

  @ApiProperty({ description: 'Queue information', type: [Object] })
  queues: Array<{
    name: string;
    messageCount: number;
    consumerCount: number;
    status: string;
  }>;

  @ApiProperty({ description: 'Error message if unhealthy', required: false })
  error?: string;

  @ApiProperty({ description: 'Additional message', required: false })
  message?: string;
}

export class CallSystemHealthStatus {
  @ApiProperty({ description: 'Call system health status' })
  status: 'healthy' | 'unhealthy' | 'not_configured';

  @ApiProperty({ description: 'Timestamp of the check' })
  timestamp: string;

  @ApiProperty({ description: 'Auto dialer system status', required: false })
  autoDialer?: {
    status: string;
    activeUsers?: number;
    activecampaigns?: number;
    activeCalls: number;
  };

  @ApiProperty({ description: 'Click-to-call system status', required: false })
  clickToCall?: {
    status: string;
    webRtcConnections: number;
  };

  @ApiProperty({ description: 'Error message if unhealthy', required: false })
  error?: string;

  @ApiProperty({ description: 'Additional message', required: false })
  message?: string;
}

export class ExternalServiceHealthStatus {
  @ApiProperty({ description: 'External services health status' })
  status: 'healthy' | 'unhealthy' | 'not_configured';

  @ApiProperty({ description: 'Timestamp of the check' })
  timestamp: string;

  @ApiProperty({ description: 'External service statuses', type: [Object] })
  services: Array<{
    name: string;
    status: string;
    responseTime?: number;
    endpoint?: string;
  }>;

  @ApiProperty({ description: 'Error message if unhealthy', required: false })
  error?: string;

  @ApiProperty({ description: 'Additional message', required: false })
  message?: string;
}

export class BusinessKPIs {
  @ApiProperty({ description: 'Number of active debt contracts' })
  activeContracts: number;

  @ApiProperty({ description: 'Total debt amount being collected' })
  totalDebtAmount: number;

  @ApiProperty({ description: 'Number of calls made today' })
  callsToday: number;

  @ApiProperty({ description: 'Number of payments received today' })
  paymentsToday: number;

  @ApiProperty({ description: 'Collection success rate percentage' })
  collectionRate: number;

  @ApiProperty({ description: 'Average response time in milliseconds' })
  averageResponseTime: number;

  @ApiProperty({ description: 'Number of active staff members' })
  activeStaff: number;

  @ApiProperty({ description: 'Overall system efficiency percentage' })
  systemEfficiency: number;
}

export class BusinessMetricsResponse {
  @ApiProperty({ description: 'Business metrics health status' })
  status: 'healthy' | 'unhealthy';

  @ApiProperty({ description: 'Timestamp of the metrics collection' })
  timestamp: string;

  @ApiProperty({ description: 'Key Performance Indicators', type: BusinessKPIs })
  kpis: BusinessKPIs;

  @ApiProperty({ description: 'Error message if unhealthy', required: false })
  error?: string;

  @ApiProperty({ description: 'Additional message', required: false })
  message?: string;
}

export class ServiceStatusResponse {
  @ApiProperty({ description: 'Service readiness status', enum: ['ready', 'not_ready'] })
  status: 'ready' | 'not_ready';

  @ApiProperty({ description: 'Timestamp of the check' })
  timestamp: string;

  @ApiProperty({ description: 'Individual check results', required: false })
  checks?: {
    database: 'pass' | 'fail';
    memory: 'pass' | 'fail';
    [key: string]: 'pass' | 'fail';
  };

  @ApiProperty({ description: 'Status message' })
  message: string;

  @ApiProperty({ description: 'Error message if not ready', required: false })
  error?: string;
}

export class SystemHealthResponse {
  @ApiProperty({ description: 'Overall system health status', enum: ['healthy', 'unhealthy'] })
  status: 'healthy' | 'unhealthy';

  @ApiProperty({ description: 'Timestamp of the health check' })
  timestamp: string;

  @ApiProperty({ description: 'Service uptime in milliseconds' })
  uptime: number;

  @ApiProperty({ description: 'Service name' })
  service: string;

  @ApiProperty({ description: 'Service version' })
  version: string;

  @ApiProperty({ description: 'Runtime environment' })
  environment: string;

  @ApiProperty({ description: 'Node.js version' })
  nodeVersion: string;

  @ApiProperty({ description: 'Component health statuses' })
  components: {
    database?: DatabaseHealthStatus;
    messageQueue?: QueueHealthStatus;
    callSystem?: CallSystemHealthStatus;
    externalServices?: ExternalServiceHealthStatus;
    [key: string]: any;
  };

  @ApiProperty({ description: 'System resource usage' })
  resources: {
    memory: {
      total: number;
      heap: number;
      heapTotal: number;
      external: number;
      usage: string;
    };
    uptime: number;
    pid: number;
    nodeVersion: string;
    platform: string;
    arch: string;
  };

  @ApiProperty({ description: 'Error message if unhealthy', required: false })
  error?: string;
}

export class PerformanceMetrics {
  @ApiProperty({ description: 'Timestamp of metrics collection' })
  timestamp: string;

  @ApiProperty({ description: 'Service uptime in milliseconds' })
  uptime: number;

  @ApiProperty({ description: 'Memory usage metrics' })
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };

  @ApiProperty({ description: 'CPU usage metrics' })
  cpu: {
    user: number;
    system: number;
  };

  @ApiProperty({ description: 'Event loop metrics' })
  eventLoop: {
    lag: number;
  };

  @ApiProperty({ description: 'Garbage collection metrics' })
  gc: {
    collections: number;
    duration: number;
  };
}