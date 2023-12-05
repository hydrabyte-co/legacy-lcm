import { Controller, Param, Post, Req } from '@nestjs/common';
import { EventService } from './event.service';
import {
  Ctx,
  EventPattern,
  NatsContext,
  RmqContext,
} from '@nestjs/microservices';
import { MessagePattern as EventPatterns } from './enum/event.enum';
import { Controllers } from 'src/common/enums/controllers';
import { logInfo } from 'src/common/utils/log-helper';

@Controller(Controllers.Event)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @EventPattern(EventPatterns.DataMigration)
  async handleDataMigartion(data: any, @Ctx() context: RmqContext) {
    const start = new Date();
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    // logInfo('*', `EventController.handleDataMigartion -> dataString:`, data);
    await this.eventService.handleDataMigration(data);
    logInfo(
      '*',
      `EventController.handleDataMigartion -> start at ${start} and ack after ${
        (new Date().getTime() - start.getTime()) / 1000
      } seconds`,
    );
    channel.ack(originalMsg);
    return 'ack';
  }

  @EventPattern(EventPatterns.MSSQLTableImport)
  async handleMSSQLTableImport(data: any, @Ctx() context: RmqContext) {
    const start = new Date();
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    await this.eventService.handleSQLTableImport(data);
    logInfo(
      '*',
      `EventController.handleMSSQLTableImport -> ack after ${
        (new Date().getTime() - start.getTime()) / 1000
      } seconds`,
    );
    channel.ack(originalMsg);
    return 'ack';
  }
}
