import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { DataMigration } from '../data-migration/entity/data-migration.entity';
import { DataMigrationModule } from '../data-migration/data-migration.module';

@Module({
  imports: [TypeOrmModule.forFeature([DataMigration]), DataMigrationModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
