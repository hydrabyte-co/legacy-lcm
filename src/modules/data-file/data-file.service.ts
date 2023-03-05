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

const relations: {
  name: string;
  code: string;
  tags: string[];
}[] = [
  {
    name: 'Bố mẹ',
    code: 'parent',
    tags: ['bố mẹ', 'bố', 'mẹ'],
  },
  {
    name: 'Vợ chồng',
    code: 'spouse',
    tags: ['vợ chồng', 'vợ', 'chồng'],
  },
  {
    name: 'Anh chị em',
    code: 'sibling',
    tags: ['anh chị em', 'anh', 'chị', 'em'],
  },
  {
    name: 'Con cái',
    code: 'child',
    tags: ['con', 'con trai', 'con gái'],
  },
  {
    name: 'Bạn bè',
    code: 'friend',
    tags: ['bạn', 'bạn bè'],
  },
  {
    name: 'Người thân khác',
    code: 'other-relative',
    tags: ['cô', 'chú', 'bác', 'cháu', 'ông', 'bà'],
  },
  {
    name: 'Đồng nghiệp',
    code: 'colleague',
    tags: ['đồng nghiệp', 'công ty'],
  },
  {
    name: 'Đồng nghiệp',
    code: 'colleague',
    tags: ['đồng nghiệp'],
  },
  {
    name: 'Khác',
    code: 'other',
    tags: [''],
  },
];

const activityTypes: {
  name: string;
  code: string;
  tags: string[];
}[] = [
  {
    name: 'Gọi',
    code: 'call',
    tags: ['call'],
  },
  {
    name: 'Mạnh xã hội',
    code: 'social-network',
    tags: ['mạng xã hội', 'mxh', 'facebook', 'zalo'],
  },
  {
    name: 'Điều tra',
    code: 'skip',
    tags: ['skip'],
  },
];

const investigationTypes: {
  name: string;
  code: string;
  tags: string[];
}[] = [
  {
    name: 'Địa chỉ',
    code: 'address',
    tags: ['địa chỉ', 'address'],
  },
  {
    name: 'Email',
    code: 'email',
    tags: ['email'],
  },
  {
    name: 'Mạng xã hội',
    code: 'social-network',
    tags: [
      'mxh',
      'facebook',
      'mạng xã hội',
      'twitter',
      'zalo',
      'social-network',
    ],
  },
  {
    name: 'Số điện thoại',
    code: 'phone-number',
    tags: ['điện thoại', 'di dộng', 'số điện thoại', 'phone-number'],
  },
  {
    name: 'Thông tin khác',
    code: 'other',
    tags: ['thông tin khác', 'other'],
  },
];

const CustomerXlsxSchema = {
  code: {
    prop: 'code',
    type: String,
    required: true,
  },
  partnerCode: {
    prop: 'partnerCode',
    type: String,
    required: true,
  },
  callStaffCode: {
    prop: 'callStaffCode',
    type: String,
    required: false,
  },
  fieldStaffCode: {
    prop: 'fieldStaffCode',
    type: String,
    required: false,
  },
  fullname: {
    prop: 'fullname',
    type: String,
    required: true,
  },
  gender: {
    prop: 'gender',
    type: (value) => {
      value = (value + '').toLocaleLowerCase().toString();
      if (value.indexOf('female') >= 0) {
        value = 'female';
      } else if (value.indexOf('male') >= 0) {
        value = 'male';
      } else {
        value = '';
      }
      return value;
    },
    required: false,
  },
  dob: {
    prop: 'dob',
    type: (value) => {
      switch (getTypeOf(value)) {
        case 'datetime': {
          value = (value as Date).toISOString().split('T')[0];
          break;
        }
        default: {
          if (value === null) {
            value = '';
          }
          if (value === undefined) {
            value = '';
          }
          break;
        }
      }
      return value;
    },
    required: false,
  },
  identityNumber: {
    prop: 'identityNumber',
    type: (value) => {
      return replaceRegexPatternFromString(value, '[^0-9]+', '');
    },
    required: false,
  },
  mobileNumber: {
    prop: 'mobileNumber',
    type: (value) => {
      return replaceRegexPatternFromString(value, '[^0-9]+', '');
    },
    required: true,
  },
  officeNumber: {
    prop: 'officeNumber',
    type: (value) => {
      return replaceRegexPatternFromString(value, '[^0-9]+', '');
    },
    required: false,
  },
  email: {
    prop: 'email',
    type: String,
    required: false,
  },
  temporaryAddress: {
    prop: 'temporaryAddress',
    type: String,
    required: false,
  },
  permanentAddress: {
    prop: 'permanentAddress',
    type: String,
    required: false,
  },
  officeAddress: {
    prop: 'officeAddress',
    type: String,
    required: false,
  },
  officeName: {
    prop: 'officeName',
    type: String,
    required: false,
  },
  jobPosition: {
    prop: 'jobPosition',
    type: String,
    required: false,
  },
  businessDomain: {
    prop: 'businessDomain',
    type: String,
    required: false,
  },
  note: {
    prop: 'note',
    type: String,
    required: false,
  },
};

