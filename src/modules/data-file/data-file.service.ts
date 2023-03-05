import * as fs from 'fs';
import * as path from 'path';
import { ObjectID } from 'mongodb';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DataFile } from './entity/data-file.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { CreateDataFileData } from './dto/create.dto';
import {
  DataFile_Status,
  DataFile_ImportRule,
  DataFile_ToTable,
} from './enum/data-file.enum';
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
import { UpdateDataFileData } from './dto/update-one.dto';
import { Services } from 'src/common/enums/services';
import { ClientProxy } from '@nestjs/microservices';
import {
  ActivityXlsxSchema,
  ContractXlsxSchema,
  CustomerXlsxSchema,
  InvestigationXlsxSchema,
  ReferenceXlsxSchema,
  TransactionXlsxSchema,
  investigationTypes,
  relations,
} from './constant/data-file.constant';
import { CustomerStatus } from '../customer/enum/customer.enum';
import { ContractStatus } from '../contract/enum/contract.enum';

@Injectable()
export class DataFileService extends BaseService<DataFile> {
  private _customersRepo: MongoRepository<Customer>;
  private _contractsRepo: MongoRepository<Contract>;
  private _transactionsRepo: MongoRepository<Transaction>;
  private _referencesRepo: MongoRepository<Reference>;
  private _investigationsRepo: MongoRepository<Investigation>;
  private _activitiesRepo: MongoRepository<Activity>;
  constructor(
    @InjectRepository(DataFile)
    private readonly dataFilesRepository: MongoRepository<DataFile>,
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
    super(dataFilesRepository);
    this._customersRepo = customersRepository;
    this._contractsRepo = contractsRepository;
    this._transactionsRepo = transactionsRepository;
    this._referencesRepo = referencesRepository;
    this._investigationsRepo = investigationsRepository;
    this._activitiesRepo = activitiesRepository;
  }

