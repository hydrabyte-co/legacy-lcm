import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomersController } from './customer.controller';
import { Customer } from './entity/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from '../partner/entity/partner.entity';
import { PartnerModule } from '../partner/partner.module';
import { Contract } from '../contract/entity/contract.entity';
import { Activity } from '../activity/entity/activity.entity';
import { ContractModule } from '../contract/contract.module';
import { ActivityModule } from '../activity/activity.module';
import { Reference } from '../reference/entity/reference.entity';
import { ReferenceModule } from '../reference/reference.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Partner]), PartnerModule],
  controllers: [CustomersController],
  providers: [CustomerService],
})
export class CustomerModule {}
