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
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ControllerInfo, ServiceInfo } from '../../common/decorators/service-info';
import { Resources } from '../../common/enums/resources';
import { Services } from '../../common/enums/services';
import { RolesGuard } from '../../common/guards/auth/roles.guard';
import { BaseController } from '../../common/modules/base/base.controller';
import { FindAllResult } from '../../common/modules/base/dto/find-many.dto';
import { ActivityService } from './activity.service';
import { CreateActivityData, CreateActivityResult } from './dto/create.dto';
import { FindActivityByIdActivity } from './dto/find-one.dto';
import { UpdateActivityData, UpdateActivityResult } from './dto/update-one.dto';
import { Activity } from './entity/activity.entity';

@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.LCM_Activities)
@Controller(Resources.LCM_Activities)
export class ActivitiesController extends BaseController {
  constructor(private readonly activitiesService: ActivityService) {
    super(activitiesService);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async createOne(
    @Body() data: CreateActivityData,
    @Req() req: Request,
  ): Promise<CreateActivityResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<FindActivityByIdActivity> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req: Request,
  ): Promise<FindAllResult<Activity>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateActivityData,
    @Req() req: Request,
  ): Promise<UpdateActivityResult> {
    if (data.ptpDate) {
      data.ptpDate = new Date(data.ptpDate);
    }
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async deleteOne(@Param('id') id: string, @Req() req: Request) {
    return await super.deleteOne(id, req);
  }
}