  async createOne(
    data: CreateDataFileData,
    handler: DataHandler,
  ): Promise<any> {
    const urlRegex = new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    );
    const dataFile = new DataFile();
    dataFile.fileName = data.fileName;
    dataFile.note = data.note;
    dataFile.partnerCode = data.partnerCode;
    dataFile.status = DataFile_Status.New;
    console.log(``);
    console.log(``);
    console.log(`Create new Data File`, dataFile);
    if (urlRegex.test(dataFile.fileName)) {
      const now = new Date();
      const dataDirPath = './data';
      const dataFilePath = `${dataDirPath}/${now.getTime()}.xlsx`;
      if (!fs.existsSync(dataDirPath)) {
        console.log(
          `-- Directory '${dataDirPath} not existed, create new one...'`,
        );
        fs.mkdirSync(dataDirPath);
      }
      const downloadFileResult = await downloadFile(
        dataFile.fileName,
        dataFilePath,
      );
      console.log(
        `-- Download file '${dataFile.fileName} to '${dataFilePath}'`,
        downloadFileResult,
      );
      if (downloadFileResult === true) {
        const sheetNames = await readSheetNames(dataFilePath)
          .then((names) => names)
          .catch((e) => {
            console.log(`-- Read Sheet name of file ${dataDirPath} error`, e);
            return [];
          });
        console.log(`-- Read Sheet name of file ${dataDirPath}`, sheetNames);
        dataFile.info.sheets = sheetNames.map((name) => {
          return { name };
        });
        return super.createOne(dataFile, handler);
      }
    } else {
      throw new BadRequestException({
        message: `-- Can not download file '${dataFile.fileName}'!`,
      });
    }
  }

  async updateOne(
    id: ObjectID,
    data: UpdateDataFileData,
    handler: DataHandler,
  ): Promise<any> {
    const currentDataFile: DataFile = await super.findOne(id, handler);
    if (data.settings) {
      if (getTypeOf(data.settings.sheets) === 'array') {
        if (data.settings.sheets.length > 0) {
          for (let i = 0; i < data.settings.sheets.length; i++) {
            const sheet = data.settings.sheets[i];
            const foundSheet = currentDataFile.info.sheets.find(
              (s) => s.name === sheet.name,
            );
            const isValidRule =
              DataFile_ImportRule.CloseAll === sheet.rule ||
              DataFile_ImportRule.ReplaceAll === sheet.rule ||
              DataFile_ImportRule.DeleteAll === sheet.rule;
            const isValidToTable =
              DataFile_ToTable.Activity === sheet.toTable ||
              DataFile_ToTable.Contract === sheet.toTable ||
              DataFile_ToTable.Customer === sheet.toTable ||
              DataFile_ToTable.Investigation === sheet.toTable ||
              DataFile_ToTable.Reference === sheet.toTable ||
              DataFile_ToTable.Transaction === sheet.toTable;

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
  async processDataFile(id: string, handler: DataHandler): Promise<any> {
    const updateResult = await super.updateOne(
      id,
      { status: DataFile_Status.Queued },
      handler,
    );

    console.log(``);
    console.log(``);
    console.log(`Request to process Data File '${id}'`);
    if (updateResult) {
      const emitResult = await this.client.emit(
        'process-data-file',
        JSON.stringify({ dataFileId: id, handler }),
      );
      console.log(`-- Emit result`, emitResult);
      const subscriberResult = await emitResult.subscribe();
      console.log(`-- Subcriber result`, subscriberResult);
    }

    return updateResult;
  }

  async handleProcessFile(data: {
    dataFileId: ObjectID;
    handler: DataHandler;
  }): Promise<any> {
    console.log(``);
    console.log(``);
    console.log(`Process Data File`);
    console.log(`-- Data file id`, data.dataFileId);
    const dataFile = await this.dataFilesRepository.findOne(data.dataFileId);
    console.log(`-- Data file`, dataFile);
    if (dataFile) {
      const updateDataFileResult = await this.dataFilesRepository.update(
        dataFile.id,
        { status: DataFile_Status.Processing },
      );
      console.log(
        `-- Update data file status to 'processing'`,
        updateDataFileResult.affected > 0,
      );
      dataFile.status = DataFile_Status.Processing;

      const now = new Date();
      const dataDirPath = './data';
      const dataFilePath = `${dataDirPath}/${now.getTime()}.xlsx`;
      if (!fs.existsSync(dataDirPath)) {
        console.log(
          `-- Directory '${dataDirPath} not existed, create new one...'`,
        );
        fs.mkdirSync(dataDirPath);
      }
      const downloadFileResult = await downloadFile(
        dataFile.fileName,
        dataFilePath,
      );
      console.log(
        `-- Download file '${dataFile.fileName} to '${dataFilePath}'`,
        downloadFileResult,
      );

      if (getTypeOf(dataFile.settings.sheets) === 'array') {
        for (let i = 0; i < dataFile.settings.sheets.length; i++) {
          const sheet = dataFile.settings.sheets[i];
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
            case DataFile_ToTable.Customer: {
              readSchema = CustomerXlsxSchema;
              break;
            }
            case DataFile_ToTable.Contract: {
              readSchema = ContractXlsxSchema;
              break;
            }
            case DataFile_ToTable.Reference: {
              readSchema = ReferenceXlsxSchema;
              break;
            }
            case DataFile_ToTable.Activity: {
              readSchema = ActivityXlsxSchema;
              break;
            }
            case DataFile_ToTable.Investigation: {
              readSchema = InvestigationXlsxSchema;
              break;
            }
            case DataFile_ToTable.Transaction: {
              readSchema = Transaction;
              break;
            }
            default:
              break;
          }
          readResult = await readXlsxFile(dataFilePath, {
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
              `---- Process Data File '${dataFilePath}' Sheet(${i}/${dataFile.settings.sheets.length}) '${sheet.name}': ${readResult.rows.length} rows, ${readResult.errors.length} errors`,
            );
            console.log(`---- Import Rule`, sheet.rule);
            console.log(`---- To Table`, sheet.toTable);

            switch (sheet.rule) {
              case DataFile_ImportRule.CloseAll: {
                if (sheet.toTable === DataFile_ToTable.Customer) {
                  const updateAllCustomerResult =
                    await this.customersRepository.updateMany(
                      { partnerCode: dataFile.partnerCode },
                      { status: CustomerStatus.Closed },
                    );
                  console.log(
                    `---- Update status of all customers  to 'closed'`,
                    updateAllCustomerResult.result,
                  );
                }
                if (sheet.toTable === DataFile_ToTable.Contract) {
                  const updateAllContractResult =
                    await this.contractsRepository.updateMany(
                      {},
                      { status: ContractStatus.Closed },
                    );
                  console.log(
                    `---- Update status of all contracts to 'closed'`,
                    updateAllContractResult.result,
                  );
                }
                break;
              }
              case DataFile_ImportRule.DeleteAll: {
                if (sheet.toTable === DataFile_ToTable.Investigation) {
                  const deleteAllImportedRecordsResults =
                    await this.investigationsRepository.deleteMany({
                      $and: [
                        { fromFile: { $ne: null } },
                        { fromFile: { $ne: '' } },
                        { partnerCode: dataFile.partnerCode },
                      ],
                    });
                  console.log(
                    `---- Delete all imported Investigations`,
                    deleteAllImportedRecordsResults,
                  );
                }
                if (sheet.toTable === DataFile_ToTable.Reference) {
                  const deleteAllImportedRecordsResults =
                    await this.referencesRepository.deleteMany({
                      $and: [
                        { fromFile: { $ne: null } },
                        { fromFile: { $ne: '' } },
                        { partnerCode: dataFile.partnerCode },
                      ],
                    });
                  console.log(
                    `---- Delete all imported References`,
                    deleteAllImportedRecordsResults,
                  );
                }
                if (sheet.toTable === DataFile_ToTable.Transaction) {
                  const deleteAllImportedRecordsResults =
                    await this.transactionsRepository.deleteMany({
                      $and: [
                        { fromFile: { $ne: null } },
                        { fromFile: { $ne: '' } },
                        { partnerCode: dataFile.partnerCode },
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
              console.log(`------ Row(${j}/${readResult.rows.length})`, row);
              switch (sheet.toTable) {
                case DataFile_ToTable.Customer: {
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
                  break;
                }
                case DataFile_ToTable.Contract: {
                  break;
                }
                default:
                  break;
              }
            }
            // End loop of rows
            console.log(
              `---- Process Data File '${dataFilePath}' Sheet(${i}/${dataFile.settings.sheets.length}) '${sheet.name}' result`,
              sheetProcessResult,
            );
            for (let j = 0; j < dataFile.info.sheets.length; j++) {
              if (dataFile.info.sheets[j].name === sheet.name)
                dataFile.info.sheets[j] = { ...sheetProcessResult };
            }
          }
        }
        // End loop of sheets
      }
    }
    const updateDataFileResult = await super.updateOne(
      dataFile.id,
      { status: DataFile_Status.Done, info: dataFile.info },
      data.handler,
    );

    return updateDataFileResult;
  }
}
