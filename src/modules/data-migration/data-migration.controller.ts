import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Query,
  Req,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import {
  ServiceInfo,
  ControllerInfo,
} from 'src/common/decorators/service-info';
import { DataMigrationService } from './data-migration.service';
import {
  CreateDataMigrationData,
  CreateDataMigrationResult,
} from './dto/create.dto';
import { FindDataMigrationByIdResult } from './dto/find-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Resources } from 'src/common/enums/resources';
import { DataMigration } from './entity/data-migration.entity';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { EventPattern } from '@nestjs/microservices';

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
  async createOne(
    @Body() data: CreateDataMigrationData,
    @Req() req,
  ): Promise<CreateDataMigrationResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(
    @Param('id') id: string,
    @Req() req,
  ): Promise<FindDataMigrationByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req,
  ): Promise<FindAllResult<DataMigration>> {
    return await super.findManyWithPaging(queries, req);
  }
}
