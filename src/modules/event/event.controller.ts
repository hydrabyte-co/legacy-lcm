import { Controller, Param, Post, Req } from '@nestjs/common';
import { EventService } from './event.service';
import { Ctx, EventPattern, NatsContext } from '@nestjs/microservices';
import { MessagePattern as EventPatterns } from './enum/event.enum';
import { Controllers } from 'src/common/enums/controllers';
import { logInfo } from 'src/common/utils/log-helper';

@Controller(Controllers.Event)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @EventPattern(EventPatterns.DataMigration)
  async handleDataMigartion(data: any) {
    const start = new Date();
    // logInfo('*', `EventController.handleDataMigartion -> dataString:`, data);
    await this.eventService.handleDataMigartion(data);
    logInfo(
      '*',
      `EventController.handleDataMigartion -> ack after ${
        (new Date().getTime() - start.getTime()) / 1000
      } seconds`,
    );
    return 'ack';
  }

  @EventPattern(EventPatterns.MSSQLTableImport)
  async handleMSSQLTableImport(data: any, @Ctx() context: NatsContext) {
    const start = new Date();
    await this.eventService.handleSQLTableImport(data);
    logInfo(
      '*',
      `EventController.handleDataMigartion -> ack after ${
        (new Date().getTime() - start.getTime()) / 1000
      } seconds`,
    );
    return 'ack';
  }
}
