import * as fs from 'fs';
import * as path from 'path';
import { ObjectID } from 'mongodb';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ImportData } from './entity/import-data.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { CreateImportDataData } from './dto/create.dto';
import {
  ImportData_Status,
  ImportData_ImportRule,
  ImportData_ToTable,
} from './enum/import-data.enum';
import { readSheetNames } from 'read-excel-file/node';
import readXlsxFile from 'read-excel-file/node';
import { getTypeOf } from 'src/common/utils/object-helper';
import { Customer } from '../customer/entity/customer.entity';
import { replaceRegexPatternFromString } from 'src/common/utils/string-helper';
import { Contract } from '../contract/entity/contract.entity';
import { Transaction } from '../transaction/entity/transaction.entity';
import { Reference } from '../reference/entity/reference.entity';
import { Investigation } from '../investigation/entity/investigation.entity';
import { Activity } from '../activity/entity/activity.entity';
import { downloadFile } from 'src/common/utils/web-helper';
import { UpdateImportDataData } from './dto/update-one.dto';
import { Services } from 'src/common/enums/services';
import { ClientProxy } from '@nestjs/microservices';
import {
  ActivityXlsxSchema,
  ContractXlsxSchema,
  CustomerXlsxSchema,
  InvestigationXlsxSchema,
  ReferenceXlsxSchema,
  TransactionXlsxSchema,
} from './constant/import-data.constant';
import { CustomerStatus } from '../customer/enum/customer.enum';
import { ContractStatus } from '../contract/enum/contract.enum';
import { ActivityTypeCode, RelationCode } from '../activity/enum/activity.enum';
import {
  activityTypes,
  investigationTypes,
  relations,
} from 'src/constants/service';
import {
  FindManyFilter,
  FindAllResult,
} from 'src/common/modules/base/dto/find-many.dto';

@Injectable()
export class ImportDataService extends BaseService<ImportData> {
  private _customersRepo: MongoRepository<Customer>;
  private _contractsRepo: MongoRepository<Contract>;
  private _transactionsRepo: MongoRepository<Transaction>;
  private _referencesRepo: MongoRepository<Reference>;
  private _investigationsRepo: MongoRepository<Investigation>;
  private _activitiesRepo: MongoRepository<Activity>;
  constructor(
    @InjectRepository(ImportData)
    private readonly importDatasRepository: MongoRepository<ImportData>,
    @InjectRepository(Customer)
    private readonly customersRepository: MongoRepository<Customer>,
    @InjectRepository(Contract)
    private readonly contractsRepository: MongoRepository<Contract>,
    @InjectRepository(Transaction)
    private readonly transactionsRepository: MongoRepository<Transaction>,
    @InjectRepository(Reference)
    private readonly referencesRepository: MongoRepository<Reference>,
    @InjectRepository(Investigation)
    private readonly investigationsRepository: MongoRepository<Investigation>,
    @InjectRepository(Activity)
    private readonly activitiesRepository: MongoRepository<Activity>,
    @Inject(Services.LCM) private client: ClientProxy,
  ) {
    super(importDatasRepository);
    this._customersRepo = customersRepository;
    this._contractsRepo = contractsRepository;
    this._transactionsRepo = transactionsRepository;
    this._referencesRepo = referencesRepository;
    this._investigationsRepo = investigationsRepository;
    this._activitiesRepo = activitiesRepository;
  }

  async findManyWithPaging(
    filter: FindManyFilter,
    handler: DataHandler,
  ): Promise<FindAllResult<ImportData>> {
    filter.order = { createdAt: -1 };
    filter.select = [
      'id',
      'fileName',
      'partnerCode',
      'settings',
      'note',
      'status',
      'createdAt',
      'changedAt',
      'owner',
      'createdBy',
      'changedBy',
    ];
    return await super.findManyWithPaging(filter, handler);
  }

