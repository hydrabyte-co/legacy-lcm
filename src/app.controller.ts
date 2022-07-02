import { Controller, Get, Req } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { App } from './app.entity';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getInfo(): App {
    return this.appService.getInfo();
  }

  @EventPattern('event')
  async handleEvent(data: Record<string, unknown>) {
    console.log(data);
  }
}
