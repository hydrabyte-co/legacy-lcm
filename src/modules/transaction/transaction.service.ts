import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from '../../common/modules/base/base.service';
import {
    FindAllResult,
    FindManyFilter,
} from '../../common/modules/base/dto/find-many.dto';
import { DataHandler } from '../../common/modules/base/entity/data.class';
import { Transaction } from './entity/transaction.entity';

@Injectable()
export class TransactionService extends BaseService<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: MongoRepository<Transaction>,
  ) {
    super(transactionsRepository);
  }

  async findManyWithPaging(
    filter: FindManyFilter,
    handler: DataHandler,
  ): Promise<FindAllResult<Transaction>> {
    filter.order = { date: -1 };
    return await super.findManyWithPaging(filter, handler);
  }

  async findOneByCode(code: string, handler: DataHandler): Promise<any> {
    return super.findOneByField('code', code, handler);
  }

  override async updateOne(id: string, data: any, handler: DataHandler): Promise<any> {
    data.syncedAt = 0;
    data.queuedAt = 0;
    return super.updateOne(id, data, handler);
  }
}
