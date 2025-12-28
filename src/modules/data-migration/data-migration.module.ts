import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../../common/enums/services';
import { DataMigrationsController } from './data-migration.controller';
import { DataMigrationService } from './data-migration.service';
import { DataMigration } from './entity/data-migration.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DataMigration,
      /*  Customer,
      Contract,
      Transaction,
      Reference,
      Investigation,
      Activity, */
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
          queue: `${process.env.RABBITMQ_QUEUE || 'lcm-sync'}`,
          noAck: false,
          prefetchCount: 1,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    /*   CustomerModule,
    ContractModule,
    TransactionModule,
    ReferenceModule,
    InvestigationModule,
    ActivityModule, */
  ],
  controllers: [DataMigrationsController],
  providers: [DataMigrationService],
})
export class DataMigrationModule {}
