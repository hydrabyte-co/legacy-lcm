import { Module } from '@nestjs/common';
import { InvestigationService } from './investigation.service';
import { InvestigationsController } from './investigation.controller';
import { Investigation } from './entity/investigation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Investigation])],
  controllers: [InvestigationsController],
  providers: [InvestigationService],
})
export class InvestigationModule {}
