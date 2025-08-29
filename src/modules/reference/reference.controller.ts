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
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import {
  ServiceInfo,
  ControllerInfo,
} from 'src/common/decorators/service-info';
import { ReferenceService } from './reference.service';
import { CreateReferenceData, CreateReferenceResult } from './dto/create.dto';
import {
  UpdateReferenceData,
  UpdateReferenceResult,
} from './dto/update-one.dto';
import { FindReferenceByIdResult } from './dto/find-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Resources } from 'src/common/enums/resources';
import { Reference } from './entity/reference.entity';
import { Request } from 'express';

@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.LCM_References)
@Controller(Resources.LCM_References)
export class ReferencesController extends BaseController {
  constructor(private readonly referencesService: ReferenceService) {
    super(referencesService);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async createOne(
    @Body() data: CreateReferenceData,
    @Req() req: Request,
  ): Promise<CreateReferenceResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<FindReferenceByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req: Request,
  ): Promise<FindAllResult<Reference>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateReferenceData,
    @Req() req: Request,
  ): Promise<UpdateReferenceResult> {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async deleteOne(@Param('id') id: string, @Req() req: Request) {
    return await super.deleteOne(id, req);
  }
}
