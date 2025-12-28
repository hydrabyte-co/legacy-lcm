import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from '../../common/modules/base/base.service';
import { DataHandler } from '../../common/modules/base/entity/data.class';
import { Result } from './entity/result.entity';

@Injectable()
export class ResultService extends BaseService<Result> {
  constructor(
    @InjectRepository(Result)
    private readonly resultsRepository: MongoRepository<Result>,
  ) {
    super(resultsRepository);
  }

  async findOneByCode(code: string, handler: DataHandler): Promise<any> {
    return super.findOneByField('code', code, handler);
  }
}
