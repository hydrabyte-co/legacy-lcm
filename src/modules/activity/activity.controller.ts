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
import { ActivityService } from './activity.service';
import { CreateActivityData, CreateActivityResult } from './dto/create.dto';
import { UpdateActivityData, UpdateActivityResult } from './dto/update-one.dto';
import { FindActivityByIdActivity } from './dto/find-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Controllers } from 'src/common/enums/controllers';
import { Activity } from './entity/activity.entity';

@ServiceInfo(Services.Template)
@ControllerInfo(Controllers.LCM_Activities)
@Controller(Controllers.LCM_Activities)
export class ActivitiesController extends BaseController {
  constructor(private readonly activitiesService: ActivityService) {
    super(activitiesService);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createOne(
    @Body() data: CreateActivityData,
    @Req() req,
  ): Promise<CreateActivityResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(
    @Param('id') id: string,
    @Req() req,
  ): Promise<FindActivityByIdActivity> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req,
  ): Promise<FindAllResult<Activity>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateActivityData,
    @Req() req,
  ): Promise<UpdateActivityResult> {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async deleteOne(@Param('id') id: string, @Req() req) {
    return await super.deleteOne(id, req);
  }
}
