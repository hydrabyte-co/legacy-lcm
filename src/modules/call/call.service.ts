import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Call } from './entity/call.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import {
  FindManyFilter,
  FindAllResult,
} from 'src/common/modules/base/dto/find-many.dto';
import { DataHandler } from 'src/common/modules/base/entity/data.class';

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
