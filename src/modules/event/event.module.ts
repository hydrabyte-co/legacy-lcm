import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../../common/enums/services';
import { Activity } from '../activity/entity/activity.entity';
import { Call } from '../call/entity/call.entity';
import { Contract } from '../contract/entity/contract.entity';
import { Customer } from '../customer/entity/customer.entity';
import { DataMigration } from '../data-migration/entity/data-migration.entity';
import { Investigation } from '../investigation/entity/investigation.entity';
import { Reference } from '../reference/entity/reference.entity';
import { EventController } from './event.controller';
import { EventService } from './event.service';

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
    TypeOrmModule.forFeature([Call], 'voice'),
    /* DataMigrationModule,
    CustomerModule,
    ContractModule,
    ActivityModule,
    ReferenceModule,
    InvestigationModule, */
    ClientsModule.register([
      {
        name: Services.LCM,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ||
              'amqp://guest:guest@localhost:5672?heartbeat=30',
          ],
          queue: `${process.env.RABBITMQ_QUEUE || 'lcm-sync'}`,
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
