import {
    Controller,
    Get,
    Param,
    Query,
    Req,
    UseGuards
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
import { FindPerformanceByIdResult } from './dto/find-one.dto';
import { Performance } from './entity/performance.entity';
import { PerformanceService } from './performance.service';

@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.LCM_Performance)
@Controller(Resources.LCM_Performance)
export class PerformancesController extends BaseController {
  constructor(private readonly performancesService: PerformanceService) {
    super(performancesService);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<FindPerformanceByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req: Request,
  ): Promise<FindAllResult<Performance>> {
    return await super.findManyWithPaging(queries, req);
  }
}
