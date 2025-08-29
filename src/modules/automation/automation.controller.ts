import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ControllerInfo, ServiceInfo } from 'src/common/decorators/service-info';
import { Resources } from 'src/common/enums/resources';
import { Services } from 'src/common/enums/services';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import { BaseController } from 'src/common/modules/base/base.controller';
import { DeleteOneResult } from 'src/common/types/controller-dto';
import { DataHandler } from '../../common/modules/base/entity/data.class';
import { AutomationService } from './automation.service';
import { CreateAutomationData, CreateAutomationResult } from './dto/create.dto';
import { FindAutomationByIdResult, FindManyAutomationFilter, FindManyAutomationResult } from './dto/find-one.dto';
import { UpdateAutomationData, UpdateAutomationResult, UpdateAutomationStatusData, UpdateAutomationStatusResult } from './dto/update-one.dto';

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
  ): Promise<CreateAutomationResult> {
    return await this.automationService.createOne(data, req.user as DataHandler);
  }

  /**
   * Get automation by ID
   */
  @Get(':id')
  override async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<FindAutomationByIdResult> {
    return await this.automationService.findAutomationById(id, req.user as DataHandler);
  }

  /**
   * List automations with pagination and filtering
   */
  @Get()
  async findManyWithPaging(
    @Query() filter: FindManyAutomationFilter,
    @Req() req: Request,
  ): Promise<FindManyAutomationResult> {
    return await this.automationService.findManyAutomations(filter, req.user as DataHandler);
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
    return await this.automationService.updateAutomation(id, data, req.user as DataHandler);
  }

  /**
   * Delete automation
   */
  @Delete(':id')
  override async deleteOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<DeleteOneResult> {
    return await this.automationService.deleteOne(id, req.user as DataHandler);
  }

  /**
   * Update automation status (start/stop/pause)
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() data: UpdateAutomationStatusData,
    @Req() req: Request,
  ): Promise<UpdateAutomationStatusResult> {
    return await this.automationService.updateStatus(id, data.status, data.reason, req.user as DataHandler);
  }

  /**
   * Get automation by code
   */
  @Get('by-code/:code')
  async findByCode(
    @Param('code') code: string,
    @Req() req: Request,
  ): Promise<FindAutomationByIdResult> {
    const automation = await this.automationService.findOneByCode(code, req.user as DataHandler);
    if (!automation) {
      throw new Error(`Automation with code '${code}' not found`);
    }
    return this.automationService.findAutomationById(automation.id.toString(), req.user as DataHandler);
  }
}
