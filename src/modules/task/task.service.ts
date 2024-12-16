import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Task } from './entity/task.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import {
  FindManyFilter,
  FindAllResult,
} from 'src/common/modules/base/dto/find-many.dto';
import { DataHandler } from 'src/common/modules/base/entity/data.class';

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
    return await this.findManyWithPaging(filter, handler);
  }
}
