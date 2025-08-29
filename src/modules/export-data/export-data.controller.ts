import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Request } from 'express';
import {
  ControllerInfo,
  ServiceInfo,
} from 'src/common/decorators/service-info';
import { Resources } from 'src/common/enums/resources';
import { Services } from 'src/common/enums/services';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { CreateExportDataData, CreateExportDataResult } from './dto/create.dto';
import { FindExportDataByIdResult } from './dto/find-one.dto';
import { ExportData } from './entity/export-data.entity';
import { ExportDataService } from './export-data.service';

@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.LCM_ExportData)
@Controller(Resources.LCM_ExportData)
export class ExportDatasController extends BaseController {
  constructor(private readonly exportDatasService: ExportDataService) {
    super(exportDatasService);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async createOne(
    @Body() data: CreateExportDataData,
    @Req() req: Request,
  ): Promise<CreateExportDataResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<FindExportDataByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req: Request,
  ): Promise<FindAllResult<ExportData>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Put(':id/process')
  @UseGuards(AuthGuard, RolesGuard)
  async requestProcess(@Param('id') id: string, @Req() req: Request): Promise<any> {
    return await this.exportDatasService.requestProcess(id, req.user as DataHandler);
  }

  @EventPattern('process-export-data')
  async handleEvent(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (error) {}
    }
    await this.exportDatasService.handleProcessExportData(data);
    channel.ack(originalMsg);
    return 'ack';
  }
}