const ContractXlsxSchema = {
  code: {
    prop: 'code',
    type: String,
    required: true,
  },
  partnerCode: {
    prop: 'partnerCode',
    type: String,
    required: true,
  },
  customerCode: {
    prop: 'customerCode',
    type: String,
    required: false,
  },
  guid: {
    prop: 'guid',
    type: String,
    required: false,
  },
  customerCIF: {
    prop: 'customerCIF',
    type: String,
    required: false,
  },
  productGroup: {
    prop: 'productGroup',
    type: String,
    required: false,
  },
  originalBalance: {
    prop: 'originalBalance',
    type: Number,
    required: false,
  },
  totalBalance: {
    prop: 'totalBalance',
    type: Number,
    required: false,
  },
  ovdBalance: {
    prop: 'ovdBalance',
    type: Number,
    required: false,
  },
  performingBalance: {
    prop: 'performingBalance',
    type: Number,
    required: false,
  },
  periodicalPaymentAmount: {
    prop: 'periodicalPaymentAmount',
    type: Number,
    required: false,
  },
  prAmount: {
    prop: 'prAmount',
    type: Number,
    required: false,
  },
  inAmount: {
    prop: 'inAmount',
    type: Number,
    required: false,
  },
  peAmount: {
    prop: 'peAmount',
    type: Number,
    required: false,
  },
  psAmount: {
    prop: 'psAmount',
    type: Number,
    required: false,
  },
  ovdDays: {
    prop: 'ovdDays',
    type: Number,
    required: false,
  },
  totalPaymentPartner: {
    prop: 'totalPaymentAmountFromPartner',
    type: Number,
    required: false,
  },
  totalPayment: {
    prop: 'totalPaymentAmount',
    type: Number,
    required: false,
  },
  valueDate: {
    prop: 'valueDate',
    type: Date,
    required: false,
  },
  maturityDate: {
    prop: 'maturityDate',
    type: Date,
    required: false,
  },
  ovdDate: {
    prop: 'ovdDate',
    type: Date,
    required: false,
  },
  dueDayOfMonth: {
    prop: 'dueDayOfMonth',
    type: Number,
    required: false,
  },
  bucket: {
    prop: 'bucket',
    type: Number,
    required: false,
  },
  term: {
    prop: 'term',
    type: String,
    required: false,
  },
  transferDate: {
    prop: 'transferDate',
    type: Date,
    required: false,
  },
  status: {
    prop: 'status',
    type: (value) => {
      value = (value + '').toLocaleLowerCase().toString();
      if (value.indexOf('active') >= 0 || value.toLocaleLowerCase() === 'a') {
        value = 'active';
      } else {
        value = 'inactive';
      }
      return value;
    },
    required: false,
  },
  interestRate: {
    prop: 'interestRate',
    type: Number,
    required: false,
  },
  branchName: {
    prop: 'branchName',
    type: String,
    required: false,
  },
  branchCode: {
    prop: 'branchCode',
    type: String,
    required: false,
  },
  accountNo: {
    prop: 'accountNo',
    type: String,
    required: true,
  },
  lastPaymentAmount: {
    prop: 'lastPaymentAmount',
    type: Number,
    required: false,
  },
  lastPaymentDate: {
    prop: 'lastPaymentDate',
    type: Date,
    required: false,
  },
  contractLink: {
    prop: 'contractLink',
    type: String,
    required: false,
  },
  ovdPeriod: {
    prop: 'ovdPeriod',
    type: Number,
    required: false,
  },
  statusOfLoan: {
    prop: 'statusOfLoan',
    type: String,
    required: false,
  },
};

