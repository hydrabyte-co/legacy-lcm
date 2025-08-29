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
import { TaskService } from './task.service';
import { CreateTaskData } from './dto/create.dto';
import { UpdateTaskData } from './dto/update-one.dto';
import { BaseController } from 'src/common/modules/base/base.controller';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { Services } from 'src/common/enums/services';
import { Resources } from 'src/common/enums/resources';
import { Task } from './entity/task.entity';
import { DeleteOneResult } from 'src/common/types/controller-dto';
import { Request } from 'express';

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
