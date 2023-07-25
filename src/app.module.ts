import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JWTAuthStrategy } from './common/guards/auth/jwt-auth.strategy';
import { BasicAuthStrategy } from './common/guards/auth/basic-auth.strategy';
import { PartnerModule } from './modules/partner/partner.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ContractModule } from './modules/contract/contract.module';
import { ResultModule } from './modules/result/result.module';
import { ActivityModule } from './modules/activity/activity.module';
import { ImportDataModule } from './modules/import-data/import-data.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { ReferenceModule } from './modules/reference/reference.module';
import { InvestigationModule } from './modules/investigation/investigation.module';
import { DataHandlerModule } from './modules/data-handler/data-handler.module';
import { ExportDataModule } from './modules/export-data/export-data.module';
import { PerformanceModule } from './modules/performance/performance.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      ssl: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      synchronize: false,
    }),
    PartnerModule,
    CustomerModule,
    ContractModule,
    ResultModule,
    ActivityModule,
    ImportDataModule,
    ExportDataModule,
    TransactionModule,
    ReferenceModule,
    InvestigationModule,
    PerformanceModule,
    DataHandlerModule,
  ],
  controllers: [AppController],
  providers: [AppService, JWTAuthStrategy, BasicAuthStrategy],
})
export class AppModule {}
