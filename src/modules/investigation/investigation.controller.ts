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
import {
    CreateInvestigationData,
    CreateInvestigationResult,
} from './dto/create.dto';
import { FindInvestigationByIdResult } from './dto/find-one.dto';
import {
    UpdateInvestigationData,
    UpdateInvestigationResult,
} from './dto/update-one.dto';
import { Investigation } from './entity/investigation.entity';
import { InvestigationService } from './investigation.service';

@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.LCM_Investigations)
@Controller(Resources.LCM_Investigations)
export class InvestigationsController extends BaseController {
  constructor(private readonly investigationsService: InvestigationService) {
    super(investigationsService);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async createOne(
    @Body() data: CreateInvestigationData,
    @Req() req: Request,
  ): Promise<CreateInvestigationResult> {
    data.date = new Date(data.date);
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<FindInvestigationByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req: Request,
  ): Promise<FindAllResult<Investigation>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateInvestigationData,
    @Req() req: Request,
  ): Promise<UpdateInvestigationResult> {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async deleteOne(@Param('id') id: string, @Req() req: Request) {
    return await super.deleteOne(id, req);
  }
}
