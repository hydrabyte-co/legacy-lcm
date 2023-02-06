import { Module } from '@nestjs/common';
import { DataFileService } from './data-file.service';
import { DataFilesController } from './data-file.controller';
import { DataFile } from './entity/data-file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customer/entity/customer.entity';
import { CustomerModule } from '../customer/customer.module';
import { Contract } from '../contract/entity/contract.entity';
import { ContractModule } from '../contract/contract.module';
import { Transaction } from '../transaction/entity/transaction.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { Reference } from '../reference/entity/reference.entity';
import { Investigation } from '../investigation/entity/investigation.entity';
import { ReferenceModule } from '../reference/reference.module';
import { InvestigationModule } from '../investigation/investigation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DataFile,
      Customer,
      Contract,
      Transaction,
      Reference,
      Investigation,
    ]),
    CustomerModule,
    ContractModule,
    TransactionModule,
    ReferenceModule,
    InvestigationModule,
  ],
  controllers: [DataFilesController],
  providers: [DataFileService],
})
export class DataFileModule {}
