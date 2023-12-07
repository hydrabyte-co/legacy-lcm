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
import { ImportDataService } from './import-data.service';
import { CreateImportDataData, CreateImportDataResult } from './dto/create.dto';
import {
  UpdateImportDataData,
  UpdateImportDataResult,
} from './dto/update-one.dto';
import { FindImportDataByIdResult } from './dto/find-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';
import { ImportData } from './entity/import-data.entity';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { EventPattern, Ctx, Payload, RmqContext } from '@nestjs/microservices';

@ServiceInfo(Services.LCM)
@ControllerInfo(Controllers.LCM_ImportData)
@Controller(Controllers.LCM_ImportData)
export class ImportDatasController extends BaseController {
  constructor(private readonly importDatasService: ImportDataService) {
    super(importDatasService);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createOne(
    @Body() data: CreateImportDataData,
    @Req() req,
  ): Promise<CreateImportDataResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(
    @Param('id') id: string,
    @Req() req,
  ): Promise<FindImportDataByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req,
  ): Promise<FindAllResult<ImportData>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateImportDataData,
    @Req() req,
  ): Promise<UpdateImportDataResult> {
    return await super.updateOne(id, data, req);
  }

  @Put(':id/process')
  @UseGuards(AuthGuard, RolesGuard)
  async process(
    @Param('id') id: string,
    @Req() req,
  ): Promise<UpdateImportDataResult> {
    const handler = req.user || new DataHandler();
    return await this.importDatasService.processImportData(id, handler);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async deleteOne(@Param('id') id: string, @Req() req) {
    return await super.deleteOne(id, req);
  }

  @EventPattern('process-import-data')
  async handleEvent(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    await this.importDatasService.handleProcessFile(data);
    channel.ack(originalMsg);
    return 'ack';
  }
}
