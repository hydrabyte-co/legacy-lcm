import { ObjectId } from 'mongodb';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mssql = require('mssql');
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DataMigration } from '../data-migration/entity/data-migration.entity';
import { logInfo } from 'src/common/utils/log-helper';
import {
  DataMigration_Collections,
  DataMigration_Status,
} from '../data-migration/enum/data-migration.enum';
import { Customer } from '../customer/entity/customer.entity';
import { Contract } from '../contract/entity/contract.entity';
import { Activity } from '../activity/entity/activity.entity';
import { Reference } from '../reference/entity/reference.entity';
import { Investigation } from '../investigation/entity/investigation.entity';
import { ClientProxy } from '@nestjs/microservices';
import { Services } from 'src/common/enums/services';
import { MessagePattern } from './enum/event.enum';
import { MSSQLActivity } from '../data-migration/entity/sql-table';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(DataMigration)
    private readonly dataMigrationRepo: MongoRepository<DataMigration>,
    @InjectRepository(Customer)
    private readonly customerRepo: MongoRepository<Customer>,
    @InjectRepository(Contract)
    private readonly contractRepo: MongoRepository<Contract>,
    @InjectRepository(Activity)
    private readonly activityRepo: MongoRepository<Activity>,
    @InjectRepository(Reference)
    private readonly referenceRepo: MongoRepository<Reference>,
    @InjectRepository(Investigation)
    private readonly investigationRepo: MongoRepository<Investigation>,
    @Inject(Services.LCM) private client: ClientProxy,
  ) {}
  async handleDataMigartion(data: any): Promise<any> {
    logInfo(`*`, `EventService.handleDataMigartion -> data`, data);
    const batchSize = 1000;
    let itemsCount = 0;
    let batchCount = 0;
    let updateStatusResult;

    switch (data.collectionName) {
      case DataMigration_Collections.Activities: {
        itemsCount = await this.activityRepo.countBy(data.filter?.where || {});
        break;
      }
      case DataMigration_Collections.Contracts: {
        itemsCount = await this.contractRepo.countBy(data.filter?.where);
        break;
      }
      case DataMigration_Collections.Customers: {
        itemsCount = await this.customerRepo.countBy(data.filter?.where);
        break;
      }
      case DataMigration_Collections.Investigations: {
        itemsCount = await this.investigationRepo.countBy(data.filter?.where);
        break;
      }
      case DataMigration_Collections.References: {
        itemsCount = await this.referenceRepo.countBy(data.filter?.where);
        break;
      }
      default:
        break;
    }
    if (data.recordsCount > 0) {
      if (itemsCount > data.recordsCount) {
        itemsCount = data.recordsCount;
      }
    }
    logInfo(`*`, `EventService.handleDataMigartion -> itemsCount`, itemsCount);
    if (itemsCount < batchSize) {
      batchCount = 1;
    } else {
      batchCount = Math.round(itemsCount / batchSize);
    }

    //batchCount = 1;

    if (data.id && data.id?.length > 0) {
      updateStatusResult = await this.dataMigrationRepo.updateOne(
        {
          _id: ObjectId.createFromHexString(data.id),
        },
        {
          $set: {
            status: DataMigration_Status.InProgress,
            results: {
              totalCount: itemsCount,
              processedCount: 0,
              successCount: 0,
              failedCount: 0,
            },
          },
        },
      );
      logInfo(
        `*`,
        `EventService.handleDataMigartion -> updateStatusResult 'in-progress'`,
        updateStatusResult,
      );
    }

    for (let i = 0; i < batchCount; i++) {
      let documents = [];
      logInfo(
        `*`,
        `EventService.handleDataMigartion -> batch ${i + 1}/${batchCount}`,
      );
      const documentFilter = {
        where: data.filter?.where || {},
        order: data.filter?.order || {},
        take: batchSize,
        skip: i * batchSize,
      };
      logInfo(
        `*`,
        `EventService.handleDataMigartion -> documentFilter`,
        documentFilter,
      );
      switch (data.collectionName) {
        case DataMigration_Collections.Activities: {
          documents = await this.activityRepo.find(documentFilter);
          break;
        }
        case DataMigration_Collections.Contracts: {
          documents = await this.contractRepo.find(documentFilter);
          break;
        }
        case DataMigration_Collections.Customers: {
          documents = await this.customerRepo.find(documentFilter);
          break;
        }
        case DataMigration_Collections.Investigations: {
          documents = await this.investigationRepo.find(documentFilter);
          break;
        }
        case DataMigration_Collections.References: {
          documents = await this.referenceRepo.find(documentFilter);
          break;
        }
        default:
          break;
      }
      logInfo(
        `*`,
        `EventService.handleDataMigartion -> documents`,
        documents.length,
      );
      for (let j = 0; j < documents.length; j++) {
        const document = documents[j];
        logInfo(
          `*`,
          `EventService.handleDataMigartion -> document ${j + 1}/${
            documents.length
          }`,
          document.id,
        );
        const emitResult = await this.client.emit(
          MessagePattern.MSSQLTableImport,
          {
            collectionName: data.collectionName,
            tableName: data.collectionName,
            data: document,
            dataMigrationId: data.id,
          },
        );
        /* logInfo(
          `*`,
          `DataMigration.Service.createOne -> emitResult`,
          emitResult,
        ); */
        const subscriberResult = await emitResult.subscribe();
        /*  logInfo(
          `*`,
          `DataMigration.Service.createOne -> subscriberResult`,
          subscriberResult,
        ); */
      }
    }
    if (data.id && data.id?.length > 0) {
      updateStatusResult = await this.dataMigrationRepo.updateOne(
        {
          _id: ObjectId.createFromHexString(data.id),
        },
        { $set: { status: DataMigration_Status.Done } },
      );
      logInfo(
        `*`,
        `EventService.handleDataMigartion -> updateStatusResult 'done'`,
        updateStatusResult,
      );
    }

    return {};
  }

  async handleSQLTableImport(data: any): Promise<any> {
    let isImportSuccess = false;
    logInfo(`*`, `EventService.handleSQLTableImport -> data`, data);
    if (data) {
      let connectResult;
      try {
        connectResult = await mssql.connect(process.env.MSSQLDB_URL || '');
      } catch (error) {
        // MSSQL Connection error!
      }
      if (connectResult) {
        const findQuery = `SELECT * FROM LCM.dbo.${data.tableName} WHERE refId='${data.data.id}'`;
        let insertQuery = ``;
        // let updateQuery = ``;
        switch (data.collectionName) {
          case DataMigration_Collections.Activities: {
            const importData = new MSSQLActivity();
            importData.refId = data.data?.id;
            importData.contactNote = data.data?.contactInfo?.note;
            importData.contractCode = data.data?.contractCode;
            importData.createdAt = data.data?.createdAt;
            importData.customerCode = data.data?.customerCode;
            importData.note = data.data?.note;
            importData.phoneNumber = data.data?.contactInfo?.phoneNumber;
            importData.ptpAmount = data.data?.ptpAmount;
            importData.relationCode = data.data?.contactInfo?.relation?.code;
            importData.relationName = data.data?.contactInfo?.relation?.name;
            importData.resultCode = data.data?.resultCode;
            importData.resultParentCode = data.data?.resultParentCode;
            importData.staffCode = data.data?.staffCode;
            importData.fullname = data.data?.contactInfo?.fullname;
            importData.type = data.data?.type;

            for (const key in importData) {
              if (typeof importData[key] === 'string') {
                importData[key] = importData[key].toString().replace(/'/g, '');
              }
            }

            insertQuery = `INSERT INTO [dbo].[activities]
        ([refId]
        ,[contractCode]
        ,[customerCode]
        ,[staffCode]
        ,[type]
        ,[resultCode]
        ,[resultParentCode]
        ,[note]
        ,[ptpAmount]
        ,[createdAt]
        ,[relationCode]
        ,[relationName]
        ,[phoneNumber]
        ,[contactNote]
        ,[ptpDate]
        ,[fullname])
  VALUES
        (
        '${importData.refId}'
        ,'${importData.contractCode}'
        ,'${importData.customerCode}'
        ,'${importData.staffCode}'
        ,'${importData.type}'
        ,'${importData.resultCode}'
        ,'${importData.resultParentCode}'
        ,N'${importData.note}'
        ,${importData.ptpAmount || 0}
        ,'${importData.createdAt || ''}'
        ,'${importData.relationCode}'
        ,N'${importData.relationName}'
        ,'${importData.phoneNumber}'
        ,N'${importData.contactNote || ''}'
        ,'${importData.ptpDate || ''}'
        ,N'${importData.fullname}')`;
            break;
          }
          case DataMigration_Collections.Contracts: {
            break;
          }
          case DataMigration_Collections.Customers: {
            break;
          }
          case DataMigration_Collections.Investigations: {
            break;
          }
          case DataMigration_Collections.References: {
            break;
          }
          default:
            break;
        }

        let findResult;
        try {
          findResult = await mssql.query(findQuery);
        } catch (error) {
          // MSSQL Connection error!
        }
        if (findResult) {
          logInfo(
            `*`,
            `EventService.handleSQLTableImport -> findResult`,
            findResult,
          );
          logInfo(
            `*`,
            `EventService.handleSQLTableImport -> importQuery`,
            insertQuery,
          );
          let importResult;
          if (findResult?.recordset?.length > 0) {
            try {
              importResult = await mssql.query(insertQuery);
            } catch (error) {
              // MSSQL Connection error!
            }
          } else {
            try {
              importResult = await mssql.query(insertQuery);
            } catch (error) {
              // MSSQL Connection error!
            }
          }
          logInfo(
            `*`,
            `EventService.handleSQLTableImport -> importResult`,
            importResult,
          );

          let updateDataMigrationResult;
          if (importResult) {
            isImportSuccess = true;
            switch (data.collectionName) {
              case DataMigration_Collections.Activities: {
                const updateDocumentResult = await this.activityRepo.updateMany(
                  {
                    _id: ObjectId.createFromHexString(data.data.id),
                  },
                  {
                    $set: {
                      syncedAt: new Date().getTime(),
                    },
                  },
                );
                logInfo(
                  `*`,
                  `EventService.handleSQLTableImport -> updateDocumentResult`,
                  updateDocumentResult,
                );
                break;
              }
              case DataMigration_Collections.Contracts: {
                break;
              }
              case DataMigration_Collections.Customers: {
                break;
              }
              case DataMigration_Collections.Investigations: {
                break;
              }
              case DataMigration_Collections.References: {
                break;
              }
              default:
                break;
            }
            if (data.dataMigrationId && data.dataMigrationId?.length > 0) {
              updateDataMigrationResult =
                await this.dataMigrationRepo.updateOne(
                  {
                    _id: ObjectId.createFromHexString(data.dataMigrationId),
                  },
                  {
                    $inc: {
                      'results.processedCount': 1,
                      'results.successCount': 1,
                    },
                  },
                );
              logInfo(
                `*`,
                `EventService.handleSQLTableImport -> updateDataMigrationResult`,
                updateDataMigrationResult,
              );
            }
          }
        }
      }
    }

    if (isImportSuccess === false) {
      if (data.dataMigrationId && data.dataMigrationId?.length > 0) {
        const updateDataMigrationResult = await this.activityRepo.updateOne(
          {
            _id: ObjectId.createFromHexString(data.dataMigrationId),
          },
          {
            $inc: { 'results.processedCount': 1, 'results.failedCount': 1 },
          },
        );
        logInfo(
          `*`,
          `EventService.handleSQLTableImport -> updateDataMigrationResult`,
          updateDataMigrationResult,
        );
      }
    }
    return {};
  }
}
