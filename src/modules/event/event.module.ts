import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { DataMigration } from '../data-migration/entity/data-migration.entity';
import { DataMigrationModule } from '../data-migration/data-migration.module';
import { Services } from 'src/common/enums/services';
import { Customer } from '../customer/entity/customer.entity';
import { Contract } from '../contract/entity/contract.entity';
import { Activity } from '../activity/entity/activity.entity';
import { Reference } from '../reference/entity/reference.entity';
import { Investigation } from '../investigation/entity/investigation.entity';
import { CustomerModule } from '../customer/customer.module';
import { ContractModule } from '../contract/contract.module';
import { ActivityModule } from '../activity/activity.module';
import { ReferenceModule } from '../reference/reference.module';
import { InvestigationModule } from '../investigation/investigation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DataMigration,
      Customer,
      Contract,
      Activity,
      Reference,
      Investigation,
    ]),
    DataMigrationModule,
    CustomerModule,
    ContractModule,
    ActivityModule,
    ReferenceModule,
    InvestigationModule,
    ClientsModule.register([
      {
        name: Services.LCM,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ||
              'amqp://admin:SecurePassword@10.0.0.40?heartbeat=30',
          ],
          queue: `${process.env.RABBITMQ_QUEUE || 'lcm'}`,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
