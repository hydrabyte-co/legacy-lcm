import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractsController } from './contract.controller';
import { Contract } from './entity/contract.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from '../partner/entity/partner.entity';
import { PartnerModule } from '../partner/partner.module';
import { Customer } from '../customer/entity/customer.entity';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract, Partner, Customer]),
    PartnerModule,
    CustomerModule,
  ],
  controllers: [ContractsController],
  providers: [ContractService],
})
export class ContractModule {}