const TransactionXlsxSchema = {
  customerCode: {
    prop: 'customerCode',
    type: String,
    required: true,
  },
  contractCode: {
    prop: 'contractCode',
    type: String,
    required: true,
  },
  amount: {
    prop: 'amount',
    type: Number,
    required: true,
  },
  date: {
    prop: 'date',
    type: Date,
    required: true,
  },
};

const ReferenceXlsxSchema = {
  customerCode: {
    prop: 'customerCode',
    type: String,
    required: true,
  },
  callStaffCode: {
    prop: 'callStaffCode',
    type: String,
    required: true,
  },
  relationCode: {
    prop: 'relationCode',
    type: String,
    required: true,
  },
  fullname: {
    prop: 'fullname',
    type: String,
    required: true,
  },
  gender: {
    prop: 'gender',
    type: (value) => {
      value = (value + '').toLocaleLowerCase().toString();
      if (value.indexOf('female') >= 0) {
        value = 'female';
      } else if (value.indexOf('male') >= 0) {
        value = 'male';
      } else {
        value = '';
      }
      return value;
    },
    required: false,
  },
  dob: {
    prop: 'dob',
    type: (value) => {
      switch (getTypeOf(value)) {
        case 'datetime': {
          value = (value as Date).toISOString().split('T')[0];
          break;
        }
        default: {
          if (value === null) {
            value = '';
          }
          if (value === undefined) {
            value = '';
          }
          break;
        }
      }
      return value;
    },
    required: false,
  },
  identityNumber: {
    prop: 'identityNumber',
    type: (value) => {
      return replaceRegexPatternFromString(value, '[^0-9]+', '');
    },
    required: false,
  },
  mobileNumber: {
    prop: 'mobileNumber',
    type: (value) => {
      return replaceRegexPatternFromString(value, '[^0-9]+', '');
    },
    required: true,
  },
  officeNumber: {
    prop: 'officeNumber',
    type: (value) => {
      return replaceRegexPatternFromString(value, '[^0-9]+', '');
    },
    required: false,
  },
  email: {
    prop: 'email',
    type: String,
    required: false,
  },
  temporaryAddress: {
    prop: 'temporaryAddress',
    type: String,
    required: false,
  },
  permanentAddress: {
    prop: 'permanentAddress',
    type: String,
    required: false,
  },
  note: {
    prop: 'note',
    type: String,
    required: false,
  },
  createdAt: {
    prop: 'date',
    type: Date,
    required: true,
  },
};

const InvestigationXlsxSchema = {
  customerCode: {
    prop: 'customerCode',
    type: String,
    required: true,
  },
  staffCode: {
    prop: 'staffCode',
    type: String,
    required: true,
  },
  typeCode: {
    prop: 'typeCode',
    type: String,
    required: true,
  },
  value: {
    prop: 'value',
    type: String,
    required: false,
  },
  note: {
    prop: 'note',
    type: String,
    required: false,
  },
};

