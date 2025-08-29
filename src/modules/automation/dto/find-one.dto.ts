import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsObject,
  IsArray,
  IsDate,
} from 'class-validator';
import { FindOneResult } from 'src/common/modules/base/dto/find-one.dto';
import { FindManyFilter } from 'src/common/modules/base/dto/find-many.dto';
import { AutomationType, AutomationStatus, WeekDay } from '../enum/automation.enum';
import { AutomationConfig } from '../entity/automation-config.interface';

export class FindAutomationData {
  @IsEnum(AutomationType)
  @IsOptional()
  type?: AutomationType;

  @IsEnum(AutomationStatus)
  @IsOptional()
  status?: AutomationStatus;

  @IsString()
  @IsOptional()
  partnerId?: string; // Filter by partner ID in config

  @IsString()
  @IsOptional()
  staffId?: string; // Filter by assigned staff

  @IsBoolean()
  @IsOptional()
  activeOnly?: boolean; // Only active automations

  @IsString()
  @IsOptional()
  code?: string; // Search by automation code
}

export class FindManyAutomationFilter extends FindManyFilter {
  @IsEnum(AutomationType)
  @IsOptional()
  type?: AutomationType;

  @IsEnum(AutomationStatus)
  @IsOptional()
  status?: AutomationStatus;

  @IsString()
  @IsOptional()
  partnerId?: string;

  @IsString()
  @IsOptional()
  staffId?: string;

  @IsBoolean()
  @IsOptional()
  activeOnly?: boolean;

  @IsNumber()
  @IsOptional()
  priorityMin?: number;

  @IsNumber()
  @IsOptional()
  priorityMax?: number;
}

export class FindAutomationByIdResult {
  @IsString()
  id: string;

  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsEnum(AutomationType)
  type: AutomationType;

  @IsNumber()
  frequency: number;

  @IsObject()
  config: AutomationConfig;

  @IsEnum(AutomationStatus)
  status: AutomationStatus;

  @IsNumber()
  priority: number;

  @IsString()
  @IsOptional()
  notes?: string;

  // Execution tracking
  @IsDate()
  @IsOptional()
  lastExecutedAt?: Date;

  @IsDate()
  @IsOptional()
  nextExecutionAt?: Date;

  @IsNumber()
  executionCount: number;

  @IsNumber()
  successCount: number;

  @IsNumber()
  errorCount: number;

  // Business constraints
  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsArray()
  @IsOptional()
  workingDays?: WeekDay[];

  @IsNumber()
  @IsOptional()
  maxConcurrentJobs?: number;

  // Base entity fields
  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsString()
  createdBy: string;
}

export class FindManyAutomationResult {
  @IsArray()
  items: FindAutomationByIdResult[];

  @IsNumber()
  total: number;

  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;

  @IsNumber()
  totalPages: number;
}