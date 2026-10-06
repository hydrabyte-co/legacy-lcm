import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ScheduledTaskLog } from './scheduled-task-log.entity';
import { BaseService } from 'src/common/modules/base/base.service';
@Injectable()
export class ScheduledTaskLogService extends BaseService<ScheduledTaskLog> {
  constructor(
    @InjectRepository(ScheduledTaskLog)
    private readonly logRepo: MongoRepository<ScheduledTaskLog>,
  ) {
    super(logRepo);
  }
}
