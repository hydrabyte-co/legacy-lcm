import { Controller, Param, Post, Req } from '@nestjs/common';
import { EventService } from './event.service';
import { EventPattern } from '@nestjs/microservices';
import { MessagePattern as MessagePatterns } from './enum/event.enum';
import { Controllers } from 'src/common/enums/controllers';
import { logInfo } from 'src/common/utils/log-helper';

@Controller(Controllers.Event)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @EventPattern(MessagePatterns.DataMigration)
  async handleDataMigartion(data: any) {
    // logInfo('*', `EventController.handleDataMigartion -> dataString:`, data);
    await this.eventService.handleDataMigartion(data);
    return 'ack';
  }

  @EventPattern(MessagePatterns.MSSQLTableImport)
  async handleMSSQLTableImport(data: any) {
    await this.eventService.handleSQLTableImport(data);
    return 'ack';
  }
}
