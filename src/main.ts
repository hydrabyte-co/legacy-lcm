import {
  INestApplicationContext,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MongoRepository } from 'typeorm';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { logInfo, logWarning } from './common/utils/log-helper';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataMigration } from './modules/data-migration/entity/data-migration.entity';
import { Activity } from './modules/activity/entity/activity.entity';
import { DataMigrationService } from './modules/data-migration/data-migration.service';
import { DataMigrationWorker } from './workers/data-migration.worker';
// import { SampleWorker } from './workers/sample.worker';

let worker = undefined;
let standAloneApp: INestApplicationContext;

const handleProcessKilled = async function (code) {
  logWarning(`*`, `Process is killing by ${code}...`);
  if (worker) {
    await worker.terminate();
  }
  if (standAloneApp) {
    standAloneApp.close();
  }
  process.exit(0);
};

async function bootstrap() {
  const appType = process.env.APP_TYPE || 'api';
  const apiPort = process.env.API_PORT || 3000;

  logInfo('*', `App is starting in type '${appType}'`);
  switch (appType) {
    case 'microservice': {
      const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: process.env.RABBITMQ_QUEUE,
            noAck: false,
            prefetchCount: 1,
            queueOptions: {
              durable: false,
            },
          },
        },
      );
      app.listen();
      break;
    }
    case 'worker': {
      standAloneApp = await NestFactory.createApplicationContext(AppModule);
      /*   const dataMigrationRepo = standAloneApp.get<
        MongoRepository<DataMigration>
      >(getRepositoryToken(DataMigration));
      const activityRepo = standAloneApp.get<MongoRepository<Activity>>(
        getRepositoryToken(Activity),
      ); */
      const dataMigrationService =
        standAloneApp.get<DataMigrationService>(DataMigrationService);

      worker = new DataMigrationWorker(dataMigrationService);

      process.once('SIGINT', async function (code) {
        await handleProcessKilled(code);
      });

      process.once('SIGTERM', async function (code) {
        await handleProcessKilled(code);
      });

      process.once('SIGABRT', async function (code) {
        await handleProcessKilled(code);
      });

      process.on('uncaughtException', async (err) => {
        await handleProcessKilled(err.message);
      });

      worker.start();
      break;
    }
    case 'api':
    default: {
      const app = await NestFactory.create(AppModule);
      app.enableVersioning({
        type: VersioningType.URI,
      });
      app.useGlobalPipes(new ValidationPipe());

      await app.listen(apiPort);
      break;
    }
  }
}
bootstrap();
