import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from '../../common/modules/base/base.service';
import { DataHandler } from '../../common/modules/base/entity/data.class';
import { Partner } from './entity/partner.entity';

@Injectable()
export class PartnerService extends BaseService<Partner> {
  constructor(
    @InjectRepository(Partner)
    private readonly partnersRepository: MongoRepository<Partner>,
  ) {
    super(partnersRepository);
  }

  async findOneByCode(code: string, handler: DataHandler): Promise<any> {
    return super.findOneByField('code', code, handler);
  }
}
