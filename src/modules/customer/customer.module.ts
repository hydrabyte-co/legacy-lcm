import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomersController } from './customer.controller';
import { Customer } from './entity/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from '../partner/entity/partner.entity';
import { PartnerModule } from '../partner/partner.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Partner]), PartnerModule],
  controllers: [CustomersController],
  providers: [CustomerService],
})
export class CustomerModule {}
