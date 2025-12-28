import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../../common/enums/services';
import { ActivityModule } from '../activity/activity.module';
import { Activity } from '../activity/entity/activity.entity';
import { ContractModule } from '../contract/contract.module';
import { Contract } from '../contract/entity/contract.entity';
import { CustomerModule } from '../customer/customer.module';
import { Customer } from '../customer/entity/customer.entity';
import { Investigation } from '../investigation/entity/investigation.entity';
import { InvestigationModule } from '../investigation/investigation.module';
import { Reference } from '../reference/entity/reference.entity';
import { ReferenceModule } from '../reference/reference.module';
import { Transaction } from '../transaction/entity/transaction.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { ExportData } from './entity/export-data.entity';
import { ExportDatasController } from './export-data.controller';
import { ExportDataService } from './export-data.service';

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
          urls: [
            process.env.RABBITMQ_URL ||
              'amqp://guest:guest@localhost:5672?heartbeat=30',
          ],
          queue: `${process.env.RABBITMQ_QUEUE || 'lcm'}`,
          queueOptions: {
            durable: false,
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
