import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Request } from 'express';
import {
  ControllerInfo,
  ServiceInfo,
} from '../../common/decorators/service-info';
import { Resources } from '../../common/enums/resources';
import { Services } from '../../common/enums/services';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { RolesGuard } from '../../common/guards/auth/roles.guard';
import { BaseController } from '../../common/modules/base/base.controller';
import { FindAllResult } from '../../common/modules/base/dto/find-many.dto';
import { DataHandler } from '../../common/modules/base/entity/data.class';
import { CreateImportDataData, CreateImportDataResult } from './dto/create.dto';
import { FindImportDataByIdResult } from './dto/find-one.dto';
import {
  UpdateImportDataData,
  UpdateImportDataResult,
} from './dto/update-one.dto';
import { ImportData } from './entity/import-data.entity';
import { ImportDataService } from './import-data.service';

@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.LCM_ImportData)
@Controller(Resources.LCM_ImportData)
export class ImportDatasController extends BaseController {
  constructor(private readonly importDatasService: ImportDataService) {
    super(importDatasService);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async createOne(
    @Body() data: CreateImportDataData,
    @Req() req: Request,
  ): Promise<CreateImportDataResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<FindImportDataByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req: Request,
  ): Promise<FindAllResult<ImportData>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateImportDataData,
    @Req() req: Request,
  ): Promise<UpdateImportDataResult> {
    return await super.updateOne(id, data, req);
  }

  @Put(':id/process')
  @UseGuards(AuthGuard, RolesGuard)
  async process(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<UpdateImportDataResult> {
    return await this.importDatasService.processImportData(id, req.user as DataHandler);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async deleteOne(@Param('id') id: string, @Req() req: Request) {
    return await super.deleteOne(id, req);
  }

  @EventPattern('process-import-data')
  async handleEvent(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (error) {}
    }
    await this.importDatasService.handleProcessFile(data);
    channel.ack(originalMsg);
    return 'ack';
  }
}
