import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ControllerInfo, ServiceInfo } from '../../common/decorators/service-info';
import { Resources } from '../../common/enums/resources';
import { Services } from '../../common/enums/services';
import { RolesGuard } from '../../common/guards/auth/roles.guard';
import { BaseController } from '../../common/modules/base/base.controller';
import { FindAllResult } from '../../common/modules/base/dto/find-many.dto';
import { DataMigrationService } from './data-migration.service';
import {
  CreateDataMigrationData,
  CreateDataMigrationResult,
} from './dto/create.dto';
import { FindDataMigrationByIdResult } from './dto/find-one.dto';
import { DataMigration } from './entity/data-migration.entity';

@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.LCM_DataMigration)
@Controller(Resources.LCM_DataMigration)
export class DataMigrationsController extends BaseController {
  constructor(private readonly dataMigrationsService: DataMigrationService) {
    super(dataMigrationsService);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async createOne(
    @Body() data: CreateDataMigrationData,
    @Req() req: Request,
  ): Promise<CreateDataMigrationResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<FindDataMigrationByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req: Request,
  ): Promise<FindAllResult<DataMigration>> {
    return await super.findManyWithPaging(queries, req);
  }
}