const ActivityXlsxSchema = {
  customerCode: {
    prop: 'customerCode',
    type: String,
    required: true,
  },
  staffCode: {
    prop: 'staffCode',
    type: String,
    required: true,
  },
  contractCode: {
    prop: 'contractCode',
    type: String,
    required: true,
  },
  type: {
    prop: 'type',
    type: String,
    required: true,
  },
  note: {
    prop: 'note',
    type: String,
    required: false,
  },
  referenceId: {
    prop: 'referenceId',
    type: String,
    required: false,
  },
  resultCode: {
    prop: 'resultCode',
    type: String,
    required: false,
  },
  resultParentCode: {
    prop: 'resultParentCode',
    type: String,
    required: false,
  },
  ptpDate: {
    prop: 'ptpDate',
    type: String,
    required: false,
  },
  createdAt: {
    prop: 'createdAt',
    type: Date,
    required: false,
  },
};

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
        id.toString(),
      );
      console.log(`-- Emit result`, emitResult);
      const subscriberResult = await emitResult.subscribe();
      console.log(`-- Subcriber result`, subscriberResult);
    }

    return updateResult;
  }

  async handleProcessFile(data: any): Promise<any> {
    console.log(``);
    console.log(``);
    console.log(`Process Data File`);
    console.log(`Data`, data);
    return true;
  }

  async processDataFile_(id: string, handler: DataHandler): Promise<any> {
    const dataFile = (await super.findOne(id, handler)) as DataFile;
    const info = dataFile.info;
    if (dataFile.status === DataFile_Status.Read) {
      const filePath = `./data/${dataFile.fileName}`;
      if (getTypeOf(dataFile.settings.sheets) === 'array') {
        for (let i = 0; i < dataFile.settings.sheets.length; i++) {
          const sheet = dataFile.settings.sheets[i];
          const processResult = {
            name: sheet.name,
            validRows: 0,
            errorRows: 0,
            insert: 0,
            update: 0,
          };
          let readResult = undefined;
          let readSchema = undefined;

          switch (sheet.schema) {
            case 'customer': {
              readSchema = CustomerXlsxSchema;
              break;
            }
            case 'contract': {
              readSchema = ContractXlsxSchema;
              break;
            }
            case 'transaction': {
              readSchema = TransactionXlsxSchema;
              break;
            }
            case 'reference': {
              readSchema = ReferenceXlsxSchema;
              break;
            }
            case 'investigation': {
              readSchema = InvestigationXlsxSchema;
              break;
            }
            case 'activity': {
              readSchema = ActivityXlsxSchema;
              break;
            }
            default:
              break;
          }

          readResult = await readXlsxFile(filePath, {
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
            processResult.validRows = readResult.rows.length;
            processResult.errorRows = readResult.errors.length;
            console.log(
              `Process Data File './data/${dataFile.fileName}' Sheet(${i}/${dataFile.settings.sheets.length}) '${sheet.name}': ${readResult.rows.length} rows, ${readResult.errors.length} errors`,
            );
            console.log(`Errors:`, readResult.errors);
            // throw new BadRequestException();
            for (let j = 0; j < readResult.rows.length; j++) {
              const row = readResult.rows[j];
              console.log(`-- Row(${j}/${readResult.rows.length})`, row);
              switch (sheet.schema) {
                case 'customer': {
                  const foundCustomer = await this._customersRepo.findOne({
                    where: { code: row.code },
                  });

                  if (foundCustomer) {
                    const updateCustomerResult =
                      await this._customersRepo.update(foundCustomer.id, row);
                    console.log(
                      `---- Find customer by code '${row.code}'`,
                      foundCustomer,
                    );
                    console.log(
                      `---- Update customer:`,
                      (updateCustomerResult as any).result,
                    );
                    if (updateCustomerResult.affected > 0) {
                      processResult.update++;
                    }
                  } else {
                    row.isDeleted = false;
                    row.owner = {
                      orgId: handler.orgId,
                      userId: '',
                    };
                    const createCustomerResult = await this._customersRepo.save(
                      row,
                    );
                    console.log(`---- Create customer:`, createCustomerResult);
                    if (createCustomerResult) {
                      processResult.insert++;
                    }
                  }
                  break;
                }
                case 'contract': {
                  const foundContract = await this._contractsRepo.findOne({
                    where: { code: row.code },
                  });

                  if (foundContract) {
                    const updateContractResult =
                      await this._contractsRepo.update(foundContract.id, row);
                    console.log(
                      `---- Find contract by code '${row.code}'`,
                      foundContract,
                    );
                    console.log(
                      `---- Update contract:`,
                      (updateContractResult as any).result,
                    );
                    if (updateContractResult.affected > 0) {
                      processResult.update++;
                    }
                  } else {
                    row.isDeleted = false;
                    row.owner = {
                      orgId: handler.orgId,
                      userId: '',
                    };
                    const createContractResult = await this._contractsRepo.save(
                      row,
                    );
                    console.log(`---- Create contract:`, createContractResult);
                    if (createContractResult) {
                      processResult.insert++;
                    }
                  }
                  break;
                }
                case 'transaction': {
                  const foundTransaction = await this._transactionsRepo.findOne(
                    {
                      where: {
                        contractCode: row.contractCode,
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
                      `---- Find transaction by contractCode '${row.code}', amount '${row.amount}', date '${row.date}'`,
                      foundTransaction,
                    );
                    console.log(
                      `---- Update transaction:`,
                      (updateTransactionResult as any).result,
                    );
                    if (updateTransactionResult.affected > 0) {
                      processResult.update++;
                    }
                  } else {
                    row.isDeleted = false;
                    row.owner = {
                      orgId: handler.orgId,
                      userId: '',
                    };
                    const createContractResult =
                      await this._transactionsRepo.save(row);
                    console.log(
                      `---- Create transaction:`,
                      createContractResult,
                    );
                    if (createContractResult) {
                      processResult.insert++;
                    }
                  }
                  break;
                }
                case 'reference': {
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
                    console.log(`---- Find Reference`, foundRefence);
                    console.log(
                      `---- Update Reference:`,
                      (updateReferenceResult as any).result,
                    );
                    if (updateReferenceResult.affected > 0) {
                      processResult.update++;
                    }
                  } else {
                    row.isDeleted = false;
                    row.owner = {
                      orgId: handler.orgId,
                      userId: '',
                    };
                    const createReferenceResult =
                      await this._referencesRepo.save(row);
                    console.log(
                      `---- Create Reference:`,
                      createReferenceResult,
                    );
                    if (createReferenceResult) {
                      processResult.insert++;
                    }
                  }
                  break;
                }
                case 'investigation': {
                  const type = investigationTypes.find(
                    (r) =>
                      r.tags.indexOf(row.typeCode.toLocaleLowerCase()) >= 0,
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
                      `---- Find Investigation. No thing to do!`,
                      foundInvestigation,
                    );
                  } else {
                    row.isDeleted = false;
                    row.owner = {
                      orgId: handler.orgId,
                      userId: '',
                    };
                    const createReferenceResult =
                      await this._investigationsRepo.save(row);
                    console.log(
                      `---- Create Investigation:`,
                      createReferenceResult,
                    );
                    if (createReferenceResult) {
                      processResult.insert++;
                    }
                  }
                  break;
                }
                case 'activity': {
                  const activity = new Activity();
                  if (row.resultCode === 'DTT_Đã tất toán') {
                    row.resultCode = 'DT2';
                  }
                  if (row.resultParentCode === 'DTT_Khách hàng đã tất toán') {
                    row.resultParentCode = 'DT2';
                  }
                  row.resultCode = row.resultCode.split('_')[0];
                  row.resultParentCode = row.resultParentCode.split('_')[0];

                  activity.fromFile = dataFile.fileName;
                  activity.note = row.note;
                  activity.type = row.type.toLowerCase();
                  activity.staffCode = row.staffCode;
                  activity.customerCode = row.customerCode;
                  activity.contractCode = row.contractCode;
                  activity.resultCode = row.resultCode;
                  activity.resultParentCode = row.resultParentCode;
                  activity.contactInfo = {
                    fullname: '',
                    relation: {
                      code: '',
                      name: '',
                    },
                    phoneNumber: '',
                  };
                  activity.performAt = row.createdAt;
                  activity.isDeleted = false;
                  activity.owner = {
                    orgId: handler.orgId,
                    userId: '',
                  };
                  activity.createdBy = {
                    appId: '',
                    orgId: handler.orgId,
                    userId: handler.userId,
                    staffCode: handler.staffCode,
                    roles: [],
                  };

                  if (activity.type === 'call') {
                    if (row.referenceId) {
                      const arr = row.referenceId.split('-');
                      console.log(arr);
                      if (arr.length === 2) {
                        activity.contactInfo.relation.code = arr[0].trim();
                        activity.contactInfo.phoneNumber = arr[1].trim();
                      }
                    }
                  }
                  console.log(`---- Activity:`, activity);
                  const createActivityResult = await this._activitiesRepo.save(
                    activity,
                  );
                  console.log(`---- Create Activity:`, createActivityResult);
                  if (createActivityResult) {
                    processResult.insert++;
                  }
                  break;
                }
                default:
                  break;
              }
            }
            console.log(
              `Process Data File './data/${dataFile.fileName}' Sheet(${i}/${dataFile.settings.sheets.length}) '${sheet.name}':`,
              processResult,
            );
            for (let j = 0; j < dataFile.info.sheets.length; j++) {
              if (dataFile.info.sheets[j].name === sheet.name)
                dataFile.info.sheets[j] = { ...processResult };
            }
            console.log(dataFile.info);
          }
        }
      }
    } else {
      throw new BadRequestException(
        `Status of Data File '${id}' is '${dataFile.status}'. Can not process Data File in status '${dataFile.status}'!`,
      );
    }
    return super.updateOne(
      id,
      { status: DataFile_Status.Read, info: dataFile.info },
      handler,
    );
  }
}
