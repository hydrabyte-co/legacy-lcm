import { Controller, Param, Post, Req } from '@nestjs/common';
import { EventService } from './event.service';
import { EventPattern } from '@nestjs/microservices';
import { MessagePattern as MessagePatterns } from './enum/event.enum';
import { logData, logInfo } from 'src/common/utils/log-helper';

@Controller('webhook')
export class EventController {
  constructor(private readonly webhookService: EventService) {}

  @EventPattern(MessagePatterns.DataMigration)
  async handleDataMigartion(dataString: Record<string, unknown>) {
    const data = JSON.parse(dataString.toString());
    await this.handleDataMigartion(data);
    return 'ack';
  }
}
