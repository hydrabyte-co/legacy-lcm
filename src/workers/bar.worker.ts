import axios from 'axios';
import * as _ from 'lodash';
import { FoosService } from 'src/resources/foos//foos.service';

export class BarWorker {
  private intervalDuration = parseInt(process.env.WORKER_INTERVAL || '30000');
  private isTerminated: boolean;
  private isJobProcessing: boolean;
  private intervalJob;
  private campaigns: any;

  constructor(private readonly foosService: FoosService) {
    this.foosService = foosService;
    this.isTerminated = false;
    this.isJobProcessing = false;
  }

  async start(): Promise<void> {
    console.log(`Starting job...`);
    if (this.intervalJob === undefined) {
      this.intervalJob = setInterval(async () => {
        if (!this.isJobProcessing) {
          console.log();
          console.log(`-- Job is processing...`);
          const fooQuery = {
            order: { createdAt: 'ASC' },
            where: {
              isActive: true,
            },
          };
          this.isJobProcessing = true;
          console.log(`---- Foo query:`, fooQuery);
          const foos = await this.foosService.findAll(fooQuery);
          // TODO: should seperate campaign to multi thread?
          for (let i = 0; i < foos.length; i++) {
            const now = new Date();
            const foo = foos[i];
            console.log(`---- Foo id:${foo.id} `, foo);
            console.log(`------- Do bar at ${now}`);
          }
          this.isJobProcessing = false;
        }
      }, this.intervalDuration);
    }
  }
}
