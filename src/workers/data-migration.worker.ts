// import axios from 'axios';
// import * as _ from 'lodash';

import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { logInfo } from 'src/common/utils/log-helper';
import { DataMigrationService } from 'src/modules/data-migration/data-migration.service';
import { CreateDataMigrationData } from 'src/modules/data-migration/dto/create.dto';
import { DataMigration } from 'src/modules/data-migration/entity/data-migration.entity';
import { DataMigration_Collections } from 'src/modules/data-migration/enum/data-migration.enum';

export class DataMigrationWorker {
  private intervalDuration = parseInt(process.env.WORKER_INTERVAL || '10000');
  private migrationRecordsCount = parseInt(
    process.env.MIGRATION_RECORDS_COUNT || '100',
  );
  private isTerminated: boolean;
  private isJobProcessing: boolean;
  private intervalJob;

  // constructor() {}
  constructor(private readonly dataMigrationService: DataMigrationService) {
    this.isTerminated = false;
    this.isJobProcessing = false;
  }

  async start(): Promise<void> {
    logInfo(`*`, `Data Migration Worker is started!`);
    if (this.intervalJob === undefined) {
      this.intervalJob = setInterval(async () => {
        if (!this.isJobProcessing) {
          logInfo(`*`, `Doing job...`);
          this.isJobProcessing = true;
          const currentTimestamp = new Date().getTime();
          const dataMigration: CreateDataMigrationData = {
            collectionName: DataMigration_Collections.Customers,
            note: '',
            filter: {
              where: {
                $and: [
                  {
                    $or: [
                      {
                        syncedAt: {
                          $lte: currentTimestamp - 1000 * 60 * 60 * 24,
                        },
                      },
                      {
                        syncedAt: null,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        queuedAt: {
                          $lte: currentTimestamp - 1000 * 60 * 10,
                        },
                      },
                      {
                        queuedAt: null,
                      },
                    ],
                  },
                ],
              },
            },
            recordsCount: this.migrationRecordsCount,
            createdBy: new DataHandler(),
            createdAt: undefined,
          };
          const createDMResult = await this.dataMigrationService.createNoData(
            dataMigration,
          );
          logInfo(`*`, `DataMigrationWorker -> `, createDMResult);

          this.isJobProcessing = false;
        }
      }, this.intervalDuration);
    }
  }

  async terminate() {
    logInfo(`*`, `Worker is terminating...`);
    if (this.intervalJob) {
      clearInterval(this.intervalJob);
    }
  }
}
