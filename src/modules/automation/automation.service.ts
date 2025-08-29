import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Automation } from './entity/automation.entity';
import { BaseService } from 'src/common/modules/base/base.service';
import { DataHandler } from 'src/common/modules/base/entity/data.class';
import { CreateAutomationData, CreateAutomationResult } from './dto/create.dto';
import { UpdateAutomationData, UpdateAutomationResult, UpdateAutomationStatusData, UpdateAutomationStatusResult } from './dto/update-one.dto';
import { FindAutomationByIdResult, FindManyAutomationFilter, FindManyAutomationResult } from './dto/find-one.dto';
import { AutomationType, AutomationStatus } from './enum/automation.enum';
import { DeleteOneResult } from 'src/common/types/controller-dto';
import { FindAllResult } from 'src/common/modules/base/dto/find-many.dto';

@Injectable()
export class AutomationService extends BaseService<Automation> {
  constructor(
    @InjectRepository(Automation)
    private readonly automationRepository: MongoRepository<Automation>,
  ) {
    super(automationRepository);
  }

  async createOne(data: CreateAutomationData, handler: DataHandler): Promise<CreateAutomationResult> {
    // Validate automation code is unique
    const existingAutomation = await this.findOneByCode(data.code, handler);
    if (existingAutomation) {
      throw new BadRequestException(`Automation with code '${data.code}' already exists`);
    }

    // Validate config based on type
    this.validateAutomationConfig(data.type, data.config);

    // Calculate next execution time
    const nextExecutionAt = this.calculateNextExecution(data.frequency, data.startTime, data.workingDays);

    // Create automation entity
    const automation = new Automation();
    Object.assign(automation, data);
    automation.nextExecutionAt = nextExecutionAt;
    automation.createdBy = handler;
    automation.createdAt = new Date();
    automation.isDeleted = false;

    const result = await this.automationRepository.save(automation);

    return {
      id: result.id.toString(),
      code: result.code,
      name: result.name,
      type: result.type,
      status: result.status,
      createdAt: result.createdAt.toISOString(),
    };
  }

  async findAutomationById(id: string, handler: DataHandler): Promise<FindAutomationByIdResult> {
    const automation = await super.findOne(id, handler);
    if (!automation) {
      throw new NotFoundException(`Automation with id ${id} not found`);
    }

    return this.mapToFindResult(automation);
  }

  async findManyAutomations(filter: FindManyAutomationFilter, handler: DataHandler): Promise<FindManyAutomationResult> {
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

    if (filter.priorityMin !== undefined) {
      whereConditions.priority = { $gte: filter.priorityMin };
    }

    if (filter.priorityMax !== undefined) {
      if (whereConditions.priority) {
        whereConditions.priority = { ...whereConditions.priority, $lte: filter.priorityMax };
      } else {
        whereConditions.priority = { $lte: filter.priorityMax };
      }
    }

    // Handle partner and staff filtering in config
    if (filter.partnerId) {
      whereConditions['config.partners.id'] = filter.partnerId;
    }

    if (filter.staffId) {
      whereConditions['config.staffAssignment.staffs.id'] = filter.staffId;
    }

    // Apply base filtering
    const modifiedFilter = { ...filter, where: whereConditions };
    const result: FindAllResult<Automation> = await super.findManyWithPaging(modifiedFilter, handler);

    return {
      items: result.data.map(item => this.mapToFindResult(item)),
      total: result.paging.totalItems,
      page: result.paging.index,
      limit: result.paging.size,
      totalPages: result.paging.totalPages,
    };
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

    // Recalculate next execution if frequency or schedule changed
    if (data.frequency || data.startTime || data.workingDays) {
      const frequency = data.frequency || automation.frequency;
      const startTime = data.startTime !== undefined ? data.startTime : automation.startTime;
      const workingDays = data.workingDays !== undefined ? data.workingDays : automation.workingDays;
      
      automation.nextExecutionAt = this.calculateNextExecution(frequency, startTime, workingDays);
    }

    // Update automation
    Object.assign(automation, data);
    automation.changedAt = new Date();

    const result = await this.automationRepository.save(automation);

    return {
      id: result.id.toString(),
      changedAt: result.changedAt,
      code: result.code,
      name: result.name,
      type: result.type,
      status: result.status,
    };
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

    // Reset next execution time for active automations
    if (status === AutomationStatus.Active) {
      automation.nextExecutionAt = this.calculateNextExecution(
        automation.frequency,
        automation.startTime,
        automation.workingDays
      );
    }

    const result = await this.automationRepository.save(automation);

    return {
      id: result.id.toString(),
      status: result.status,
      updatedAt: result.changedAt.toISOString(),
      reason,
    };
  }

