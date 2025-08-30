import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ControllerInfo, ServiceInfo } from '../../common/decorators/service-info';
import { Resources } from '../../common/enums/resources';
import { Services } from '../../common/enums/services';
import { RolesGuard } from '../../common/guards/auth/roles.guard';
import { BaseController } from '../../common/modules/base/base.controller';
import { FindAllResult } from '../../common/modules/base/dto/find-many.dto';
import { DataHandler } from '../../common/modules/base/entity/data.class';
import { DeleteOneResult } from '../../common/types/controller-dto';
import { AutomationService } from './automation.service';
import { CreateAutomationData } from './dto/create.dto';
import { UpdateAutomationData, UpdateAutomationResult } from './dto/update-one.dto';
import { Automation } from './entity/automation.entity';

@Controller('automations')
@UseGuards(AuthGuard, RolesGuard)
@ServiceInfo(Services.LCM)
@ControllerInfo(Resources.LCM_Automations)
export class AutomationController extends BaseController {
  constructor(private readonly automationService: AutomationService) {
    super(automationService);
  }

  /**
   * Create new automation
   */
  @Post()
  override async createOne(
    @Body() data: CreateAutomationData,
    @Req() req: Request,
  ): Promise<Automation> {
    return await this.automationService.createOne(data, req.user as DataHandler);
  }

  /**
   * Get automation by ID
   */
  @Get(':id')
  override async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Automation> {
    return await this.automationService.findOne(id, req.user as DataHandler);
  }

  /**
   * List automations with pagination and filtering
   */
  @Get()
  async findManyWithPaging(
    @Query() queries: string,
    @Req() req: Request,
  ): Promise<FindAllResult<Automation>> {
    return await super.findManyWithPaging(queries, req.user as DataHandler);
  }

  /**
   * Update automation
   */
  @Put(':id')
  override async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateAutomationData,
    @Req() req: Request,
  ): Promise<UpdateAutomationResult> {
    return await super.updateOne(id, data, req.user as DataHandler);
  }

  /**
   * Delete automation
   */
  @Delete(':id')
  override async deleteOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<DeleteOneResult> {
    return await super.deleteOne(id, req.user as DataHandler);
  }

  /**
   * Update automation status (start/stop/pause)
   */
  /* @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() data: UpdateAutomationStatusData,
    @Req() req: Request,
  ): Promise<UpdateAutomationStatusResult> {
    return await super.updatePartial(id, data, req.user as DataHandler);
  } */
}
