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
import {
  MSSQLActivity,
  MSSQLContract,
  MSSQLCustomer,
} from '../data-migration/entity/sql-table';

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
    let batchSize = 1000;
    let updateStatusResult;
    let currentTimestamp = new Date().getTime();

    if (data.recordsCount > 0) {
      if (data.recordsCount < batchSize) {
        batchSize = data.recordsCount;
      }
    }

    if (data.id && data.id?.length > 0) {
      updateStatusResult = await this.dataMigrationRepo.updateOne(
        {
          _id: ObjectId.createFromHexString(data.id),
        },
        {
          $set: {
            status: DataMigration_Status.InProgress,
            results: {
              totalCount: batchSize,
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
    let documents = [];
    const documentFilter = {
      where: data.filter?.where || {},
      order: data.filter?.order || {},
      take: batchSize,
      skip: 0,
    };
    logInfo(
      `*`,
      `EventService.handleDataMigartion -> documentFilter`,
      JSON.stringify(documentFilter),
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
        `EventService.handleDataMigartion -> document '${
          data.collectionName
        }' ${j + 1}/${documents.length}`,
        document.id,
      );
      let updateQueueTimeResults;
      const updateQuery = {
        _id: document.id,
      };
      const updateFilter = {
        $set: {
          queuedAt: currentTimestamp,
        },
      };
      switch (data.collectionName) {
        case DataMigration_Collections.Activities: {
          updateQueueTimeResults = await this.activityRepo.updateMany(
            updateQuery,
            updateFilter,
          );
          break;
        }
        case DataMigration_Collections.Contracts: {
          updateQueueTimeResults = await this.contractRepo.updateMany(
            updateQuery,
            updateFilter,
          );
          break;
        }
        case DataMigration_Collections.Customers: {
          updateQueueTimeResults = await this.customerRepo.updateMany(
            updateQuery,
            updateFilter,
          );
          break;
        }
        case DataMigration_Collections.Investigations: {
          updateQueueTimeResults = await this.investigationRepo.updateMany(
            updateQuery,
            updateFilter,
          );
          break;
        }
        case DataMigration_Collections.References: {
          updateQueueTimeResults = await this.referenceRepo.updateMany(
            updateQuery,
            updateFilter,
          );
          break;
        }
        default:
          break;
      }
      logInfo(
        `*`,
        `EventService.handleDataMigartion -> updateQueueTimeResults`,
        updateQueueTimeResults,
      );
      if (updateQueueTimeResults) {
        if (updateQueueTimeResults.modifiedCount > 0) {
          const emitResult = await this.client.emit(
            MessagePattern.MSSQLTableImport,
            {
              collectionName: data.collectionName,
              tableName: data.collectionName,
              data: document,
              dataMigrationId: data.id,
            },
          );
          logInfo(
            `*`,
            `DataMigration.Service.createOne -> emitResult`,
            emitResult,
          );
          const subscriberResult = await emitResult.subscribe();
          /*  logInfo(
              `*`,
              `DataMigration.Service.createOne -> subscriberResult`,
              subscriberResult,
            ); */
        }
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

            insertQuery = `
  INSERT INTO [dbo].[activities]
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
            const importData = new MSSQLContract();
            const sourceData = data.data as Contract;
            importData.accountNo = sourceData.accountNo;
            importData.bucket = sourceData.bucket.toString();
            importData.code = sourceData.code;
            importData.customerCIF = sourceData.customerCIF;
            importData.customerCode = sourceData.customerCode;
            importData.guid = sourceData.guid;
            importData.inAmount = sourceData.inAmount;
            importData.originalBalance = sourceData.originalBalance;
            importData.ovdBalance = sourceData.ovdBalance;
            importData.ovdDays = sourceData.ovdDays;
            importData.partnerCode = sourceData.partnerCode;
            importData.performingBalance = sourceData.performingBalance;
            importData.periodicalPaymentAmount =
              sourceData.periodicalPaymentAmount;
            importData.prAmount = sourceData.prAmount;
            importData.productGroup = sourceData.productGroup;
            importData.psAmount = sourceData.psAmount;
            importData.productGroup = sourceData.productGroup;
            importData.psAmount = sourceData.psAmount;
            importData.refId = sourceData.id.toString();
            importData.status = sourceData.status;
            importData.statusOfLoan = sourceData.statusOfLoan;
            importData.term = sourceData.term;
            importData.totalBalance = sourceData.totalBalance;
            importData.totalPaymentAmount = sourceData.totalPaymentAmount;
            importData.totalPaymentAmountFromPartner =
              sourceData.totalPaymentAmountFromPartner;

            insertQuery = `
            INSERT INTO [dbo].[contracts]
           ([refId]
           ,[code]
           ,[partnerCode]
           ,[customerCode]
           ,[customerCIF]
           ,[productGroup]
           ,[originalBalance]
           ,[totalBalance]
           ,[ovdBalance]
           ,[performingBalance]
           ,[periodicalPaymentAmount]
           ,[prAmount]
           ,[inAmount]
           ,[psAmount]
           ,[ovdDays]
           ,[totalPaymentAmount]
           ,[term]
           ,[status]
           ,[createdAt]
           ,[accountNo]
           ,[statusOfLoan]
           ,[guid]
           ,[fromFile]
           ,[totalPaymentAmountFromPartner]
           ,[bucket])
     VALUES
           ('${importData.refId}'
           ,'${importData.code}'
           ,'${importData.partnerCode}'
           ,'${importData.customerCode}'
           ,'${importData.customerCIF}'
           ,'${importData.productGroup}'
           ,'${importData.originalBalance}'
           ,'${importData.totalBalance}'
           ,'${importData.ovdBalance}'
           ,'${importData.performingBalance}'
           ,'${importData.periodicalPaymentAmount}'
           ,'${importData.prAmount}'
           ,'${importData.inAmount}'
           ,'${importData.psAmount}'
           ,'${importData.ovdDays}'
           ,'${importData.totalPaymentAmount}'
           ,'${importData.term}'
           ,'${importData.status}'
           ,'${importData.createdAt || ''}'
           ,'${importData.accountNo}'
           ,'${importData.statusOfLoan}'
           ,'${importData.guid}'
           ,'${importData.fromFile}'
           ,'${importData.totalPaymentAmountFromPartner}'
           ,'${importData.bucket}')
            `;

            break;
          }
          case DataMigration_Collections.Customers: {
            const importData = new MSSQLCustomer();
            const sourceData = data.data as Customer;
            importData.acim = sourceData.acim;
            importData.callStaffCode = sourceData.callStaffCode;
            importData.code = sourceData.code;
            importData.dob = sourceData.dob;
            importData.fullname = sourceData.fullname;
            importData.gender = sourceData.gender;
            importData.identityNumber = sourceData.identityNumber;
            importData.lastPaidAmount = sourceData.lastPaidAmount;
            importData.lovdd = sourceData.lovdd;
            importData.mobileNumber = sourceData.mobileNumber;
            importData.officeAddress = sourceData.officeAddress;
            importData.officeName = sourceData.officeName;
            importData.officeNumber = sourceData.officeNumber;
            importData.partnerCode = sourceData.partnerCode;
            importData.permanentAddress = sourceData.permanentAddress;
            importData.priority = sourceData.priority;
            importData.refId = sourceData.id.toString();
            importData.status = sourceData.status;
            importData.tbim = sourceData.tbim;
            importData.temporaryAddress = sourceData.temporaryAddress;
            importData.tpafpim = sourceData.tpafpim;
            importData.tpaim = sourceData.tpaim;

            for (const key in importData) {
              if (typeof importData[key] === 'string') {
                importData[key] = importData[key].toString().replace(/'/g, '');
              }
            }

            insertQuery = `
            INSERT INTO [dbo].[customers]
           (
            [refId]
           ,[code]
           ,[partnerCode]
           ,[callStaffCode]
           ,[fullname]
           ,[gender]
           ,[dob]
           ,[mobileNumber]
           ,[officeNumber]
           ,[temporaryAddress]
           ,[permanentAddress]
           ,[createdAt]
           ,[identityNumber]
           ,[priority]
           ,[status]
           ,[officeName]
           ,[acim]
           ,[lovdd]
           ,[tbim]
           ,[tpafpim]
           ,[tpaim]
           ,[officeAddress]
           ,[lastPaidAmount])
     VALUES
           (
            '${importData.refId}'
           ,'${importData.code}'
           ,'${importData.partnerCode}'
           ,'${importData.callStaffCode}'
           ,N'${importData.fullname}'
           ,N'${importData.gender}'
           ,'${importData.dob || ''}'
           ,'${importData.mobileNumber}'
           ,'${importData.officeNumber}'
           ,N'${importData.temporaryAddress}'
           ,N'${importData.permanentAddress}'
           ,'${importData.createdAt || ''}'
           ,'${importData.identityNumber}'
           ,${importData.priority !== undefined ? importData.priority : ''}
           ,'${importData.status}'
           ,N'${importData.officeName}'
           ,'${importData.acim || 0}'
           ,'${importData.lovdd || 0}'
           ,'${importData.tbim || 0}'
           ,'${importData.tpafpim || 0}'
           ,'${importData.tpaim || 0}'
           ,N'${importData.officeAddress}'
           ,'${importData.lastPaidAmount || 0}')
            `;

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
          logInfo(
            `*`,
            `EventService.handleSQLTableImport -> findResult`,
            findResult,
          );
        } catch (error) {
          // MSSQL Connection error!
        }
        if (findResult) {
          logInfo(
            `*`,
            `EventService.handleSQLTableImport -> importQuery`,
            insertQuery,
          );
          let importResult;
          if (findResult?.recordset?.length > 0) {
            try {
              // importResult = await mssql.query(updateQuery);
            } catch (error) {
              // MSSQL Connection error!
              logInfo(
                `*`,
                `EventService.handleSQLTableImport -> updateError`,
                error,
              );
            }
          } else {
            try {
              importResult = await mssql.query(insertQuery);
            } catch (error) {
              // MSSQL Connection error!
              logInfo(
                `*`,
                `EventService.handleSQLTableImport -> insertError`,
                error,
              );
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
