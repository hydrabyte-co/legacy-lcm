import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { 
  HealthCheckResult,
  SystemHealthResponse,
  BusinessMetricsResponse,
  ServiceStatusResponse,
  DatabaseHealthStatus,
  QueueHealthStatus,
  CallSystemHealthStatus,
  ExternalServiceHealthStatus,
  PerformanceMetrics,
  BusinessKPIs,
} from './dto/health-response.dto';

/**
 * Health Service for LCM Service
 * Implements comprehensive health monitoring for debt collection operations
 */
@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly startTime = Date.now();

  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
  ) {}

  /**
   * Basic health check
   */
  async getBasicHealth(): Promise<HealthCheckResult> {
    try {
      // Quick checks for critical services
      const dbHealth = await this.quickDatabaseCheck();
      const memoryUsage = process.memoryUsage();
      const isHealthy = dbHealth && memoryUsage.heapUsed < (1024 * 1024 * 512); // 512MB threshold

      return {
        status: isHealthy ? 'ok' : 'error',
        timestamp: new Date().toISOString(),
        uptime: Date.now() - this.startTime,
        service: 'lcm-service',
        version: process.env.npm_package_version || '1.0.0',
      };
    } catch (error) {
      this.logger.error('Basic health check failed', error);
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: Date.now() - this.startTime,
        service: 'lcm-service',
        version: process.env.npm_package_version || '1.0.0',
        error: error.message,
      };
    }
  }

  /**
   * Comprehensive system health check
   */
  async getSystemHealth(): Promise<SystemHealthResponse> {
    const timestamp = new Date().toISOString();
    const uptime = Date.now() - this.startTime;

    try {
      // Parallel health checks for performance
      const [
        databaseHealth,
        queueHealth,
        callSystemHealth,
        externalServicesHealth,
      ] = await Promise.allSettled([
        this.getDatabaseHealth(),
        this.getQueueHealth(),
        this.getCallSystemHealth(),
        this.getExternalServicesHealth(),
      ]);

      // Determine overall status
      const healthChecks = [databaseHealth, queueHealth, callSystemHealth, externalServicesHealth];
      const hasErrors = healthChecks.some(check => 
        check.status === 'rejected' || 
        (check.status === 'fulfilled' && check.value.status !== 'healthy')
      );

      const overallStatus = hasErrors ? 'unhealthy' : 'healthy';

      return {
        status: overallStatus,
        timestamp,
        uptime,
        service: 'lcm-service',
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        components: {
          database: databaseHealth.status === 'fulfilled' ? databaseHealth.value : { status: 'unhealthy' as const, timestamp: new Date().toISOString(), error: 'Check failed' },
          messageQueue: queueHealth.status === 'fulfilled' ? queueHealth.value : { status: 'unhealthy' as const, timestamp: new Date().toISOString(), connection: 'unknown', queues: [], error: 'Check failed' },
          callSystem: callSystemHealth.status === 'fulfilled' ? callSystemHealth.value : { status: 'unhealthy' as const, timestamp: new Date().toISOString(), error: 'Check failed' },
          externalServices: externalServicesHealth.status === 'fulfilled' ? externalServicesHealth.value : { status: 'unhealthy' as const, timestamp: new Date().toISOString(), services: [], error: 'Check failed' },
        },
        resources: await this.getResourceUsage(),
      };
    } catch (error) {
      this.logger.error('System health check failed', error);
      return {
        status: 'unhealthy',
        timestamp,
        uptime,
        service: 'lcm-service',
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        error: error.message,
        components: {},
        resources: await this.getResourceUsage(),
      };
    }
  }

  /**
   * Database health check
   */
  async getDatabaseHealth(): Promise<DatabaseHealthStatus> {
    try {
      // MongoDB health check
      const mongoStart = Date.now();
      await this.mongoConnection.db.admin().ping();
      const mongoResponseTime = Date.now() - mongoStart;
      
      // Get MongoDB stats
      const mongoStats = await this.mongoConnection.db.stats();
      
      // TODO: Add MSSQL health check when available
      const mssqlHealth = {
        status: 'not_configured',
        responseTime: 0,
        connectionCount: 0,
      };

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        mongodb: {
          status: mongoResponseTime < 1000 ? 'healthy' : 'slow',
          responseTime: mongoResponseTime,
          connectionCount: this.mongoConnection.readyState,
          databaseSize: mongoStats.dataSize,
          collections: mongoStats.collections,
        },
        mssql: mssqlHealth,
      };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        mongodb: {
          status: 'unhealthy',
          responseTime: 0,
          connectionCount: 0,
        },
        mssql: {
          status: 'unhealthy',
          responseTime: 0,
          connectionCount: 0,
        },
      };
    }
  }

  /**
   * Message queue health check
   */
  async getQueueHealth(): Promise<QueueHealthStatus> {
    try {
      // TODO: Implement AMQP/RabbitMQ health check
      // This would check connection, queue depths, consumer counts, etc.
      
      return {
        status: 'not_configured',
        timestamp: new Date().toISOString(),
        connection: 'not_configured',
        queues: [],
        message: 'AMQP health check not yet implemented',
      };
    } catch (error) {
      this.logger.error('Queue health check failed', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        connection: 'disconnected',
        queues: [],
      };
    }
  }

  /**
   * Call system health check
   */
  async getCallSystemHealth(): Promise<CallSystemHealthStatus> {
    try {
      // TODO: Implement dialer system health checks
      // This would check connectivity to auto dialer, click-to-call systems, etc.
      
      return {
        status: 'not_configured',
        timestamp: new Date().toISOString(),
        autoDialer: {
          status: 'not_configured',
          activecampaigns: 0,
          activeCalls: 0,
        },
        clickToCall: {
          status: 'not_configured',
          webRtcConnections: 0,
        },
        message: 'Call system health checks not yet implemented',
      };
    } catch (error) {
      this.logger.error('Call system health check failed', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        autoDialer: {
          status: 'unhealthy',
          activeUsers: 0,
          activeCalls: 0,
        },
        clickToCall: {
          status: 'unhealthy',
          webRtcConnections: 0,
        },
      };
    }
  }

  /**
   * External services health check
   */
  async getExternalServicesHealth(): Promise<ExternalServiceHealthStatus> {
    try {
      // TODO: Implement external service health checks
      // This would check payment gateways, partner APIs, etc.
      
      return {
        status: 'not_configured',
        timestamp: new Date().toISOString(),
        services: [],
        message: 'External service health checks not yet implemented',
      };
    } catch (error) {
      this.logger.error('External services health check failed', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        services: [],
      };
    }
  }

  /**
   * Business metrics and KPIs
   */
  async getBusinessMetrics(): Promise<BusinessMetricsResponse> {
    try {
      // TODO: Implement business metrics collection
      // This would gather key debt collection KPIs from the database
      
      const mockKPIs: BusinessKPIs = {
        activeContracts: 0,
        totalDebtAmount: 0,
        callsToday: 0,
        paymentsToday: 0,
        collectionRate: 0,
        averageResponseTime: 0,
        activeStaff: 0,
        systemEfficiency: 0,
      };

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        kpis: mockKPIs,
        message: 'Business metrics collection not yet implemented',
      };
    } catch (error) {
      this.logger.error('Business metrics check failed', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        kpis: {
          activeContracts: 0,
          totalDebtAmount: 0,
          callsToday: 0,
          paymentsToday: 0,
          collectionRate: 0,
          averageResponseTime: 0,
          activeStaff: 0,
          systemEfficiency: 0,
        },
      };
    }
  }

  /**
   * Service readiness check
   */
  async getReadiness(): Promise<ServiceStatusResponse> {
    try {
      // Check if service is ready to handle requests
      const dbReady = await this.quickDatabaseCheck();
      const memoryOk = process.memoryUsage().heapUsed < (1024 * 1024 * 1024); // 1GB threshold
      
      const isReady = dbReady && memoryOk;

      return {
        status: isReady ? 'ready' : 'not_ready',
        timestamp: new Date().toISOString(),
        checks: {
          database: dbReady ? 'pass' : 'fail',
          memory: memoryOk ? 'pass' : 'fail',
        },
        message: isReady ? 'Service is ready to handle requests' : 'Service is not ready',
      };
    } catch (error) {
      this.logger.error('Readiness check failed', error);
      return {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        error: error.message,
        checks: {
          database: 'fail',
          memory: 'fail',
        },
        message: 'Readiness check failed',
      };
    }
  }

  /**
   * Service liveness check
   */
  async getLiveness(): Promise<HealthCheckResult> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      service: 'lcm-service',
      version: process.env.npm_package_version || '1.0.0',
      message: 'Service is alive',
    };
  }

  /**
   * Performance metrics
   */
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
        arrayBuffers: memoryUsage.arrayBuffers,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      eventLoop: {
        // TODO: Add event loop lag measurement
        lag: 0,
      },
      gc: {
        // TODO: Add garbage collection metrics
        collections: 0,
        duration: 0,
      },
    };
  }

  /**
   * Quick database connectivity check
   */
  private async quickDatabaseCheck(): Promise<boolean> {
    try {
      await this.mongoConnection.db.admin().ping();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get system resource usage
   */
  private async getResourceUsage(): Promise<any> {
    const memoryUsage = process.memoryUsage();
    
    return {
      memory: {
        total: memoryUsage.rss,
        heap: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        external: memoryUsage.external,
        usage: (memoryUsage.heapUsed / memoryUsage.heapTotal * 100).toFixed(2) + '%',
      },
      uptime: Date.now() - this.startTime,
      pid: process.pid,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    };
  }
}