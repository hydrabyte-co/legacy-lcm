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

@Injectable()
export class ActivityService extends BaseService<Activity> {
  private _activitiesRepo: MongoRepository<Activity>;
  private _customersRepo: MongoRepository<Customer>;
  //private _customersRepo: MongoRepository<Customer>;
  private _contractsRepo: MongoRepository<Contract>;
  private _resultsRepo: MongoRepository<Result>;
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: MongoRepository<Activity>,
    //@InjectRepository(Customer)
    //private readonly customersRepository: MongoRepository<Customer>,
    @InjectRepository(Contract)
    private readonly contractsRepository: MongoRepository<Contract>,
    @InjectRepository(Result)
    private readonly resultsRepository: MongoRepository<Result>,
  ) {
    super(activitiesRepository);
    this._activitiesRepo = activitiesRepository;
    this._contractsRepo = contractsRepository;
    this._resultsRepo = resultsRepository;
  }

  async findOneByCode(code: string, handler: DataHandler): Promise<any> {
    return super.findOneByField('code', code, handler);
  }

  async createOne(
    data: CreateActivityData,
    handler: DataHandler,
  ): Promise<Activity> {
    const uncompletedActivity = await this._activitiesRepo.findOne({
      where: { resultCode: '', staffCode: handler.staffCode },
      order: {
        createdAt: 'DESC',
      },
    });
    const contract = await this._contractsRepo.findOne({
      where: { code: data.contractCode },
    });
    const result = await this._resultsRepo.findOne({
      where: { code: data.resultCode },
    });
    data.staffCode = handler.staffCode;

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
            return super.createOne(data, handler);
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
      throw new BadRequestException(
        `There uncompleted report on ${uncompletedActivity.createdAt.toUTCString()}, please update result before make new activity!`,
      );
    }
  }
}
