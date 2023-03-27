import * as fs from 'fs';
import * as path from 'path';
import { ObjectID } from 'mongodb';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ExportData } from './entity/export-data.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { CreateExportDataData } from './dto/create.dto';
import { ExportData_Status } from './enum/export-data.enum';
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
import { Services } from 'src/common/enums/services';
import { ClientProxy } from '@nestjs/microservices';
import {
  ActivityXlsxSchema,
  ContractXlsxSchema,
  CustomerXlsxSchema,
  InvestigationXlsxSchema,
  ReferenceXlsxSchema,
  TransactionXlsxSchema,
} from './constant/export-data.constant';
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
export class ExportDataService extends BaseService<ExportData> {
  private _customersRepo: MongoRepository<Customer>;
  private _contractsRepo: MongoRepository<Contract>;
  private _transactionsRepo: MongoRepository<Transaction>;
  private _referencesRepo: MongoRepository<Reference>;
  private _investigationsRepo: MongoRepository<Investigation>;
  private _activitiesRepo: MongoRepository<Activity>;
  constructor(
    @InjectRepository(ExportData)
    private readonly exportDatasRepository: MongoRepository<ExportData>,
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
    super(exportDatasRepository);
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
  ): Promise<FindAllResult<ExportData>> {
    filter.order = { createdAt: -1 };
    return await super.findManyWithPaging(filter, handler);
  }

  async createOne(
    data: CreateExportDataData,
    handler: DataHandler,
  ): Promise<any> {
    const exportData = new ExportData();
    exportData.note = data.note;
    exportData.datasources = data.datasources;
    exportData.outputFileType = data.outputFileType;
    exportData.status = ExportData_Status.Todo;
    console.log(``);
    console.log(``);
    console.log(`Create new Export Data request`, exportData);

    return super.createOne(exportData, handler);
  }

  /*   async updateOne(
    id: ObjectID,
    data: UpdateExportDataData,
    handler: DataHandler,
  ): Promise<any> {
    const currentExportData: ExportData = await super.findOne(id, handler);
    if (data.settings) {
      if (getTypeOf(data.settings.sheets) === 'array') {
        if (data.settings.sheets.length > 0) {
          for (let i = 0; i < data.settings.sheets.length; i++) {
            const sheet = data.settings.sheets[i];
            const foundSheet = currentExportData.info.sheets.find(
              (s) => s.name === sheet.name,
            );
            const isValidRule =
              ExportData_ExportRule.CloseAll === sheet.rule ||
              ExportData_ExportRule.ReplaceAll === sheet.rule ||
              ExportData_ExportRule.DeleteAll === sheet.rule;
            const isValidToTable =
              ExportData_ToTable.Activity === sheet.toTable ||
              ExportData_ToTable.Contract === sheet.toTable ||
              ExportData_ToTable.Customer === sheet.toTable ||
              ExportData_ToTable.Investigation === sheet.toTable ||
              ExportData_ToTable.Reference === sheet.toTable ||
              ExportData_ToTable.Transaction === sheet.toTable;

            if (foundSheet === undefined) {
              throw new BadRequestException({
                message: `Sheet '${sheet.name}' is not found in file!`,
              });
            }

            if (isValidRule === false) {
              throw new BadRequestException({
                message: `Export rule '${sheet.rule}' is not valid for sheet '${sheet.name}'!`,
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
  } */

  async requestProcess(id: string, handler: DataHandler): Promise<any> {
    const updateResult = await super.updateOne(
      id,
      { status: ExportData_Status.Queued },
      handler,
    );

    console.log(``);
    console.log(``);
    console.log(`Request to process Export Data Id '${id}'`);
    if (updateResult) {
      const emitResult = await this.client.emit(
        'process-export-data',
        JSON.stringify({ exportDataId: id, handler }),
      );
      console.log(`-- Emit result`, emitResult);
      const subscriberResult = await emitResult.subscribe();
      console.log(`-- Subcriber result`, subscriberResult);
    }

    return updateResult;
  }

  async handleProcessExportData(data: {
    exportDataId: ObjectID;
    handler: DataHandler;
  }): Promise<any> {
    console.log(``);
    console.log(``);
    console.log(`Process Export Data request`);
    console.log(`-- Received data from message queue`, data);
    const exportData = await this.exportDatasRepository.findOne(
      data.exportDataId,
    );
    let processExportDataResult;
    console.log(`-- Export Data Request`, exportData);
    if (exportData) {
      const updateExportDataResult = await this.exportDatasRepository.update(
        exportData.id,
        { status: ExportData_Status.InProgress },
      );

      processExportDataResult = await this.exportDatasRepository.update(
        exportData.id,
        { status: ExportData_Status.Done },
      );
    }
    return processExportDataResult;
  }
}
