import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildInfoService } from './build-info.service';
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
import { DataMigrationModule } from './modules/data-migration/data-migration.module';
import { EventModule } from './modules/event/event.module';
import { UtilModule } from './modules/utils/utils.module';
import { ReportModule } from './modules/report/report.module';
import { TaskModule } from './modules/task/task.module';
import { TeamModule } from './modules/team/team.module';
import { CallModule } from './modules/call/call.module';
import { Call } from './modules/call/entity/call.entity';
import { AutomationModule } from './modules/automation/automation.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      //name: 'lcm',
      type: 'mongodb',
      url: process.env.MONGODB_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      ssl: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      synchronize: false,
    }),
    TypeOrmModule.forRoot({
      name: 'voice',
      type: 'mongodb',
      url: process.env.MONGODB_VOICE_URL,
      database: 'voice',
      entities: [Call],
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
    DataMigrationModule,
    TaskModule,
    TeamModule,
    CallModule,
    EventModule,
    UtilModule,
    ReportModule,
    AutomationModule,
  ],
  controllers: [AppController],
  providers: [AppService, BuildInfoService, JWTAuthStrategy, BasicAuthStrategy],
})
export class AppModule {}
