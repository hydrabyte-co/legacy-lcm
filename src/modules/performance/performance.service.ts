import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from '../../common/modules/base/base.service';
import { DataHandler } from '../../common/modules/base/entity/data.class';
import { Performance } from './entity/performance.entity';

@Injectable()
export class PerformanceService extends BaseService<Performance> {
  constructor(
    @InjectRepository(Performance)
    private readonly performancesRepository: MongoRepository<Performance>,
  ) {
    super(performancesRepository);
  }

  async findOneByCode(code: string, handler: DataHandler): Promise<any> {
    return super.findOneByField('code', code, handler);
  }
}
