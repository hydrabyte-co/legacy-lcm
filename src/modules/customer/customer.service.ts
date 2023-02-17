import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Customer } from './entity/customer.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import { CreateCustomerData } from './dto/create.dto';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { Partner } from '../partner/entity/partner.entity';
import {
  FindManyFilter,
  FindAllResult,
} from 'src/common/modules/base/dto/find-many.dto';

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

  async findManyWithPaging(
    filter: FindManyFilter,
    handler: DataHandler,
  ): Promise<FindAllResult<Customer>> {
    if (filter.where.query) {
      const phoneRegex = /^0[1-9][0-9]+$/;
      const numberRegex = /^([1-9]|00)[0-9]+$/;
      const codeRegex = /^[a-zA-Z]+-[0-9]+$/;
      const emailRegex = /^[a-z0-9.-_]+\@[a-z0-9.-_]+$/;

      if (phoneRegex.test(filter.where.query)) {
        // filter.where.mobileNumber = filter.where.query;
        filter.where.$or = [
          { mobileNumber: filter.where.query },
          { officeNumber: filter.where.query },
        ];
      } else if (numberRegex.test(filter.where.query)) {
        filter.where.identityNumber = filter.where.query;
      } else if (codeRegex.test(filter.where.query)) {
        filter.where.code = filter.where.query;
      } else if (emailRegex.test(filter.where.query)) {
        filter.where.email = filter.where.query;
      } else {
        filter.where.$or = [
          { fullname: new RegExp(filter.where.query, 'g') },
          { permanentAddress: new RegExp(filter.where.query, 'g') },
          { temporaryAddress: new RegExp(filter.where.query, 'g') },
        ];
      }
    }
    filter.order.fullname = 1;
    if (filter.where.sortBy) {
      switch (filter.where.sortBy) {
        case 'update-desc': {
          filter.order = { changedAt: -1 };
          break;
        }
        case 'update-asc': {
          filter.order = { changedAt: 1 };
          break;
        }
        case 'activity-asc': {
          filter.order = { lastActivityDate: 1 };
          break;
        }
        case 'activity-desc': {
          filter.order = { lastActivityDate: -1 };
          break;
        }
        case 'priority-asc': {
          filter.order = { priority: 1 };
          filter.where.priority = { $gte: 1 };
          break;
        }
        case 'fullname-desc': {
          filter.order = { fullname: -1 };
          break;
        }
        case 'fullname-asc':
        default: {
          filter.order = { fullname: 1 };
          break;
        }
      }
    }
    if (filter.where.resultCode) {
      filter.where['lastActivity.resultCode'] = filter.where.resultCode;
      delete filter.where.resultCode;
    }
    delete filter.where.query;
    delete filter.where.sortBy;
    filter.where.callStaffCode = handler.staffCode;
    return await super.findManyWithPaging(filter, handler);
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
