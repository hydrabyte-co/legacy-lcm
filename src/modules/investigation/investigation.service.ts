import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from '../../common/modules/base/base.service';
import { DataHandler } from '../../common/modules/base/entity/data.class';
import { Investigation } from './entity/investigation.entity';

@Injectable()
export class InvestigationService extends BaseService<Investigation> {
  constructor(
    @InjectRepository(Investigation)
    private readonly investigationsRepository: MongoRepository<Investigation>,
  ) {
    super(investigationsRepository);
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
