import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from '../../common/modules/base/base.service';
import {
    FindAllResult,
    FindManyFilter,
} from '../../common/modules/base/dto/find-many.dto';
import { DataHandler } from '../../common/modules/base/entity/data.class';
import { Call } from './entity/call.entity';

@Injectable()
export class CallService extends BaseService<Call> {
  constructor(
    @InjectRepository(Call, 'voice')
    private readonly callRepo: MongoRepository<Call>,
  ) {
    super(callRepo);
  }

  async findManyWithPaging(
    filter: FindManyFilter,
    handler: DataHandler,
  ): Promise<FindAllResult<Call>> {
    filter.order = {
      createdAt: 'DESC',
    };
    return await super.findManyWithPaging(filter, handler);
  }
}
