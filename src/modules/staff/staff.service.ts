import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Staff } from './entity/staff.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { CreateStaffData, CreateStaffResult } from './dto/create.dto';

@Injectable()
export class StaffService extends BaseService<Staff> {
  constructor(
    @InjectRepository(Staff)
    private readonly ipsRepository: MongoRepository<Staff>,
  ) {
    super(ipsRepository);
  }
}
