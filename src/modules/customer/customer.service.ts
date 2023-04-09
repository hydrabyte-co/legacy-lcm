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
import { Contract } from '../contract/entity/contract.entity';
import { Activity } from '../activity/entity/activity.entity';

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

      console.log(filter.where.query);
      if (phoneRegex.test(filter.where.query)) {
        // filter.where.mobileNumber = filter.where.query;
        filter.where.$or = [
          { mobileNumber: filter.where.query },
          { officeNumber: filter.where.query },
        ];
      } else if (numberRegex.test(filter.where.query)) {
        filter.where.$or = [
          { identityNumber: filter.where.query },
          { code: new RegExp(filter.where.query, 'gi') },
          { callStaffCode: filter.where.query },
        ];
      } else if (codeRegex.test(filter.where.query)) {
        filter.where.code = filter.where.query;
      } else if (emailRegex.test(filter.where.query)) {
        filter.where.email = filter.where.query;
      } else {
        filter.where.$or = [
          { fullname: new RegExp(filter.where.query, 'gi') },
          { permanentAddress: new RegExp(filter.where.query, 'gi') },
          { temporaryAddress: new RegExp(filter.where.query, 'gi') },
          { contractCodes: filter.where.query },
        ];
      }
    }
    filter.order.fullname = 1;
    if (filter.where.searchBy) {
      switch (filter.where.searchBy) {
        case 'fullname-asc': {
          filter.order = { fullname: -1 };
          break;
        }
        case 'fullname-desc': {
          filter.order = { fullname: -1 };
          break;
        }
        case 'priority-asc': {
          filter.order = { priority: 1 };
          filter.where.priority = { $gte: 1 };
          break;
        }
        case 'priority-desc': {
          filter.order = { priority: -1 };
          filter.where.priority = { $gte: 1 };
          break;
        }
        case 'update-desc': {
          filter.order = { changedAt: -1 };
          break;
        }
        case 'update-asc': {
          filter.order = { changedAt: 1 };
          break;
        }
        case 'lastActivity.performAt-asc': {
          filter.order = { 'lastActivity.performAt': 1 };
          filter.where['lastActivity.performAt'] = { $ne: null };
          break;
        }
        case 'lastActivity.performAt-desc': {
          filter.order = { 'lastActivity.performAt': -1 };
          filter.where['lastActivity.performAt'] = { $ne: null };
          break;
        }
        case 'lastPTPActivity.ptpAmount-asc': {
          filter.order = { ['lastPTPActivity.ptpAmount']: 1 };
          filter.where['lastPTPActivity.ptpAmount'] = { $ne: null };
          break;
        }
        case 'lastPTPActivity.ptpAmount-desc': {
          filter.order = { ['lastPTPActivity.ptpAmount']: -1 };
          filter.where['lastPTPActivity.ptpAmount'] = { $ne: null };
          break;
        }

        case 'lastPTPActivity.ptpDate-asc': {
          filter.order = { ['lastPTPActivity.ptpDate']: 1 };
          filter.where['lastPTPActivity.ptpDate'] = { $ne: null };
          break;
        }
        case 'lastPTPActivity.ptpDate-desc': {
          filter.order = { ['lastPTPActivity.ptpDate']: -1 };
          filter.where['lastPTPActivity.ptpDate'] = { $ne: null };
          break;
        }

        case 'ptp-date-desc': {
          filter.order = { ['lastPTPActivity.ptpDate']: -1 };
          filter.where['lastPTPActivity.ptpDate'] = { $ne: null };
          break;
        }
        case 'ptp-date-asc': {
          filter.order = { ['lastPTPActivity.ptpDate']: 1 };
          filter.where['lastPTPActivity.ptpDate'] = { $ne: null };
          break;
        }
        case 'not-contact': {
          const now = new Date();
          const firstDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
            0,
            0,
            0,
          );
          filter.where['$or'] = [
            { 'lastActivity.performAt': { $lt: firstDayOfMonth } },
            { lastActivity: { $eq: null } },
          ];
          filter.order = { ['lastActivity.performAt']: -1 };
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
      filter.where['rcim'] = filter.where.resultCode;
      delete filter.where.resultCode;
    }
    delete filter.where.query;
    delete filter.where.sortBy;
    delete filter.where.searchBy;
    if (
      handler.roles.indexOf('org.owner') < 0 &&
      handler.roles.indexOf('org.admin') < 0
    ) {
      filter.where.callStaffCode = handler.staffCode || '_';
    }
    console.log(JSON.stringify(filter, null, '\t'));
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
