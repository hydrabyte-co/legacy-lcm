import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ImportDataService } from './import-data.service';
import { ImportDatasController } from './import-data.controller';
import { ImportData } from './entity/import-data.entity';
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
      ImportData,
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
              'amqp://admin:SecurePassword@10.0.1.50?heartbeat=30',
          ],
          queue: process.env.RABBITMQ_QUEUE || 'lcm',
          queueOptions: {
            durable: false,
            noAck: false,
            prefetchCount: 1,
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
  controllers: [ImportDatasController],
  providers: [ImportDataService],
})
export class ImportDataModule {}
