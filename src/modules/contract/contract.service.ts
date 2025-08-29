import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Contract } from './entity/contract.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import { CreateContractData } from './dto/create.dto';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { Partner } from '../partner/entity/partner.entity';
import { Customer } from '../customer/entity/customer.entity';

@Injectable()
export class ContractService extends BaseService<Contract> {
  private _partnersRepo: MongoRepository<Partner>;
  private _customersRepo: MongoRepository<Customer>;
  constructor(
    @InjectRepository(Contract)
    private readonly contractsRepository: MongoRepository<Contract>,
    @InjectRepository(Partner)
    private readonly partnersRepository: MongoRepository<Partner>,
    @InjectRepository(Customer)
    private readonly customersRepo: MongoRepository<Customer>,
  ) {
    super(contractsRepository);
    this._partnersRepo = partnersRepository;
    this._customersRepo = customersRepo;
  }

  override async createOne(
    data: CreateContractData,
    handler: DataHandler,
  ): Promise<Contract> {
    const partner = await this._partnersRepo.findOne({
      where: { code: data.partnerCode },
    });
    const customer = await this._customersRepo.findOne({
      where: { code: data.customerCode },
    });

    if (partner) {
      if (customer) {
        if (customer.partnerCode === partner.code) {
          return super.createOne(data, handler);
        } else {
          throw new BadRequestException(
            `Customer '${data.customerCode}' does not related to Partner '${partner.code}'!`,
          );
        }
      } else {
        throw new BadRequestException(
          `Customer '${data.customerCode}' is not existed!`,
        );
      }
    } else {
      throw new BadRequestException(
        `Partner '${data.partnerCode}' is not existed!`,
      );
    }
  }

  override async updateOne(id: string, data: any, handler: DataHandler): Promise<any> {
    data.syncedAt = 0;
    data.queuedAt = 0;
    return super.updateOne(id, data, handler);
  }
}
