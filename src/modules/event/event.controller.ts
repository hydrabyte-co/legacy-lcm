import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext
} from '@nestjs/microservices';
import { Resources } from '../../common/enums/resources';
import { logInfo } from '../../common/utils/log-helper';
import { MessagePattern as EventPatterns } from './enum/event.enum';
import { EventService } from './event.service';

@Controller(Resources.Event)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @EventPattern(EventPatterns.DataMigration)
  async handleDataMigartion(@Payload() data: any, @Ctx() context: RmqContext) {
    const start = new Date();
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    logInfo('*', `EventController.handleDataMigartion -> data`, data);
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
  async handleMSSQLTableImport(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
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
