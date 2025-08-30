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
import { CreateStaffData, CreateStaffResult } from './dto/create.dto';
import { FindStaffByIdResult } from './dto/find-one.dto';
import { UpdateStaffData, UpdateStaffResult } from './dto/update-one.dto';
import { Staff } from './entity/staff.entity';
import { StaffService } from './staff.service';

@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.LCM_Staff)
@Controller(Resources.LCM_Staff)
export class StaffsController extends BaseController {
  constructor(private readonly staffsService: StaffService) {
    super(staffsService);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async createOne(
    @Body() data: CreateStaffData,
    @Req() req: Request,
  ): Promise<CreateStaffResult> {
    return await super.createOne(data, req);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<FindStaffByIdResult> {
    return await super.findOne(id, req);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req: Request,
  ): Promise<FindAllResult<Staff>> {
    return await super.findManyWithPaging(queries, req);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  override async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateStaffData,
    @Req() req: Request,
  ): Promise<UpdateStaffResult> {
    return await super.updateOne(id, data, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  override async deleteOne(@Param('id') id: string, @Req() req: Request) {
    return await super.deleteOne(id, req);
  }
}
