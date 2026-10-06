import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ScheduledTask } from './scheduled-task.entity';
import { BaseService } from 'src/common/modules/base/base.service';
@Injectable()
export class ScheduledTaskService extends BaseService<ScheduledTask> {
  constructor(
    @InjectRepository(ScheduledTask)
    private readonly stRepo: MongoRepository<ScheduledTask>,
  ) {
    super(stRepo);
  }
}
