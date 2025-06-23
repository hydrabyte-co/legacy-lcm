// import axios from 'axios';
// import * as _ from 'lodash';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mssql = require('mssql');
import { logInfo } from 'src/common/utils/log-helper';
import { MongoRepository } from 'typeorm';
import { Transaction } from 'src/modules/transaction/entity/transaction.entity';
import { log } from 'console';

export class PaymentMigrationWorker {
  private intervalDuration = parseInt(process.env.WORKER_INTERVAL || '30000');
  private migrationRecordsCount = parseInt(
    process.env.MIGRATION_RECORDS_COUNT || '100',
  );
  private sqlConnectionString = (process.env.MSSQLDB_URL || '').replace(
    'LCM',
    'COLLECTION_VH',
  );
  private isTerminated: boolean;
  private isJobProcessing: boolean;
  private intervalJob;
  private transactionsRepository: MongoRepository<Transaction>;
  private sqlConnection;

  constructor(transactionsRepository: MongoRepository<Transaction>) {
    this.transactionsRepository = transactionsRepository;
    this.isTerminated = false;
    this.isJobProcessing = false;
  }

  async start(): Promise<void> {
    logInfo(`*`, `Payment Migration Worker is started!`);
    try {
      this.sqlConnection = await mssql.connect(this.sqlConnectionString);
    } catch (error) {
      // MSSQL Connection error!
      logInfo(`*`, `Payment Migration -> sqlConnection error`, error);
    }
    if (this.sqlConnection) {
      logInfo(`*`, `SQL Connection established successfully.`);
      if (this.intervalJob === undefined) {
        this.intervalJob = setInterval(async () => {
          if (!this.isJobProcessing) {
            this.isJobProcessing = true;
            try {
              const findQuery = `SELECT TOP 10 * FROM [dbo].[REPAY] WHERE ISNULL(SYNCED_AT,0) = 0 ORDER BY BUSINESS_DATE DESC`;
              const findResult = await mssql.query(findQuery);
              if (
                findResult &&
                findResult.recordset &&
                findResult.recordset.length > 0
              ) {
                console.log(`\n`);
                console.log(`\n`);
                logInfo(
                  `*`,
                  `Found ${findResult.recordset.length} records to migrate.`,
                  findQuery,
                );
                for (let i = 0; i < findResult.recordset.length; i++) {
                  const record = findResult.recordset[i];
                  const transaction = new Transaction();
                  transaction.amount = Number(record.TOTAL_REPAY) || 0;
                  transaction.staffCode = record.callStaffCode || '';
                  transaction.date = record.BUSINESS_DATE;
                  transaction.customerCode = record.ID_CODE || '';
                  transaction.contractCode = record.CONTRACT_NO || '';
                  transaction.partnerCode = record.BANK || '';

                  // Save to MongoDB
                  const result =
                    (await this.transactionsRepository.save(transaction)) ||
                    transaction;

                  // Update SQL record as synced
                  // Format BUSINESS_DATE as 'YYYY-MM-DD HH:mm:ss.SSS' (using UTC to avoid timezone offset)
                  const businessDate = new Date(record.BUSINESS_DATE);
                  const pad = (n: number, z = 2) => ('00' + n).slice(-z);
                  const formattedBusinessDate =
                    businessDate.getUTCFullYear() +
                    '-' +
                    pad(businessDate.getUTCMonth() + 1) +
                    '-' +
                    pad(businessDate.getUTCDate()) +
                    ' ' +
                    pad(businessDate.getUTCHours()) +
                    ':' +
                    pad(businessDate.getUTCMinutes()) +
                    ':' +
                    pad(businessDate.getUTCSeconds()) +
                    '.' +
                    pad(businessDate.getUTCMilliseconds(), 3);

                  const updateQuery = `UPDATE [dbo].[REPAY] SET SYNCED_AT = ${new Date().getTime()} WHERE ID_CODE = '${
                    record.ID_CODE
                  }' AND CONTRACT_NO = '${
                    record.CONTRACT_NO
                  }' AND BUSINESS_DATE = '${formattedBusinessDate}' AND TOTAL_REPAY = ${
                    record.TOTAL_REPAY
                  }`;
                  const updateRecordResult = await mssql.query(updateQuery);

                  logInfo(
                    `*`,
                    `Record (${i + 1}/${
                      findResult.recordset.length
                    }) => Transaction, `,
                    JSON.stringify(record),
                    JSON.stringify(result),
                    updateQuery,
                    JSON.stringify(updateRecordResult),
                  );
                }
              } else {
                logInfo(`*`, `No records found to migrate.`);
              }
            } catch (error) {
              logInfo(`*`, `Error during migration job:`, error);
            }

            this.isJobProcessing = false;
          }
        }, this.intervalDuration);
      }
    }
  }

  async terminate() {
    logInfo(`*`, `Worker is terminating...`);
    if (this.intervalJob) {
      clearInterval(this.intervalJob);
      if (this.sqlConnection) {
        try {
          await this.sqlConnection.close();
          logInfo(`*`, `SQL Connection closed successfully.`);
        } catch (error) {
          logInfo(`*`, `Error closing SQL connection:`, error);
        }
      }
    }
  }
}
