import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AutomationService } from './automation.service';
import { BaseController } from 'src/common/modules/base/base.controller';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import { ServiceInfo, ControllerInfo } from 'src/common/decorators/service-info';
import { Services } from 'src/common/enums/services';
import { Resources } from 'src/common/enums/resources';
import { DeleteOneResult } from 'src/common/types/controller-dto';
import { CreateAutomationData, CreateAutomationResult } from './dto/create.dto';
import { UpdateAutomationData, UpdateAutomationResult, UpdateAutomationStatusData, UpdateAutomationStatusResult } from './dto/update-one.dto';
import { FindAutomationByIdResult, FindManyAutomationFilter, FindManyAutomationResult } from './dto/find-one.dto';

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
    return await this.automationService.createOne(data, req.user);
  }

  /**
   * Get automation by ID
   */
  @Get(':id')
  override async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<FindAutomationByIdResult> {
    return await this.automationService.findAutomationById(id, req.user);
  }

  /**
   * List automations with pagination and filtering
   */
  @Get()
  async findManyWithPaging(
    @Query() filter: FindManyAutomationFilter,
    @Req() req: Request,
  ): Promise<FindManyAutomationResult> {
    return await this.automationService.findManyAutomations(filter, req.user);
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
    return await this.automationService.updateAutomation(id, data, req.user);
  }

  /**
   * Delete automation
   */
  @Delete(':id')
  override async deleteOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<DeleteOneResult> {
    return await this.automationService.deleteOne(id, req.user);
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
    return await this.automationService.updateStatus(id, data.status, data.reason, req.user);
  }

  /**
   * Get automation by code
   */
  @Get('by-code/:code')
  async findByCode(
    @Param('code') code: string,
    @Req() req: Request,
  ): Promise<FindAutomationByIdResult> {
    const automation = await this.automationService.findOneByCode(code, req.user);
    if (!automation) {
      throw new Error(`Automation with code '${code}' not found`);
    }
    return this.automationService.findAutomationById(automation.id.toString(), req.user);
  }
}