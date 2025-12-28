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
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ControllerInfo, ServiceInfo } from '../../common/decorators/service-info';
import { Resources } from '../../common/enums/resources';
import { Services } from '../../common/enums/services';
import { RolesGuard } from '../../common/guards/auth/roles.guard';
import { BaseController } from '../../common/modules/base/base.controller';
import { FindAllResult } from '../../common/modules/base/dto/find-many.dto';
import { DeleteOneResult } from '../../common/types/controller-dto';
import { CreateTaskData } from './dto/create.dto';
import { UpdateTaskData } from './dto/update-one.dto';
import { Task } from './entity/task.entity';
import { TaskService } from './task.service';

@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.LCM_Task)
@Controller(Resources.LCM_Task)
export class TaskController extends BaseController {
  constructor(private readonly UpdatesService: TaskService) {
    super(UpdatesService);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async createOne(@Body() data: CreateTaskData, @Req() req: Request): Promise<Task> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async findOne(@Param('id') id: string, @Req() req: Request): Promise<Task> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req: Request,
  ): Promise<FindAllResult<Task>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateTaskData,
    @Req() req: Request,
  ): Promise<Task> {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async deleteOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<DeleteOneResult> {
    return await super.deleteOne(id, req);
  }
}
