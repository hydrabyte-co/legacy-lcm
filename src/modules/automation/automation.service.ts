import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/modules/base/base.service';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { DeleteOneResult } from 'src/common/types/controller-dto';
import { MongoRepository } from 'typeorm';
import { CreateAutomationData, CreateAutomationResult } from './dto/create.dto';
import { FindAutomationByIdResult, FindManyAutomationFilter } from './dto/find-one.dto';
import { UpdateAutomationData, UpdateAutomationResult, UpdateAutomationStatusResult } from './dto/update-one.dto';
import { Automation } from './entity/automation.entity';
import { AutomationStatus, AutomationType } from './enum/automation.enum';

@Injectable()
export class AutomationService extends BaseService<Automation> {
  constructor(
    @InjectRepository(Automation)
    private readonly automationRepository: MongoRepository<Automation>,
  ) {
    super(automationRepository);
  }

  async createOne(data: CreateAutomationData, handler: DataHandler): Promise<CreateAutomationResult> {
    // Validate config based on type
    this.validateAutomationConfig(data.type, data.config);

    // Create automation entity
    const automation = new Automation();
    Object.assign(automation, data);
    automation.createdBy = handler;
    automation.owner = { orgId: handler.orgId, userId: handler.userId };
    automation.createdAt = new Date();
    automation.isDeleted = false;

    const result = await this.automationRepository.save(automation);

    return this.mapToCreateResult(result);
  }

  async findAutomationById(id: string, handler: DataHandler): Promise<FindAutomationByIdResult> {
    const automation = await super.findOne(id, handler);
    if (!automation) {
      throw new NotFoundException(`Automation with id ${id} not found`);
    }

    return this.mapToFindResult(automation);
  }

  async findMany(filter: FindManyAutomationFilter, handler: DataHandler): Promise<FindAllResult<Automation>> {
    // Build query conditions
    const whereConditions: any = {};

    if (filter.type) {
      whereConditions.type = filter.type;
    }

    if (filter.status) {
      whereConditions.status = filter.status;
    }

    if (filter.activeOnly) {
      whereConditions.status = AutomationStatus.Active;
    }

    // Handle partner and staff filtering in config
    if (filter.partnerId) {
      whereConditions['config.partner.id'] = filter.partnerId;
    }

    if (filter.staffId) {
      whereConditions['config.staffs.id'] = filter.staffId;
    }

    // Apply base filtering
    const modifiedFilter = { ...filter, where: whereConditions };
    return await super.findManyWithPaging(modifiedFilter, handler);
  }

  async updateAutomation(id: string, data: UpdateAutomationData, handler: DataHandler): Promise<UpdateAutomationResult> {
    const automation = await super.findOne(id, handler);
    if (!automation) {
      throw new NotFoundException(`Automation with id ${id} not found`);
    }

    // Validate config if provided
    if (data.config) {
      this.validateAutomationConfig(automation.type, data.config);
    }

    // Update automation
    Object.assign(automation, data);
    automation.changedAt = new Date();

    const result = await this.automationRepository.save(automation);

    return this.mapToUpdateResult(result);
  }

  async deleteOne(id: string, handler: DataHandler): Promise<DeleteOneResult> {
    const automation = await super.findOne(id, handler);
    if (!automation) {
      throw new NotFoundException(`Automation with id ${id} not found`);
    }

    // Don't allow deletion of active automations
    if (automation.status === AutomationStatus.Active) {
      throw new BadRequestException('Cannot delete active automation. Please pause or deactivate first.');
    }

    return await super.deleteOne(id, handler);
  }

  async updateStatus(id: string, status: AutomationStatus, reason: string | undefined, handler: DataHandler): Promise<UpdateAutomationStatusResult> {
    const automation = await super.findOne(id, handler);
    if (!automation) {
      throw new NotFoundException(`Automation with id ${id} not found`);
    }

    automation.status = status;
    automation.changedAt = new Date();

    const result = await this.automationRepository.save(automation);

    return {
      id: result.id.toString(),
      status: result.status,
      updatedAt: result.changedAt.toISOString(),
      reason,
    };
  }

  private validateAutomationConfig(type: AutomationType, config: any): void {
    // Remove type validation since entity already has type
    switch (type) {
      case AutomationType.AutoDialer:
        this.validateAutoDialerConfig(config);
        break;
      default:
        throw new BadRequestException(`Unsupported automation type: ${type}`);
    }
  }

  private validateAutoDialerConfig(config: any): void {
    const required = ['partner', 'staffs', 'phoneNumbers', 'retryAttempts', 'concurrentCallRatio'];
    
    for (const field of required) {
      if (!config[field]) {
        throw new BadRequestException(`Auto Dialer config missing required field: ${field}`);
      }
    }

    // Validate partner object
    if (!config.partner || !config.partner.id) {
      throw new BadRequestException('Auto Dialer config must have a valid partner');
    }

    // Validate staffs array
    if (!Array.isArray(config.staffs) || config.staffs.length === 0) {
      throw new BadRequestException('Auto Dialer config must have at least one staff member');
    }

    // Validate phone numbers array
    if (!Array.isArray(config.phoneNumbers) || config.phoneNumbers.length === 0) {
      throw new BadRequestException('Auto Dialer config must have at least one phone number');
    }

    // Validate concurrent call ratio
    if (config.concurrentCallRatio < 0.5 || config.concurrentCallRatio > 2.0) {
      throw new BadRequestException('Concurrent call ratio must be between 0.5 and 2.0');
    }

    // Validate retry attempts
    if (config.retryAttempts < 1 || config.retryAttempts > 10) {
      throw new BadRequestException('Retry attempts must be between 1 and 10');
    }
  }

  private mapToCreateResult(automation: Automation): CreateAutomationResult {
    return {
      id: automation.id.toString(),
      type: automation.type,
      frequency: automation.frequency,
      workingHours: automation.workingHours,
      workingDays: automation.workingDays,
      config: automation.config,
      status: automation.status,
      notes: automation.notes,
      createdAt: automation.createdAt.toISOString(),
      updatedAt: automation.changedAt.toISOString(),
    };
  }

  private mapToUpdateResult(automation: Automation): UpdateAutomationResult {
    return {
      id: automation.id.toString(),
      changedAt: automation.changedAt,
      type: automation.type,
      frequency: automation.frequency,
      workingHours: automation.workingHours,
      workingDays: automation.workingDays,
      config: automation.config,
      status: automation.status,
      notes: automation.notes,
    };
  }

  private mapToFindResult(automation: Automation): FindAutomationByIdResult {
    return {
      id: automation.id.toString(),
      type: automation.type,
      frequency: automation.frequency,
      workingHours: automation.workingHours,
      workingDays: automation.workingDays,
      config: automation.config,
      status: automation.status,
      notes: automation.notes,
      createdAt: automation.createdAt.toISOString(),
      updatedAt: automation.changedAt.toISOString(),
    };
  }
}