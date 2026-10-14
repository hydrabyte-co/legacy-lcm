import { NotFoundException } from '@nestjs/common';
import { Filter } from './constant/base.const';
import { FindManyFilter } from './dto/find-many.dto';
import { DataHandler } from './entity/data.class';
import { DeleteOneResult } from 'src/common/types/controller-dto';
import { Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { VCMMessageQueuePayload } from 'src/common/types/event';
import {
  logMessageQueueInfo,
  logMessageQueueResult,
} from 'src/common/utils/log-helper';
export class BaseController {
  private _serivce;
  constructor(service) {
    this._serivce = service;
  }
  async handleEventPatterResult(
    @Payload() data: VCMMessageQueuePayload,
    @Ctx() context: RmqContext,
    handleResult: boolean,
  ) {
    const start = context['receivedAt']
      ? new Date(context['receivedAt'])
      : new Date();
    const pattern = context.getPattern();
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    logMessageQueueInfo(pattern, data);
    logMessageQueueResult(pattern, start, handleResult);
    if (handleResult) {
      channel.ack(originalMsg);
    }
    return 'ack';
  }

  async findOne(id: string, req): Promise<any> {
    const handler = req.user || new DataHandler();
    if (this._serivce.findOne) {
      return await this._serivce.findOne(id, handler);
    } else {
      throw new NotFoundException(`Method 'findOne' is not found!`);
    }
  }
  async createOne(data, req): Promise<any> {
    const handler = req.user || new DataHandler();
    if (this._serivce.createOne) {
      return await this._serivce.createOne(data, handler);
    } else {
      throw new NotFoundException(`Method 'createOne' is not found!`);
    }
  }

  async createMany(data, req): Promise<any> {
    const handler = req.user || new DataHandler();
    if (this._serivce.createMany) {
      return await this._serivce.createMany(data, handler);
    } else {
      throw new NotFoundException(`Method 'createMany' is not found!`);
    }
  }

  async findManyWithPaging(queries, req): Promise<any> {
    const handler = req.user || new DataHandler();
    const filter = new FindManyFilter();
    filter.order = queries.orderBy || {};
    filter.paging.index = parseInt(queries.pageIndex || Filter.PageIndex);
    filter.paging.size = parseInt(queries.pageSize || Filter.PageSize);

    delete queries.orderBy;
    delete queries.pageIndex;
    delete queries.pageSize;
    filter.where = queries;
    if (this._serivce.findManyWithPaging) {
      return await this._serivce.findManyWithPaging(filter, handler);
    } else {
      throw new NotFoundException(`Method 'findManyWithPaging' is not found!`);
    }
  }
  async updateOne(id, data, req): Promise<any> {
    const handler = req.user || new DataHandler();
    if (this._serivce.updateOne) {
      return await this._serivce.updateOne(id, data, handler);
    } else {
      throw new NotFoundException(`Method 'updateOne' is not found!`);
    }
  }
  async deleteOne(id: string, req): Promise<DeleteOneResult> {
    const handler = req.user || new DataHandler();
    if (this._serivce.deleteOne) {
      return await this._serivce.deleteOne(id, handler);
    } else {
      throw new NotFoundException(`Method 'deleteOne' is not found!`);
    }
  }
}
