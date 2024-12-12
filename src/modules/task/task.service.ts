import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Task } from './entity/task.entity';
import { BaseService } from 'src/common/modules/base/base.service';

@Injectable()
export class TaskService extends BaseService<Task> {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: MongoRepository<Task>,
  ) {
    super(taskRepo);
  }
}
