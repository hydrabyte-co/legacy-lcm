import { Module } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { PerformancesController } from './performance.controller';
import { Performance } from './entity/performance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Performance])],
  controllers: [PerformancesController],
  providers: [PerformanceService],
})
export class PerformanceModule {}
