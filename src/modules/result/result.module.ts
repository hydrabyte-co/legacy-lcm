import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultsController } from './result.controller';
import { Result } from './entity/result.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Result])],
  controllers: [ResultsController],
  providers: [ResultService],
})
export class ResultModule {}