  async findOneByCode(code: string, handler: DataHandler): Promise<Automation | null> {
    return super.findOneByField('code', code, handler);
  }

  private validateAutomationConfig(type: AutomationType, config: any): void {
    if (!config || config.type !== type) {
      throw new BadRequestException(`Config type '${config?.type}' does not match automation type '${type}'`);
    }

    switch (type) {
      case AutomationType.AutoDialer:
        this.validateAutoDialerConfig(config);
        break;
      default:
        throw new BadRequestException(`Unsupported automation type: ${type}`);
    }
  }

  private validateAutoDialerConfig(config: any): void {
    const required = ['partners', 'staffAssignment', 'phoneSystem', 'callRules', 'callHandling'];
    
    for (const field of required) {
      if (!config[field]) {
        throw new BadRequestException(`Auto Dialer config missing required field: ${field}`);
      }
    }

    // Validate partners array
    if (!Array.isArray(config.partners) || config.partners.length === 0) {
      throw new BadRequestException('Auto Dialer config must have at least one partner');
    }

    // Validate staffs array
    if (!config.staffAssignment.staffs || !Array.isArray(config.staffAssignment.staffs) || config.staffAssignment.staffs.length === 0) {
      throw new BadRequestException('Auto Dialer config must have at least one staff member');
    }

    // Validate phone numbers
    if (!config.phoneSystem.phoneNumbers || !Array.isArray(config.phoneSystem.phoneNumbers) || config.phoneSystem.phoneNumbers.length === 0) {
      throw new BadRequestException('Auto Dialer config must have at least one phone number');
    }

    // Validate concurrent call ratio
    if (config.callRules.concurrentCallRatio < 0.1 || config.callRules.concurrentCallRatio > 5.0) {
      throw new BadRequestException('Concurrent call ratio must be between 0.1 and 5.0');
    }
  }

  private calculateNextExecution(frequency: number, startTime?: string, workingDays?: string[]): Date {
    const now = new Date();
    const next = new Date(now.getTime() + frequency * 1000);

    // If no constraints, return next execution time
    if (!startTime && !workingDays) {
      return next;
    }

    // TODO: Implement business hours and working days logic
    // For now, just return the simple frequency-based time
    return next;
  }

  private mapToFindResult(automation: Automation): FindAutomationByIdResult {
    return {
      id: automation.id.toString(),
      code: automation.code,
      name: automation.name,
      type: automation.type,
      frequency: automation.frequency,
      config: automation.config,
      status: automation.status,
      priority: automation.priority,
      notes: automation.notes,
      lastExecutedAt: automation.lastExecutedAt,
      nextExecutionAt: automation.nextExecutionAt,
      executionCount: automation.executionCount,
      successCount: automation.successCount,
      errorCount: automation.errorCount,
      startTime: automation.startTime,
      endTime: automation.endTime,
      workingDays: automation.workingDays,
      maxConcurrentJobs: automation.maxConcurrentJobs,
      createdAt: automation.createdAt.toISOString(),
      updatedAt: automation.changedAt.toISOString(),
      createdBy: JSON.stringify(automation.createdBy),
    };
  }
}