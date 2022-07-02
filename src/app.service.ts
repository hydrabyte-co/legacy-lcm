import { Injectable } from '@nestjs/common';
import { App } from './app.entity';

@Injectable()
export class AppService {
  app: App;
  constructor() {
    // Change App Id, App Name
    const appId = 'template-service';
    const appName = 'Template Service';
    this.app = new App(appId, appName);
  }

  getInfo(): App {
    return this.app;
  }
}
