import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DataFile } from './entity/data-file.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { CreateDataFileData } from './dto/create.dto';
import { DataFileStatus } from './enum/data-file.enum';
import { readSheetNames } from 'read-excel-file/node';
import readXlsxFile from 'read-excel-file/node';
import { getTypeOf } from 'src/common/utils/object-helper';
import { Customer } from '../customer/entity/customer.entity';
import { replaceRegexPatternFromString } from 'src/common/utils/string-helper';
import { Contract } from '../contract/entity/contract.entity';
import { Transaction } from '../transaction/entity/transaction.entity';

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
    required: true,
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
    required: true,
  },
  ovdBalance: {
    prop: 'ovdBalance',
    type: Number,
    required: true,
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
  startedAt: {
    prop: 'startedAt',
    type: Date,
    required: true,
  },
  endedAt: {
    prop: 'endedAt',
    type: Date,
    required: false,
  },
  status: {
    prop: 'status',
    type: (value) => {
      value = (value + '').toLocaleLowerCase().toString();
      if (value.indexOf('active') >= 0) {
        value = 'active';
      } else {
        value = 'inactive';
      }
      return value;
    },
    required: true,
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

@Injectable()
export class DataFileService extends BaseService<DataFile> {
  private _customersRepo: MongoRepository<Customer>;
  private _contractsRepo: MongoRepository<Contract>;
  private _transactionRepo: MongoRepository<Transaction>;
  constructor(
    @InjectRepository(DataFile)
    private readonly dataFilesRepository: MongoRepository<DataFile>,
    @InjectRepository(Customer)
    private readonly customersRepository: MongoRepository<Customer>,
    @InjectRepository(Contract)
    private readonly contractsRepository: MongoRepository<Contract>,
    @InjectRepository(Transaction)
    private readonly transactionsRepository: MongoRepository<Transaction>,
  ) {
    super(dataFilesRepository);
    this._customersRepo = customersRepository;
    this._contractsRepo = contractsRepository;
    this._transactionRepo = transactionsRepository;
  }

  async createOne(
    data: CreateDataFileData,
    handler: DataHandler,
  ): Promise<any> {
    const dataFile = new DataFile();
    dataFile.fileName = data.fileName;
    dataFile.note = data.note;
    return super.createOne(dataFile, handler);
  }

  async readDataFile(id: string, handler: DataHandler): Promise<any> {
    const dataFile = (await super.findOne(id, handler)) as DataFile;
    const info = {
      sheetNames: [],
    };
    if (dataFile.status === DataFileStatus.New) {
      const filePath = `./data/${dataFile.fileName}`;
      const sheetNames = await readSheetNames(filePath)
        .then((names) => names)
        .catch((e) => {
          console.log(e);
          return [];
        });
      info.sheetNames = sheetNames;
    } else {
      throw new BadRequestException(
        `Status of Data File '${id}' is '${dataFile.status}'. Can not read Data File in status '${dataFile.status}'!`,
      );
    }
    return super.updateOne(id, { status: DataFileStatus.Read, info }, handler);
  }

  async processDataFile(id: string, handler: DataHandler): Promise<any> {
    const dataFile = (await super.findOne(id, handler)) as DataFile;
    const info = dataFile.info;
    if (dataFile.status === DataFileStatus.Read) {
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
                  const foundTransaction = await this._transactionRepo.findOne({
                    where: {
                      contractCode: row.contractCode,
                      amount: row.amount,
                      date: row.date,
                    },
                  });

                  if (foundTransaction) {
                    const updateTransactionResult =
                      await this._transactionRepo.update(
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
                      await this._transactionRepo.save(row);
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
                default:
                  break;
              }
            }
            console.log(
              `Process Data File './data/${dataFile.fileName}' Sheet(${i}/${dataFile.settings.sheets.length}) '${sheet.name}':`,
              processResult,
            );
            for (let j = 0; j < dataFile.info.sheets.length; j++) {
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
      { status: DataFileStatus.Read, info: dataFile.info },
      handler,
    );
  }
}
