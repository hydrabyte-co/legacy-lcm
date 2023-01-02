import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnersController } from './partner.controller';
import { Partner } from './entity/partner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Partner])],
  controllers: [PartnersController],
  providers: [PartnerService],
})
export class PartnerModule {}
