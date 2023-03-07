import { Module } from '@nestjs/common';
import { DataHandlerController } from './data-handler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customer/entity/customer.entity';
import { Contract } from '../contract/entity/contract.entity';
import { Activity } from '../activity/entity/activity.entity';
import { CustomerModule } from '../customer/customer.module';
import { ContractModule } from '../contract/contract.module';
import { ActivityModule } from '../activity/activity.module';
import { DataHandlerService } from './data-handler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Contract, Activity]),
    CustomerModule,
    ContractModule,
    ActivityModule,
  ],
  controllers: [DataHandlerController],
  providers: [DataHandlerService],
})
export class DataHandlerModule {}
