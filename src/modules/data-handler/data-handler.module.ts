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
import { TransactionModule } from '../transaction/transaction.module';
import { Transaction } from '../transaction/entity/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Contract, Activity, Transaction]),
    CustomerModule,
    ContractModule,
    ActivityModule,
    TransactionModule,
  ],
  controllers: [DataHandlerController],
  providers: [DataHandlerService],
})
export class DataHandlerModule {}
