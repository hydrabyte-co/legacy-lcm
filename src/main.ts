import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
// import { SampleWorker } from './workers/sample.worker';

async function bootstrap() {
  const appType = process.env.APP_TYPE || 'api';

  console.log(`App is starting in type '${appType}'`);
  switch (appType) {
    case 'microservice': {
      const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: process.env.RABBITMQ_QUEUE,
            queueOptions: {
              durable: true,
            },
          },
        },
      );
      app.listen();
      break;
    }
    case 'worker': {
      // const app = await NestFactory.createApplicationContext(AppModule);
      // const productsService = app.get(ProductsService);
      // const worker = new SampleWorker(productsService);

      // await worker.start();
      break;
    }
    case 'api':
    default: {
      const app = await NestFactory.create(AppModule);
      app.enableVersioning({
        type: VersioningType.URI,
      });
      app.useGlobalPipes(new ValidationPipe());

      await app.listen(3000);
      break;
    }
  }
}
bootstrap();
