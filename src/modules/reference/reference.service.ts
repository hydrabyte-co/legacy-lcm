import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Reference } from './entity/reference.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import { CreateReferenceData } from './dto/create.dto';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { Customer } from '../customer/entity/customer.entity';
import {
  FindManyFilter,
  FindAllResult,
} from 'src/common/modules/base/dto/find-many.dto';

@Injectable()
export class ReferenceService extends BaseService<Reference> {
  private _customersRepo: MongoRepository<Customer>;
  constructor(
    @InjectRepository(Reference)
    private readonly referencesRepository: MongoRepository<Reference>,
    @InjectRepository(Customer)
    private readonly customersRepository: MongoRepository<Customer>,
  ) {
    super(referencesRepository);
    this._customersRepo = customersRepository;
  }

  async findManyWithPaging(
    filter: FindManyFilter,
    handler: DataHandler,
  ): Promise<FindAllResult<Reference>> {
    if (filter.where.query) {
      const phoneRegex = /^0[1-9]+/;
      const numberRegex = /^[0-9]+/;

      if (phoneRegex.test(filter.where.query)) {
        //filter.where.or
      }
    }
    filter.where.staffCode = handler.staffCode;
    return await super.findManyWithPaging(filter, handler);
  }

  async createOne(
    data: CreateReferenceData,
    handler: DataHandler,
  ): Promise<Reference> {
    const customer = await this._customersRepo.findOne({
      where: { code: data.customerCode },
    });

    if (customer) {
      return super.createOne(data, handler);
    } else {
      throw new BadRequestException(
        `Customer '${data.customerCode}' is not existed!`,
      );
    }
  }
}
