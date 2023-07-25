import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Performance } from './entity/performance.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';

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
