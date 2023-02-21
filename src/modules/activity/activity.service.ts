import { ObjectID } from 'mongodb';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Activity } from './entity/activity.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { Customer } from '../customer/entity/customer.entity';
import { Result } from '../result/entity/result.entity';
import { CreateActivityData } from './dto/create.dto';
import { Contract } from '../contract/entity/contract.entity';
import {
  FindManyFilter,
  FindAllResult,
} from 'src/common/modules/base/dto/find-many.dto';

@Injectable()
export class ActivityService extends BaseService<Activity> {
  private _activitiesRepo: MongoRepository<Activity>;
  private _customersRepo: MongoRepository<Customer>;
  private _contractsRepo: MongoRepository<Contract>;
  private _resultsRepo: MongoRepository<Result>;
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: MongoRepository<Activity>,
    @InjectRepository(Contract)
    private readonly contractsRepository: MongoRepository<Contract>,
    @InjectRepository(Result)
    private readonly resultsRepository: MongoRepository<Result>,
    @InjectRepository(Customer)
    private readonly customersRepository: MongoRepository<Customer>,
  ) {
    super(activitiesRepository);
    this._activitiesRepo = activitiesRepository;
    this._contractsRepo = contractsRepository;
    this._resultsRepo = resultsRepository;
    this._customersRepo = customersRepository;
  }

  async findOneByCode(code: string, handler: DataHandler): Promise<any> {
    return super.findOneByField('code', code, handler);
  }

  async findManyWithPaging(
    filter: FindManyFilter,
    handler: DataHandler,
  ): Promise<FindAllResult<Activity>> {
    filter.order = { createdAt: -1 };
    return await super.findManyWithPaging(filter, handler);
  }

  async createOne(
    data: CreateActivityData,
    handler: DataHandler,
  ): Promise<Activity> {
    const uncompletedActivity = await this._activitiesRepo.findOne({
      where: {
        resultCode: '',
        staffCode: handler.staffCode,
        customerCode: data.customerCode,
      },
      order: {
        performAt: 'DESC',
      },
    });
    const contract = await this._contractsRepo.findOne({
      where: { code: data.contractCode },
    });
    const result = await this._resultsRepo.findOne({
      where: { code: data.resultCode },
    });
    const customer = await this._customersRepo.findOne({
      where: { code: data.customerCode },
    });
    data.staffCode = handler.staffCode;
    data.performAt = new Date();

    if (uncompletedActivity === undefined || uncompletedActivity === null) {
      if (contract && contract.isDeleted === false) {
        if (contract.customerCode === data.customerCode) {
          if (result && result.isDeleted === false) {
            if (result.parentCode === data.resultParentCode) {
              return super.createOne(data, handler);
            } else {
              throw new BadRequestException(
                `Result '${data.resultParentCode}' and '${result.parentCode}' is not matched!`,
              );
            }
          } else if (data.resultCode === '') {
            const result = await super.createOne(data, handler);
            if (result) {
              if (customer) {
                const updateCustomerData: any = {
                  lastActivity: {
                    id: result.id,
                    parentCode: result.parentCode,
                    resultParentCode: result.resultParentCode,
                    ptpAmount: result.ptpAmount,
                    ptpDate: result.ptpDate,
                    performAt: result.performAt,
                  },
                  lastPTPActivity: {
                    id: '',
                    parentCode: '',
                    resultParentCode: '',
                    ptpAmount: 0,
                    ptpDate: undefined,
                    performAt: undefined,
                  },
                };
                if (result.ptpAmount > 0) {
                  updateCustomerData.lastPTPActivity.id = result.id;
                  updateCustomerData.lastPTPActivity.resultParentCode =
                    result.resultParentCode;
                  updateCustomerData.lastPTPActivity.resultCode =
                    result.resultCode;
                  updateCustomerData.lastPTPActivity.ptpAmount =
                    result.ptpAmount;
                  updateCustomerData.lastPTPActivity.ptpDate = result.ptpDate;
                  updateCustomerData.lastPTPActivity.performAt =
                    result.performAt;
                }
                this._customersRepo.update(customer.id, updateCustomerData);
              }
            }
            return result;
          } else {
            throw new BadRequestException(
              `Result '${data.resultCode}' is not existed!`,
            );
          }
        } else {
          throw new BadRequestException(
            `Customer '${data.customerCode}' and '${contract.customerCode}' is not matched!`,
          );
        }
      } else {
        throw new BadRequestException(
          `Contract '${data.customerCode}' is not existed!`,
        );
      }
    } else {
      console.log(uncompletedActivity);
      throw new BadRequestException(
        `There uncompleted report on ${uncompletedActivity.createdAt.toUTCString()}, please update result before make new activity!`,
      );
    }
  }
  async updateOne(
    id: ObjectID,
    data: any,
    handler: DataHandler,
  ): Promise<Activity> {
    const result = await super.updateOne(id, data, handler);
    if (result) {
      const activity = await super.findOne(id, handler);
      if (activity) {
        const customer = await this._customersRepo.findOne({
          where: { code: activity.customerCode },
        });
        if (customer) {
          const updateCustomerData: any = {
            lastActivity: {
              id: result.id,
              parentCode: activity.parentCode,
              resultParentCode: activity.resultParentCode,
              ptpAmount: activity.ptpAmount,
              ptpDate: activity.ptpDate,
              performAt: activity.performAt,
            },
            lastPTPActivity: {
              id: '',
              parentCode: '',
              resultParentCode: '',
              ptpAmount: 0,
              ptpDate: undefined,
              performAt: undefined,
            },
          };

          if (activity.ptpAmount > 0) {
            updateCustomerData.lastPTPActivity.id = activity.id;
            updateCustomerData.lastPTPActivity.resultParentCode =
              activity.resultParentCode;
            updateCustomerData.lastPTPActivity.resultCode = activity.resultCode;
            updateCustomerData.lastPTPActivity.ptpAmount = activity.ptpAmount;
            updateCustomerData.lastPTPActivity.ptpDate = activity.ptpDate;
            updateCustomerData.lastPTPActivity.performAt = activity.performAt;
          }
          const updateCustomerResult = await this._customersRepo.update(
            customer.id,
            updateCustomerData,
          );
        }
      }
    }
    return result;
  }
}
