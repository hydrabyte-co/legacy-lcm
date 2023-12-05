import { Module } from '@nestjs/common';
import { UtilController } from './utils.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilService } from './utils.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [UtilController],
  providers: [UtilService],
})
export class UtilModule {}
