import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivitiesController } from './activity.controller';
import { Activity } from './entity/activity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from '../result/entity/result.entity';
import { Customer } from '../customer/entity/customer.entity';
import { CustomerModule } from '../customer/customer.module';
import { ResultModule } from '../result/result.module';
import { Contract } from '../contract/entity/contract.entity';
import { ContractModule } from '../contract/contract.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, Contract, Result]),
    ContractModule,
    ResultModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivityService],
})
export class ActivityModule {}