  async createOne(
    data: CreateImportDataData,
    handler: DataHandler,
  ): Promise<any> {
    const urlRegex = new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    );
    const importData = new ImportData();
    importData.fileName = data.fileName;
    importData.note = data.note;
    importData.partnerCode = data.partnerCode;
    importData.status = ImportData_Status.New;
    console.log(``);
    console.log(``);
    console.log(`Create new Data File`, importData);
    if (urlRegex.test(importData.fileName)) {
      const now = new Date();
      const dataDirPath = './data';
      const importDataPath = `${dataDirPath}/${now.getTime()}.xlsx`;
      if (!fs.existsSync(dataDirPath)) {
        console.log(
          `-- Directory '${dataDirPath} not existed, create new one...'`,
        );
        fs.mkdirSync(dataDirPath);
      }
      const downloadFileResult = await downloadFile(
        importData.fileName,
        importDataPath,
      );
      console.log(
        `-- Download file '${importData.fileName} to '${importDataPath}'`,
        downloadFileResult,
      );
      if (downloadFileResult === true) {
        const sheetNames = await readSheetNames(importDataPath)
          .then((names) => names)
          .catch((e) => {
            console.log(`-- Read Sheet name of file ${dataDirPath} error`, e);
            return [];
          });
        console.log(`-- Read Sheet name of file ${dataDirPath}`, sheetNames);
        importData.info.sheets = sheetNames.map((name) => {
          return { name };
        });
        return super.createOne(importData, handler);
      }
    } else {
      throw new BadRequestException({
        message: `-- Can not download file '${importData.fileName}'!`,
      });
    }
  }

  async updateOne(
    id: ObjectID,
    data: UpdateImportDataData,
    handler: DataHandler,
  ): Promise<any> {
    const currentImportData: ImportData = await super.findOne(id, handler);
    if (data.settings) {
      if (getTypeOf(data.settings.sheets) === 'array') {
        if (data.settings.sheets.length > 0) {
          for (let i = 0; i < data.settings.sheets.length; i++) {
            const sheet = data.settings.sheets[i];
            const foundSheet = currentImportData.info.sheets.find(
              (s) => s.name === sheet.name,
            );
            const isValidRule =
              ImportData_ImportRule.CloseAll === sheet.rule ||
              ImportData_ImportRule.ReplaceAll === sheet.rule ||
              ImportData_ImportRule.DeleteAll === sheet.rule;
            const isValidToTable =
              ImportData_ToTable.Activity === sheet.toTable ||
              ImportData_ToTable.Contract === sheet.toTable ||
              ImportData_ToTable.Customer === sheet.toTable ||
              ImportData_ToTable.Investigation === sheet.toTable ||
              ImportData_ToTable.Reference === sheet.toTable ||
              ImportData_ToTable.Transaction === sheet.toTable;

            if (foundSheet === undefined) {
              throw new BadRequestException({
                message: `Sheet '${sheet.name}' is not found in file!`,
              });
            }

            if (isValidRule === false) {
              throw new BadRequestException({
                message: `Import rule '${sheet.rule}' is not valid for sheet '${sheet.name}'!`,
              });
            }

            if (isValidToTable === false) {
              throw new BadRequestException({
                message: `To table '${sheet.toTable}' is not valid for sheet '${sheet.name}'!`,
              });
            }
          }
        }
      }
    }
    return super.updateOne(id, data, handler);
  }
  async processImportData(id: string, handler: DataHandler): Promise<any> {
    const updateResult = await super.updateOne(
      id,
      { status: ImportData_Status.Queued },
      handler,
    );

    console.log(``);
    console.log(``);
    console.log(`Request to process Data File '${id}'`);
    if (updateResult) {
      const emitResult = await this.client.emit(
        'process-import-data',
        JSON.stringify({ importDataId: id, handler }),
      );
      console.log(`-- Emit result`, emitResult);
      const subscriberResult = await emitResult.subscribe();
      console.log(`-- Subcriber result`, subscriberResult);
    }

    return updateResult;
  }

  async handleProcessFile(data: {
    importDataId: ObjectID;
    handler: DataHandler;
  }): Promise<any> {
    console.log(``);
    console.log(``);
    console.log(`Process Data File`);
    console.log(`-- Received data from message queue`, data);
    const importData = await this.importDatasRepository.findOne(
      data.importDataId,
    );
    console.log(`-- Data file`, importData);
    if (importData) {
      const updateImportDataResult = await this.importDatasRepository.update(
        importData.id,
        { status: ImportData_Status.Processing },
      );
      console.log(
        `-- Update data file status to 'processing'`,
        updateImportDataResult.affected > 0,
      );
      importData.status = ImportData_Status.Processing;

      const now = new Date();
      const dataDirPath = './data';
      const importDataPath = `${dataDirPath}/${now.getTime()}.xlsx`;
      if (!fs.existsSync(dataDirPath)) {
        console.log(
          `-- Directory '${dataDirPath} not existed, create new one...'`,
        );
        fs.mkdirSync(dataDirPath);
      }
      const downloadFileResult = await downloadFile(
        importData.fileName,
        importDataPath,
      );
      console.log(
        `-- Download file '${importData.fileName} to '${importDataPath}'`,
        downloadFileResult,
      );

      if (getTypeOf(importData.settings.sheets) === 'array') {
        for (let i = 0; i < importData.settings.sheets.length; i++) {
          const sheet = importData.settings.sheets[i];
          const sheetProcessResult = {
            name: sheet.name,
            totalCount: 0,
            validCount: 0,
            errorCount: 0,
            insertCount: 0,
            updateCount: 0,
            errors: [],
          };
          let readResult = undefined;
          let readSchema = undefined;

          switch (sheet.toTable) {
            case ImportData_ToTable.Customer: {
              readSchema = CustomerXlsxSchema;
              break;
            }
            case ImportData_ToTable.Contract: {
              readSchema = ContractXlsxSchema;
              break;
            }
            case ImportData_ToTable.Reference: {
              readSchema = ReferenceXlsxSchema;
              break;
            }
            case ImportData_ToTable.Activity: {
              readSchema = ActivityXlsxSchema;
              break;
            }
            case ImportData_ToTable.Investigation: {
              readSchema = InvestigationXlsxSchema;
              break;
            }
            case ImportData_ToTable.Transaction: {
              readSchema = TransactionXlsxSchema;
              break;
            }
            default:
              break;
          }
          readResult = await readXlsxFile(importDataPath, {
            schema: readSchema,
            sheet: sheet.name,
          })
            .then((result) => {
              return result;
            })
            .catch((e) => {
              return undefined;
            });
          if (readResult != undefined) {
            sheetProcessResult.validCount = readResult.rows.length;
            sheetProcessResult.errorCount = readResult.errors.length;
            sheetProcessResult.errors = readResult.errors;
            console.log(`---- `);
            console.log(
              `---- Process Data File '${importDataPath}' Sheet(${i}/${importData.settings.sheets.length}) '${sheet.name}': ${readResult.rows.length} rows, ${readResult.errors.length} errors`,
            );
            console.log(`---- Import Rule '${sheet.rule}'`);
            console.log(`---- To Table '${sheet.toTable}'`);

            switch (sheet.rule) {
              case ImportData_ImportRule.CloseAll: {
                if (sheet.toTable === ImportData_ToTable.Customer) {
                  const updateAllCustomerResult =
                    await this.customersRepository.update(
                      { partnerCode: importData.partnerCode },
                      { status: CustomerStatus.Closed },
                    );
                  console.log(
                    `---- Update status of all customers  to 'closed'`,
                    updateAllCustomerResult,
                  );
                }
                if (sheet.toTable === ImportData_ToTable.Contract) {
                  const updateAllContractResult =
                    await this.contractsRepository.update(
                      { partnerCode: importData.partnerCode },
                      { status: ContractStatus.Closed },
                    );
                  console.log(
                    `---- Update status of all contracts to 'closed'`,
                    updateAllContractResult,
                  );
                }
                break;
              }
              case ImportData_ImportRule.DeleteAll: {
                if (sheet.toTable === ImportData_ToTable.Investigation) {
                  const deleteAllImportedRecordsResults =
                    await this.investigationsRepository.deleteMany({
                      $and: [
                        { fromFile: { $ne: null } },
                        { fromFile: { $ne: '' } },
                        { partnerCode: importData.partnerCode },
                      ],
                    });
                  console.log(
                    `---- Delete all imported Investigations`,
                    deleteAllImportedRecordsResults,
                  );
                }
                if (sheet.toTable === ImportData_ToTable.Reference) {
                  const deleteAllImportedRecordsResults =
                    await this.referencesRepository.deleteMany({
                      $and: [
                        { fromFile: { $ne: null } },
                        { fromFile: { $ne: '' } },
                        { partnerCode: importData.partnerCode },
                      ],
                    });
                  console.log(
                    `---- Delete all imported References`,
                    deleteAllImportedRecordsResults,
                  );
                }
                if (sheet.toTable === ImportData_ToTable.Transaction) {
                  const deleteAllImportedRecordsResults =
                    await this.transactionsRepository.deleteMany({
                      $and: [
                        { fromFile: { $ne: null } },
                        { fromFile: { $ne: '' } },
                        { partnerCode: importData.partnerCode },
                      ],
                    });
                  console.log(
                    `---- Delete all imported Transactions`,
                    deleteAllImportedRecordsResults,
                  );
                }
                break;
              }
              default:
                break;
            }
            for (let j = 0; j < readResult.rows.length; j++) {
              const row = readResult.rows[j];
              console.log(
                `------ Row(${j}/${readResult.rows.length}) raw data`,
                row,
              );

              switch (sheet.toTable) {
                case ImportData_ToTable.Customer: {
                  row.identityNumber = replaceRegexPatternFromString(
                    row.identityNumber,
                    '[^0-9]+',
                    '',
                  );
                  row.mobileNumber = replaceRegexPatternFromString(
                    row.mobileNumber,
                    '[^0-9]+',
                    '',
                  );
                  row.officeNumber = replaceRegexPatternFromString(
                    row.officeNumber,
                    '[^0-9]+',
                    '',
                  );
                  row.gender = (row.gender || '')
                    .toString()
                    .toLowerCase()
                    .trim();
                  if (['phụ nữ', 'nữ', 'gái'].indexOf(row.gender) >= 0) {
                    row.gender = 'female';
                  }
                  if (['đàn ông', 'nam', 'trai'].indexOf(row.gender) >= 0) {
                    row.gender = 'male';
                  }
                  if (row.status.toLowerCase().indexOf('a') === 0) {
                    row.status = 'active';
                  }
                  if (row.dob) row.dob = row.dob.toISOString().split('T')[0];
                  if (row.callStaffCode === '') row.callStaffCode = '_';
                  row.fromFile = importData.fileName;
                  console.log(
                    `------ Row(${j}/${readResult.rows.length}) handled data`,
                    row,
                  );
                  const foundCustomer = await this._customersRepo.findOne({
                    where: { code: row.code },
                  });

                  if (foundCustomer) {
                    const updateCustomerResult =
                      await this._customersRepo.update(foundCustomer.id, row);
                    console.log(
                      `------ Find customer by code '${row.code}'`,
                      foundCustomer,
                    );
                    console.log(
                      `------ Update customer:`,
                      (updateCustomerResult as any).result,
                    );
                    if (updateCustomerResult.affected > 0) {
                      sheetProcessResult.updateCount++;
                    }
                  } else {
                    row.isDeleted = false;
                    row.owner = {
                      orgId: data.handler.orgId,
                      userId: '',
                    };
                    const createCustomerResult = await this._customersRepo.save(
                      row,
                    );
                    console.log(
                      `------ Create customer:`,
                      createCustomerResult,
                    );
                    if (createCustomerResult) {
                      sheetProcessResult.insertCount++;
                    }
                  }
                  break;
                }
                case ImportData_ToTable.Contract: {
                  if (row.status.toLowerCase().indexOf('a') === 0) {
                    row.status = 'active';
                  }
                  row.fromFile = importData.fileName;
                  console.log(
                    `------ Row(${j}/${readResult.rows.length}) handled data`,
                    row,
                  );
                  const foundContract = await this._contractsRepo.findOne({
                    where: { code: row.code },
                  });

                  if (foundContract) {
                    const updateContractResult =
                      await this._contractsRepo.update(foundContract.id, row);
                    console.log(
                      `------ Find contract by code '${row.code}'`,
                      foundContract,
                    );
                    console.log(
                      `------ Update contract:`,
                      (updateContractResult as any).result,
                    );
                    if (updateContractResult.affected > 0) {
                      sheetProcessResult.updateCount++;
                    }
                  } else {
                    row.isDeleted = false;
                    row.owner = {
                      orgId: data.handler.orgId,
                      userId: '',
                    };
                    const createContractResult = await this._contractsRepo.save(
                      row,
                    );
                    console.log(
                      `------ Create contract:`,
                      createContractResult,
                    );
                    if (createContractResult) {
                      sheetProcessResult.insertCount++;
                    }
                  }
                  break;
                }
                case ImportData_ToTable.Transaction: {
                  row.fromFile = importData.fileName;
                  console.log(
                    `------ Row(${j}/${readResult.rows.length}) handled data`,
                    row,
                  );
                  const foundTransaction = await this._transactionsRepo.findOne(
                    {
                      where: {
                        customerCode: row.customerCode,
                        amount: row.amount,
                        date: row.date,
                      },
                    },
                  );

                  if (foundTransaction) {
                    const updateTransactionResult =
                      await this._transactionsRepo.update(
                        foundTransaction.id,
                        row,
                      );
                    console.log(
                      `------ Find transaction by customerCode '${row.customerCode}', amount '${row.amount}', date '${row.date}'`,
                      foundTransaction,
                    );
                    console.log(
                      `------ Update transaction:`,
                      (updateTransactionResult as any).result,
                    );
                    if (updateTransactionResult.affected > 0) {
                      sheetProcessResult.updateCount++;
                    }
                  } else {
                    row.isDeleted = false;
                    row.owner = {
                      orgId: data.handler.orgId,
                      userId: '',
                    };
                    const createContractResult =
                      await this._transactionsRepo.save(row);
                    console.log(
                      `------ Create transaction:`,
                      createContractResult,
                    );
                    if (createContractResult) {
                      sheetProcessResult.updateCount++;
                    }
                  }
                  break;
                }
                case ImportData_ToTable.Reference: {
                  row.identityNumber = replaceRegexPatternFromString(
                    row.identityNumber,
                    '[^0-9]+',
                    '',
                  );
                  row.mobileNumber = replaceRegexPatternFromString(
                    row.mobileNumber,
                    '[^0-9]+',
                    '',
                  );
                  row.officeNumber = replaceRegexPatternFromString(
                    row.officeNumber,
                    '[^0-9]+',
                    '',
                  );
                  row.gender = (row.gender || '')
                    .toString()
                    .toLowerCase()
                    .trim();
                  if (['phụ nữ', 'nữ', 'gái'].indexOf(row.gender) >= 0) {
                    row.gender = 'female';
                  }
                  if (['đàn ông', 'nam', 'trai'].indexOf(row.gender) >= 0) {
                    row.gender = 'male';
                  }
                  if (row.dob) row.dob = row.dob.toISOString().split('T')[0];
                  row.fromFile = importData.fileName;
                  console.log(
                    `------ Row(${j}/${readResult.rows.length}) handled data`,
                    row,
                  );
                  const relation = relations.find(
                    (r) =>
                      r.tags.indexOf((row.relationCode + '').toLowerCase()) >=
                      0,
                  );
                  if (relation) {
                    row.relationCode = relation.code;
                  } else {
                    row.relationCode = 'other';
                  }

                  const foundRefence = await this._referencesRepo.findOne({
                    where: {
                      customerCode: row.customerCode,
                      relationCode: row.relationCode,
                      mobileNumber: row.mobileNumber,
                    },
                  });

                  if (foundRefence) {
                    const updateReferenceResult =
                      await this._referencesRepo.update(foundRefence.id, row);
                    console.log(`------ Find Reference`, foundRefence);
                    console.log(
                      `------ Update Reference:`,
                      (updateReferenceResult as any).result,
                    );
                    if (updateReferenceResult.affected > 0) {
                      sheetProcessResult.updateCount++;
                    }
                  } else {
                    row.isDeleted = false;
                    row.owner = {
                      orgId: data.handler.orgId,
                      userId: '',
                    };
                    const createReferenceResult =
                      await this._referencesRepo.save(row);
                    console.log(
                      `------ Create Reference:`,
                      createReferenceResult,
                    );
                    if (createReferenceResult) {
                      sheetProcessResult.insertCount++;
                    }
                  }
                  break;
                }
                case ImportData_ToTable.Investigation: {
                  row.fromFile = importData.fileName;
                  console.log(
                    `------ Row(${j}/${readResult.rows.length}) handled data`,
                    row,
                  );
                  const type = investigationTypes.find(
                    (r) => r.tags.indexOf(row.typeCode.toLowerCase()) >= 0,
                  );
                  if (type) {
                    row.typeCode = type.code;
                  } else {
                    row.typeCode = 'other';
                  }

                  const foundInvestigation =
                    await this._investigationsRepo.findOne({
                      where: {
                        customerCode: row.customerCode,
                        typeCode: row.typeCode,
                        value: row.value,
                      },
                    });

                  if (foundInvestigation) {
                    console.log(
                      `------ Find Investigation. No thing to do!`,
                      foundInvestigation,
                    );
                  } else {
                    row.isDeleted = false;
                    row.owner = {
                      orgId: data.handler.orgId,
                      userId: '',
                    };
                    const createReferenceResult =
                      await this._investigationsRepo.save(row);
                    console.log(
                      `------ Create Investigation:`,
                      createReferenceResult,
                    );
                    if (createReferenceResult) {
                      sheetProcessResult.insertCount++;
                    }
                  }
                  break;
                }
                case ImportData_ToTable.Activity: {
                  const activity = new Activity();

                  if (row.resultCode === 'DTT_Đã tất toán') {
                    row.resultCode = 'DT2';
                  }
                  if (row.resultParentCode === 'DTT_Khách hàng đã tất toán') {
                    row.resultParentCode = 'DT2';
                  }
                  row.resultCode = row.resultCode.split('_')[0];
                  row.resultParentCode = row.resultParentCode.split('_')[0];
                  row.fromFile = importData.fileName;
                  console.log(
                    `------ Row(${j}/${readResult.rows.length}) handled data`,
                    row,
                  );

                  activity.fromFile = importData.fileName;
                  activity.note = row.note;
                  activity.type = (row.type || '').toLowerCase().trim();
                  activity.staffCode = (row.staffCode || '').trim();
                  activity.customerCode = (row.customerCode || '').trim();
                  activity.contractCode = (row.contractCode || '').trim();
                  activity.resultCode = (row.resultCode || '').trim();
                  activity.resultParentCode = (
                    row.resultParentCode || ''
                  ).trim();
                  activity.contactInfo = {
                    fullname: '',
                    relation: {
                      code: '',
                      name: '',
                    },
                    phoneNumber: '',
                    note: '',
                  };
                  activity.performAt = row.createdAt;
                  activity.isDeleted = false;
                  activity.owner = {
                    orgId: data.handler.orgId,
                    userId: '',
                  };
                  activity.createdBy = {
                    appId: '',
                    orgId: data.handler.orgId,
                    userId: data.handler.userId,
                    staffCode: data.handler.staffCode,
                    roles: [],
                  };

                  const activityType = activityTypes.find(
                    (r) =>
                      r.tags.indexOf((activity.type + '').toLowerCase()) >= 0,
                  );
                  if (activityType) {
                    activity.type = activityType.code;
                  }

                  if (
                    activity.type === ActivityTypeCode.Call ||
                    activity.type === ActivityTypeCode.Letter ||
                    activity.type === ActivityTypeCode.Chat
                  ) {
                    if (row.referenceId) {
                      const arr = row.referenceId.split('-');
                      if (arr.length === 2) {
                        activity.contactInfo.relation.code = arr[0].trim();
                        activity.contactInfo.phoneNumber = arr[1].trim();
                        activity.contactInfo.note = arr[0].trim();

                        const relation = relations.find(
                          (r) =>
                            r.tags.indexOf(
                              (
                                activity.contactInfo.relation.code + ''
                              ).toLowerCase(),
                            ) >= 0,
                        );

                        if (relation) {
                          activity.contactInfo.relation.code = relation.code;
                          activity.contactInfo.relation.name = relation.name;
                        }

                        if (
                          activity.contactInfo.relation.code ===
                          RelationCode.Client
                        ) {
                          const customers = await this.customersRepository.find(
                            { where: { code: activity.customerCode } },
                          );
                          if (customers) {
                            if (customers.length > 0) {
                              activity.contactInfo.fullname =
                                customers[0].fullname;
                            }
                          }
                        }
                      }
                    }
                  }
                  if (activity.type === ActivityTypeCode.Visit) {
                    if (row.referenceId) {
                      activity.contactInfo.address = row.referenceId;
                    }
                  }

                  console.log(`------ Activity:`, activity);
                  const createActivityResult = await this._activitiesRepo.save(
                    activity,
                  );
                  console.log(`------ Create Activity:`, createActivityResult);
                  if (createActivityResult) {
                    sheetProcessResult.insertCount++;
                  }
                  break;
                }
                default:
                  break;
              }
            }
            // End loop of rows
            console.log(
              `---- Process Data File '${importDataPath}' Sheet(${i}/${importData.settings.sheets.length}) '${sheet.name}' result`,
              sheetProcessResult,
            );
            for (let j = 0; j < importData.info.sheets.length; j++) {
              if (importData.info.sheets[j].name === sheet.name)
                importData.info.sheets[j] = { ...sheetProcessResult };
            }
          }
        }
        // End loop of sheets
      }
    }
    const updateImportDataResult = await super.updateOne(
      importData.id,
      { status: ImportData_Status.Done, info: importData.info },
      data.handler,
    );

    return updateImportDataResult;
  }
}
