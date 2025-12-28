import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

/**
 * Health Module for LCM Service
 * Provides comprehensive health monitoring capabilities for debt collection operations
 */
@Module({
  imports: [
    // MongoDB connection for health checks
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/lcm-production'),
  ],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}