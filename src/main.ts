import {
  INestApplicationContext,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bodyParser from 'body-parser';
import { MongoRepository } from 'typeorm';
import { AppModule } from './app.module';
import { logInfo, logWarning } from './common/utils/log-helper';
import { DataMigrationService } from './modules/data-migration/data-migration.service';
import { Transaction } from './modules/transaction/entity/transaction.entity';
import { DataMigrationWorker } from './workers/data-migration.worker';
import { PaymentMigrationWorker } from './workers/payment-migration.worker';
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
      switch (process.env.WORKER_TYPE) {
        case 'payment-migration': {
          const transactionRepo = standAloneApp.get<
            MongoRepository<Transaction>
          >(getRepositoryToken(Transaction));
          worker = new PaymentMigrationWorker(transactionRepo);
          break;
        }
        case 'data-migration':
        default: {
          const dataMigrationService =
            standAloneApp.get<DataMigrationService>(DataMigrationService);

          worker = new DataMigrationWorker(dataMigrationService);
          break;
        }
      }

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
      app.use(bodyParser.json({ limit: '50mb' }));
      app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
      app.useGlobalPipes(new ValidationPipe());

      // Setup Swagger API Documentation
      /* const config = new DocumentBuilder()
        .setTitle('LCM Service API')
        .setDescription('Loans Collection Management API Documentation - Debt Collection System for Financial Institutions')
        .setVersion('1.0.0')
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token for authentication',
            in: 'header',
          },
          'JWT-auth',
        )
        .addTag('LCM', 'Loans Collection Management')
        .addTag('Partners', 'Financial Institution Partners')
        .addTag('Customers', 'Debt Customers Management')
        .addTag('Contracts', 'Debt Contracts & Terms')
        .addTag('Calls', 'Call Management (Manual/Auto/Dialer)')
        .addTag('Activities', 'Collection Activities Tracking')
        .addTag('Transactions', 'Payment Transactions')
        .addTag('Reports', 'Collection Performance Reports')
        .addTag('Health', 'System Health Monitoring')
        .build();

      const document = SwaggerModule.createDocument(app, config);
      
      // Setup /docs endpoint returning JSON only (no UI)
      app.getHttpAdapter().get('/docs', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(document, null, 2));
      });
      
      // Health check endpoint
      app.getHttpAdapter().get('/health', (req, res) => {
        res.json({ 
          status: 'ok', 
          timestamp: new Date().toISOString(),
          service: 'LCM Service',
          version: '1.0.0'
        });
      });

      logInfo('*', `LCM Service API Documentation available at /docs`); */
      await app.listen(apiPort);
      break;
    }
  }
}
bootstrap();
