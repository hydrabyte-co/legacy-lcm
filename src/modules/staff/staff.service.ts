import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from '../../common/modules/base/base.service';
import { Staff } from './entity/staff.entity';

@Injectable()
export class StaffService extends BaseService<Staff> {
  constructor(
    @InjectRepository(Staff)
    private readonly ipsRepository: MongoRepository<Staff>,
  ) {
    super(ipsRepository);
  }
}
