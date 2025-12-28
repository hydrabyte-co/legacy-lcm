import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from '../../common/modules/base/base.service';
import {
    FindAllResult,
    FindManyFilter,
} from '../../common/modules/base/dto/find-many.dto';
import { DataHandler } from '../../common/modules/base/entity/data.class';
import { Task } from './entity/task.entity';

@Injectable()
export class TaskService extends BaseService<Task> {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: MongoRepository<Task>,
  ) {
    super(taskRepo);
  }

  async findManyWithPaging(
    filter: FindManyFilter,
    handler: DataHandler,
  ): Promise<FindAllResult<Task>> {
    filter.order = {
      createdAt: 'DESC',
    };
    return await super.findManyWithPaging(filter, handler);
  }
}
