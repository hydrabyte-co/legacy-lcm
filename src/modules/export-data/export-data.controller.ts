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
import { ExportDataService } from './export-data.service';
import { CreateExportDataData, CreateExportDataResult } from './dto/create.dto';
import {
  UpdateExportDataData,
  UpdateExportDataResult,
} from './dto/update-one.dto';
import { FindExportDataByIdResult } from './dto/find-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';
import { ExportData } from './entity/export-data.entity';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { EventPattern } from '@nestjs/microservices';

@ServiceInfo(Services.LCM)
@ControllerInfo(Controllers.LCM_ExportData)
@Controller(Controllers.LCM_ExportData)
export class ExportDatasController extends BaseController {
  constructor(private readonly exportDatasService: ExportDataService) {
    super(exportDatasService);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createOne(
    @Body() data: CreateExportDataData,
    @Req() req,
  ): Promise<CreateExportDataResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(
    @Param('id') id: string,
    @Req() req,
  ): Promise<FindExportDataByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req,
  ): Promise<FindAllResult<ExportData>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateExportDataData,
    @Req() req,
  ): Promise<UpdateExportDataResult> {
    return await super.updateOne(id, data, req);
  }

  @Put(':id/process')
  @UseGuards(AuthGuard, RolesGuard)
  async process(
    @Param('id') id: string,
    @Req() req,
  ): Promise<UpdateExportDataResult> {
    const handler = req.user || new DataHandler();
    return await this.exportDatasService.processExportData(id, handler);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async deleteOne(@Param('id') id: string, @Req() req) {
    return await super.deleteOne(id, req);
  }

  @EventPattern('process')
  async handleEvent(dataString: Record<string, unknown>) {
    const data = JSON.parse(dataString.toString());
    await this.exportDatasService.handleProcessFile(data);
    return 'ack';
  }
}
