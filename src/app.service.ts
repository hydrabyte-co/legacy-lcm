import { Injectable } from '@nestjs/common';
import { App } from './app.entity';

@Injectable()
export class AppService {
  app: App;
  constructor() {
    // Change App Id, App Name
    const appId = 'lcm-service';
    const appName = 'LCM Service';
    this.app = new App(appId, appName);
  }

  getInfo(): App {
    return this.app;
  }
}
