import { Module } from '@nestjs/common';
import { DataFileService } from './data-file.service';
import { DataFilesController } from './data-file.controller';
import { DataFile } from './entity/data-file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DataFile])],
  controllers: [DataFilesController],
  providers: [DataFileService],
})
export class DataFileModule {}
