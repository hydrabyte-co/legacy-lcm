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
import { DataFileService } from './data-file.service';
import { CreateDataFileData, CreateDataFileResult } from './dto/create.dto';
import { UpdateDataFileData, UpdateDataFileResult } from './dto/update-one.dto';
import { FindDataFileByIdResult } from './dto/find-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';
import { DataFile } from './entity/data-file.entity';
import { DataHandler } from 'src/common/modules/base/entity/data.class';

@ServiceInfo(Services.Template)
@ControllerInfo(Controllers.LCM_DataFiles)
@Controller(Controllers.LCM_DataFiles)
export class DataFilesController extends BaseController {
  constructor(private readonly dataFilesService: DataFileService) {
    super(dataFilesService);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createOne(
    @Body() data: CreateDataFileData,
    @Req() req,
  ): Promise<CreateDataFileResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(
    @Param('id') id: string,
    @Req() req,
  ): Promise<FindDataFileByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req,
  ): Promise<FindAllResult<DataFile>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateDataFileData,
    @Req() req,
  ): Promise<UpdateDataFileResult> {
    return await super.updateOne(id, data, req);
  }

  @Put(':id/read')
  @UseGuards(AuthGuard, RolesGuard)
  async read(
    @Param('id') id: string,
    @Req() req,
  ): Promise<UpdateDataFileResult> {
    const handler = req.user || new DataHandler();
    return await this.dataFilesService.readDataFile(id, handler);
  }

  @Put(':id/process')
  @UseGuards(AuthGuard, RolesGuard)
  async process(
    @Param('id') id: string,
    @Req() req,
  ): Promise<UpdateDataFileResult> {
    const handler = req.user || new DataHandler();
    return await this.dataFilesService.processDataFile(id, handler);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async deleteOne(@Param('id') id: string, @Req() req) {
    return await super.deleteOne(id, req);
  }
}
