import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './report.service';
import { Customer } from '../customer/entity/customer.entity';
import { Contract } from '../contract/entity/contract.entity';
import { Activity } from '../activity/entity/activity.entity';
import { Transaction } from '../transaction/entity/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Contract, Activity, Transaction]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
