import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsObject,
    IsOptional,
    IsString
} from 'class-validator';
import { FindManyFilter } from 'src/common/modules/base/dto/find-many.dto';
import { AutomationConfig } from '../entity/automation-config.interface';
import { AutomationStatus, AutomationType, WeekDay } from '../enum/automation.enum';

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
}

export class FindAutomationByIdResult {
  @IsString()
  id: string;

  @IsEnum(AutomationType)
  type: AutomationType;

  @IsNumber()
  frequency: number;

  @IsArray()
  @IsOptional()
  workingHours?: number[];

  @IsArray()
  @IsOptional()
  workingDays?: WeekDay[];

  @IsObject()
  config: AutomationConfig;

  @IsEnum(AutomationStatus)
  status: AutomationStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  // Base entity fields
  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
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