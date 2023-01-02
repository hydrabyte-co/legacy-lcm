// import axios from 'axios';
// import * as _ from 'lodash';

export class SampleWorker {
  private intervalDuration = parseInt(process.env.WORKER_INTERVAL || '30000');
  private isTerminated: boolean;
  private isJobProcessing: boolean;
  private intervalJob;
  private campaigns: any;

  // constructor() {}
  /* constructor(private readonly ProductsService: ProductsService) {
    this.ProductsService = ProductsService;
    this.isTerminated = false;
    this.isJobProcessing = false;
  } */

  async start(): Promise<void> {
    console.log(`Starting job...`);
    if (this.intervalJob === undefined) {
      this.intervalJob = setInterval(async () => {
        if (!this.isJobProcessing) {
          console.log();
          console.log(`-- Job is processing...`);
          /*  const query = new FindAllProductsFilter();
          this.isJobProcessing = true;
          console.log(`---- Foo query:`, query);
          const products = await this.ProductsService.findManyWithPaging(
            {},
            {},
            0,
            10,
            { orgId: '', appId: '', userId: '', roles: [] },
          );
          // TODO: should seperate campaign to multi thread?
          for (let i = 0; i < products.length; i++) {
            const now = new Date();
            const foo = products[i];
            console.log(`---- Foo id:${foo.id} `, foo);
            console.log(`------- Do bar at ${now}`);
          } */
          this.isJobProcessing = false;
        }
      }, this.intervalDuration);
    }
  }
}
