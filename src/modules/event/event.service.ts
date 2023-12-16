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
import { logInfo, logWarning } from 'src/common/utils/log-helper';
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
  MSSQLInvestigation,
  MSSQLReference,
} from '../data-migration/entity/sql-table';

@Injectable()
export class EventService {
  private connectResult;

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
  async handleDataMigration(data: any): Promise<any> {
    logInfo(`*`, `EventService.handleDataMigartion -> data`, data);
    if (data) {
      let batchSize = 10000;
      let updateStatusResult;
      const currentTimestamp = new Date().getTime();

      if (data?.recordsCount > 0) {
        if (data.recordsCount < batchSize) {
          batchSize = data.recordsCount;
        }
      }

      if (data?.id && data?.id?.length > 0) {
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
          document,
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
    }

    return {};
  }

  async handleSQLTableImport(data: any): Promise<any> {
    let isImportSuccess = false;
    logInfo(`*`, `EventService.handleSQLTableImport -> data`, data);
    if (data) {
      try {
        if (this.connectResult === undefined) {
          this.connectResult = await mssql.connect(
            process.env.MSSQLDB_URL || '',
          );
          logInfo(
            `*`,
            `EventService.handleSQLTableImport -> connectResult`,
            this.connectResult,
          );
        }
      } catch (error) {
        // MSSQL Connection error!
        logWarning(
          `*`,
          `EventService.handleSQLTableImport -> connectResult`,
          this.connectResult,
        );
      }
      if (this.connectResult) {
        let findQuery = `SELECT * FROM LCM.dbo.[${data.tableName}] WHERE refId='${data.data.id}'`;
        let insertQuery = ``;
        let updateQuery = ``;
        switch (data.collectionName) {
          case DataMigration_Collections.Activities: {
            const importData = new MSSQLActivity();
            importData.refId = data.data?.id;
            importData.contactNote = data.data?.contactInfo?.note;
            importData.contractCode = data.data?.contractCode;
            importData.createdAt = data.data?.performAt;
            importData.customerCode = data.data?.customerCode;
            importData.note = data.data?.note;
            importData.phoneNumber = data.data?.contactInfo?.phoneNumber;
            importData.ptpAmount = data.data?.ptpAmount;
            importData.ptpDate = data.data?.ptpDate;
            importData.performedAt = data.data?.performAt;
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
        ,${importData.createdAt ? `'${importData.createdAt}'` : 'NULL'}
        ,'${importData.relationCode}'
        ,N'${importData.relationName}'
        ,'${importData.phoneNumber}'
        ,N'${importData.contactNote || ''}'
        ,${importData.ptpDate ? `'${importData.ptpDate}'` : 'NULL'}
        ,N'${importData.fullname}')`;
            updateQuery = `
        UPDATE [dbo].[activities]
   SET 
      [contractCode] = '${importData.contractCode}'
      ,[customerCode] = '${importData.customerCode}'
      ,[staffCode] = '${importData.staffCode}'
      ,[type] = '${importData.type}'
      ,[resultCode] = '${importData.resultCode}'
      ,[resultParentCode] = '${importData.resultParentCode}'
      ,[note] = N'${importData.note}'
      ,[ptpAmount] = ${importData.ptpAmount || 0}
      ,[createdAt] = ${
        importData.createdAt ? `'${importData.createdAt}'` : 'NULL'
      }
      ,[relationCode] = '${importData.relationCode}'
      ,[relationName] = N'${importData.relationName}'
      ,[phoneNumber] = '${importData.phoneNumber}'
      ,[contactNote] = N'${importData.contactNote || ''}'
      ,[ptpDate] = ${importData.ptpDate ? `'${importData.ptpDate}'` : 'NULL'}
      ,[fullname] = N'${importData.fullname}'
 WHERE [refId] = '${importData.refId}'
        `;
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

            for (const key in importData) {
              if (typeof importData[key] === 'string') {
                importData[key] = importData[key].toString().replace(/'/g, '');
              }
            }

            findQuery = `SELECT * FROM LCM.dbo.${data.tableName} WHERE code='${data.data.code}'`;
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
           ,[totalPaymentAmountFromPartner]
           ,[bucket])
     VALUES
           ('${importData.refId}'
           ,'${importData.code}'
           ,'${importData.partnerCode}'
           ,'${importData.customerCode}'
           ,'${importData.customerCIF}'
           ,'${importData.productGroup}'
           ,${importData.originalBalance || 0}
           ,${importData.totalBalance || 0}
           ,${importData.ovdBalance || 0}
           ,${importData.performingBalance || 0}
           ,${importData.periodicalPaymentAmount || 0}
           ,${importData.prAmount || 0}
           ,${importData.inAmount || 0}
           ,${importData.psAmount || 0}
           ,${importData.ovdDays || 0}
           ,${importData.totalPaymentAmount || 0}
           ,'${importData.term}'
           ,'${importData.status}'
           ,'${importData.createdAt || ''}'
           ,'${importData.accountNo}'
           ,'${importData.statusOfLoan}'
           ,'${importData.guid}'
           ,${importData.totalPaymentAmountFromPartner || 0}
           ,'${importData.bucket}')
            `;
            updateQuery = `
          UPDATE [dbo].[contracts]
   SET [refId] = '${importData.refId}'
      ,[partnerCode] = '${importData.partnerCode}'
      ,[customerCode] = '${importData.customerCode}'
      ,[customerCIF] = '${importData.customerCIF}'
      ,[productGroup] = '${importData.productGroup}'
      ,[originalBalance] = ${importData.originalBalance || 0}
      ,[totalBalance] = ${importData.totalBalance || 0}
      ,[ovdBalance] = ${importData.ovdBalance || 0}
      ,[performingBalance] = ${importData.performingBalance || 0}
      ,[periodicalPaymentAmount] = ${importData.periodicalPaymentAmount || 0}
      ,[prAmount] = ${importData.prAmount || 0}
      ,[inAmount] = ${importData.inAmount || 0}
      ,[psAmount] = ${importData.psAmount || 0}
      ,[ovdDays] = ${importData.ovdDays || 0}
      ,[totalPaymentAmount] = ${importData.totalPaymentAmount || 0}
      ,[term] = '${importData.term}'
      ,[status] = '${importData.status}'
      ,[createdAt] = '${importData.createdAt || ''}'
      ,[accountNo] = '${importData.accountNo}'
      ,[statusOfLoan] = '${importData.statusOfLoan}'
      ,[guid] = '${importData.guid}'
      ,[fromFile] = '${importData.fromFile}'
      ,[totalPaymentAmountFromPartner] = ${
        importData.totalPaymentAmountFromPartner || 0
      }
      ,[bucket] = '${importData.bucket}'
 WHERE [code] = '${importData.code}'
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
            findQuery = `SELECT * FROM LCM.dbo.${data.tableName} WHERE code='${data.data.code}'`;
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
           ,${
             importData.priority !== undefined &&
             importData.priority !== null &&
             importData.priority.toString() !== ''
               ? importData.priority
               : 'NULL'
           }
           ,'${importData.status}'
           ,N'${importData.officeName}'
           ,${importData.acim || 0}
           ,${importData.lovdd || 0}
           ,${importData.tbim || 0}
           ,${importData.tpafpim || 0}
           ,${importData.tpaim || 0}
           ,N'${importData.officeAddress}'
           ,${importData.lastPaidAmount || 0})
            `;
            updateQuery = `
            UPDATE [dbo].[customers]
   SET 
      [refId] = '${importData.refId}'
      ,[partnerCode] = '${importData.partnerCode}'
      ,[callStaffCode] = '${importData.callStaffCode}'
      ,[fullname] = N'${importData.fullname}'
      ,[gender] = N'${importData.gender}'
      ,[dob] = '${importData.dob || ''}'
      ,[mobileNumber] = '${importData.mobileNumber}'
      ,[officeNumber] = '${importData.officeNumber}'
      ,[temporaryAddress] = N'${importData.temporaryAddress}'
      ,[permanentAddress] = N'${importData.permanentAddress}'
      ,[createdAt] = '${importData.createdAt || ''}'
      ,[identityNumber] = '${importData.identityNumber}'
      ,[priority] = ${
        importData.priority !== undefined &&
        importData.priority !== null &&
        importData.priority.toString() !== ''
          ? importData.priority
          : 'NULL'
      }
      ,[status] = '${importData.status}'
      ,[fromFile] = '${importData.fromFile}'
      ,[officeName] = N'${importData.officeName}'
      ,[acim] = ${importData.acim || 0}
      ,[lovdd] = ${importData.lovdd || 0}
      ,[tbim] = ${importData.tbim || 0}
      ,[tpafpim] = ${importData.tpafpim || 0}
      ,[tpaim] = ${importData.tpaim || 0}
      ,[officeAddress] = N'${importData.officeAddress}'
      ,[lastPaidAmount] = ${importData.lastPaidAmount || 0}
 WHERE [code] = '${importData.code}'
            `;

            break;
          }
          case DataMigration_Collections.Investigations: {
            const importData = new MSSQLInvestigation();
            const sourceData = data.data as Investigation;
            importData.refId = sourceData.id.toString();
            importData.customerCode = sourceData.customerCode;
            importData.note = sourceData.note;
            importData.staffCode = sourceData.staffCode;
            importData.typeCode = sourceData.typeCode;
            importData.value = sourceData.value;

            for (const key in importData) {
              if (typeof importData[key] === 'string') {
                importData[key] = importData[key].toString().replace(/'/g, '');
              }
            }
            insertQuery = `
            INSERT INTO [dbo].[investigations]
     ([refId]
     ,[customerCode]
     ,[staffCode]
     ,[typeCode]
     ,[value]
     ,[note]
     ,[createdAt])
VALUES
     (
     '${importData.refId}'
     ,'${importData.customerCode}'
     ,'${importData.staffCode}'
     ,'${importData.typeCode}'
     ,N'${importData.value}'
     ,N'${importData.note}'
     ,'${importData.createdAt || ''}'
     )
            `;
            updateQuery = `
            UPDATE [dbo].[investigations]
   SET 
      [customerCode] = '${importData.customerCode}'
      ,[staffCode] = '${importData.staffCode}'
      ,[typeCode] = '${importData.typeCode}'
      ,[value] = N'${importData.value}'
      ,[note] = N'${importData.note}'
      ,[createdAt] = '${importData.createdAt || ''}'
 WHERE [refId] = '${importData.refId}'
            `;
            break;
          }
          case DataMigration_Collections.References: {
            const importData = new MSSQLReference();
            const sourceData = data.data as Reference;
            importData.refId = sourceData.id.toString();
            importData.customerCode = sourceData.customerCode;
            importData.createdAt = sourceData.createdAt;
            importData.fullname = sourceData.fullname;
            importData.gender = sourceData.gender;
            importData.identityNumber = sourceData.identityNumber;
            importData.mobileNumber = sourceData.mobileNumber;
            importData.officeNumber = sourceData.officeNumber;
            importData.relationCode = sourceData.relationCode;

            for (const key in importData) {
              if (typeof importData[key] === 'string') {
                importData[key] = importData[key].toString().replace(/'/g, '');
              }
            }
            insertQuery = `
            INSERT INTO [dbo].[references]
           ([refId]
           ,[customerCode]
           ,[callStaffCode]
           ,[relationCode]
           ,[mobileNumber]
           ,[createdAt]
           ,[fullname]
           ,[gender]
           ,[identityNumber]
           ,[officeNumber])
     VALUES
           ('${importData.refId}'
           ,'${importData.customerCode}'
           ,'${importData.callStaffCode}'
           ,'${importData.relationCode}'
           ,'${importData.mobileNumber}'
           ,'${importData.createdAt || ''}'
           ,N'${importData.fullname}'
           ,N'${importData.gender}'
           ,'${importData.identityNumber}'
           ,'${importData.officeNumber}')
            `;
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
          logWarning(
            `*`,
            `EventService.handleSQLTableImport -> findError`,
            error,
          );
        }
        if (findResult) {
          let importResult;
          if (findResult?.recordset?.length > 0) {
            logInfo(
              `*`,
              `EventService.handleSQLTableImport -> updateQuery`,
              updateQuery,
            );
            try {
              importResult = await mssql.query(updateQuery);
            } catch (error) {
              // MSSQL Connection error!
              logWarning(
                `*`,
                `EventService.handleSQLTableImport -> updateError`,
                error,
              );
            }
          } else {
            logInfo(
              `*`,
              `EventService.handleSQLTableImport -> insertQuery`,
              insertQuery,
            );
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
            const updateDocumentQuery = {
              _id: ObjectId.createFromHexString(data.data.id),
            };
            const updateDocumentFilter = {
              $set: {
                syncedAt: new Date().getTime(),
              },
            };
            let updateDocumentResult;
            isImportSuccess = true;
            switch (data.collectionName) {
              case DataMigration_Collections.Activities: {
                updateDocumentResult = await this.activityRepo.updateMany(
                  updateDocumentQuery,
                  updateDocumentFilter,
                );
                break;
              }
              case DataMigration_Collections.Contracts: {
                updateDocumentResult = await this.contractRepo.updateMany(
                  updateDocumentQuery,
                  updateDocumentFilter,
                );
                break;
              }
              case DataMigration_Collections.Customers: {
                updateDocumentResult = await this.customerRepo.updateMany(
                  updateDocumentQuery,
                  updateDocumentFilter,
                );
                break;
              }
              case DataMigration_Collections.Investigations: {
                updateDocumentResult = await this.investigationRepo.updateMany(
                  updateDocumentQuery,
                  updateDocumentFilter,
                );
                break;
              }
              case DataMigration_Collections.References: {
                updateDocumentResult = await this.referenceRepo.updateMany(
                  updateDocumentQuery,
                  updateDocumentFilter,
                );
                break;
              }
              default:
                break;
            }
            logInfo(
              `*`,
              `EventService.handleSQLTableImport -> updateDocumentQuery`,
              updateDocumentQuery,
            );
            logInfo(
              `*`,
              `EventService.handleSQLTableImport -> updateDocumentFilter`,
              updateDocumentFilter,
            );
            logInfo(
              `*`,
              `EventService.handleSQLTableImport -> updateDocumentResult`,
              updateDocumentResult,
            );
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
      if (data?.dataMigrationId && data?.dataMigrationId?.length > 0) {
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
