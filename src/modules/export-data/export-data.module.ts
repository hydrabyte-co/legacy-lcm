import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ExportDataService } from './export-data.service';
import { ExportDatasController } from './export-data.controller';
import { ExportData } from './entity/export-data.entity';
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
import { Activity } from '../activity/entity/activity.entity';
import { ActivityModule } from '../activity/activity.module';
import { Services } from 'src/common/enums/services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExportData,
      Customer,
      Contract,
      Transaction,
      Reference,
      Investigation,
      Activity,
    ]),
    ClientsModule.register([
      {
        name: Services.LCM,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: `${process.env.RABBITMQ_QUEUE}-export-data`,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    CustomerModule,
    ContractModule,
    TransactionModule,
    ReferenceModule,
    InvestigationModule,
    ActivityModule,
  ],
  controllers: [ExportDatasController],
  providers: [ExportDataService],
})
export class ExportDataModule {}
