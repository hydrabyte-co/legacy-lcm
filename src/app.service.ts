import { Injectable } from '@nestjs/common';
import { App } from './app.entity';
import { BuildInfoService } from './build-info.service';

@Injectable()
export class AppService {
  private app: App;
  
  constructor(private readonly buildInfoService: BuildInfoService) {
    // Initialize app info with build and runtime data
    const appId = 'lcm-service';
    const appName = 'LCM Service';
    const buildAt = this.buildInfoService.getBuildAt();
    const processId = this.buildInfoService.getProcessId();
    
    this.app = new App(appId, appName, buildAt, processId);
  }

  getInfo(): App {
    // Update processId in case it changes (though unlikely in production)
    this.app.processId = this.buildInfoService.getProcessId();
    return this.app;
  }
}
