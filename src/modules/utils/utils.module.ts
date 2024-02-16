import { Module } from '@nestjs/common';
import { UtilController } from './utils.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilService } from './utils.service';
import { Customer } from '../customer/entity/customer.entity';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), CustomerModule],
  controllers: [UtilController],
  providers: [UtilService],
})
export class UtilModule {}
