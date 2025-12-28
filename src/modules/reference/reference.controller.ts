import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
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
import { CreateReferenceData, CreateReferenceResult } from './dto/create.dto';
import { FindReferenceByIdResult } from './dto/find-one.dto';
import {
    UpdateReferenceData,
    UpdateReferenceResult,
} from './dto/update-one.dto';
import { Reference } from './entity/reference.entity';
import { ReferenceService } from './reference.service';

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
