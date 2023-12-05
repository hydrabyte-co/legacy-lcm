// eslint-disable-next-line @typescript-eslint/no-var-requires
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DataMigration } from './entity/data-migration.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { CreateDataMigrationData } from './dto/create.dto';
import { DataMigration_Status } from './enum/data-migration.enum';
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
import {
  ActivitiesToExcelSchema,
  CustomersToExcelSchema,
  OutboundCallsToExcelSchema,
} from './constant/data-migration.constant';
import { Roles } from 'src/common/enums/roles';
import { logInfo } from 'src/common/utils/log-helper';
import { MessagePattern } from '../event/enum/event.enum';

@Injectable()
export class DataMigrationService extends BaseService<DataMigration> {
  /* private _customersRepo: MongoRepository<Customer>;
  private _contractsRepo: MongoRepository<Contract>;
  private _transactionsRepo: MongoRepository<Transaction>;
  private _referencesRepo: MongoRepository<Reference>;
  private _investigationsRepo: MongoRepository<Investigation>;
  private _activitiesRepo: MongoRepository<Activity>; */
  constructor(
    @InjectRepository(DataMigration)
    private readonly dataMigrationsRepository: MongoRepository<DataMigration>,
    /* @InjectRepository(Customer)
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
    private readonly activitiesRepository: MongoRepository<Activity>, */
    @Inject(Services.LCM) private client: ClientProxy,
  ) {
    super(dataMigrationsRepository);
    /* this._customersRepo = customersRepository;
    this._contractsRepo = contractsRepository;
    this._transactionsRepo = transactionsRepository;
    this._referencesRepo = referencesRepository;
    this._investigationsRepo = investigationsRepository;
    this._activitiesRepo = activitiesRepository; */
  }

  async findManyWithPaging(
    filter: FindManyFilter,
    handler: DataHandler,
  ): Promise<FindAllResult<DataMigration>> {
    filter.order = { createdAt: -1 };
    if (
      handler.roles.indexOf(Roles.OrganizationOwner) >= 0 ||
      handler.roles.indexOf(Roles.OrganizationAdmin) >= 0
    ) {
      filter.where = {};
    } else {
      filter.where['createdBy.userId'] = handler.userId;
    }
    return await super.findManyWithPaging(filter, handler);
  }

  async createOne(
    data: CreateDataMigrationData,
    handler: DataHandler,
  ): Promise<any> {
    const dataMigration = new DataMigration();
    dataMigration.note = data.note;
    dataMigration.filter = data.filter;
    dataMigration.collectionName = data.collectionName;
    dataMigration.status = DataMigration_Status.Todo;

    logInfo(
      `*`,
      `DataMigration.Service.createOne -> dataMigration`,
      dataMigration,
    );

    const createResult = await super.createOne(dataMigration, handler);
    const emitResult = await this.client.emit(MessagePattern.DataMigration, {
      id: createResult.id,
      collectionName: createResult.collectionName,
      filter: createResult.filter,
      handler,
    });
    logInfo(`*`, `DataMigration.Service.createOne -> emitResult`, emitResult);
    const subscriberResult = await emitResult.subscribe();
    logInfo(
      `*`,
      `DataMigration.Service.createOne -> subscriberResult`,
      subscriberResult,
    );
    dataMigration.id = createResult.id;
    dataMigration.status = DataMigration_Status.Queued;
    const saveResult = await this.dataMigrationsRepository.save(dataMigration);
    logInfo(`*`, `DataMigration.Service.createOne -> saveResult`, saveResult);
    return createResult;
  }

  async createNoData(data: CreateDataMigrationData) {
    const emitResult = await this.client.emit(MessagePattern.DataMigration, {
      id: '',
      collectionName: data.collectionName,
      filter: data.filter,
      handler: {},
      recordsCount: data.recordsCount,
    });
    logInfo(`*`, `DataMigration.Service.createNoData -> data`, data);
    logInfo(
      `*`,
      `DataMigration.Service.createNoData -> emitResult`,
      emitResult,
    );
    const subscriberResult = await emitResult.subscribe();
    logInfo(
      `*`,
      `DataMigration.Service.createNoData -> subscriberResult`,
      subscriberResult,
    );
    return data;
  }
}
