import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Customer } from './entity/customer.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import { CreateCustomerData } from './dto/create.dto';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { Partner } from '../partner/entity/partner.entity';

@Injectable()
export class CustomerService extends BaseService<Customer> {
  private _partnersRepo: MongoRepository<Partner>;
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: MongoRepository<Customer>,
    @InjectRepository(Partner)
    private readonly partnersRepository: MongoRepository<Partner>,
  ) {
    super(customersRepository);
    this._partnersRepo = partnersRepository;
  }

  async createOne(
    data: CreateCustomerData,
    handler: DataHandler,
  ): Promise<Customer> {
    const partner = await this._partnersRepo.findOne({
      where: { code: data.partnerCode },
    });

    if (partner) {
      return super.createOne(data, handler);
    } else {
      throw new BadRequestException(
        `Partner '${data.partnerCode}' is not existed!`,
      );
    }
  }
}
