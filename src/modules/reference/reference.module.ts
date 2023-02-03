import { Module } from '@nestjs/common';
import { ReferenceService } from './reference.service';
import { ReferencesController } from './reference.controller';
import { Reference } from './entity/reference.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customer/entity/customer.entity';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reference, Customer]), CustomerModule],
  controllers: [ReferencesController],
  providers: [ReferenceService],
})
export class ReferenceModule {}
