import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsObject,
  IsOptional,
  IsArray,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateData } from 'src/common/modules/base/dto/create.dto';
import { AutomationType, AutomationStatus, WeekDay } from '../enum/automation.enum';
import { AutomationConfig } from '../entity/automation-config.interface';

export class CreateAutomationData extends CreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsEnum(AutomationType)
  @IsNotEmpty()
  type: AutomationType;

  @IsNumber()
  @Min(60) // Minimum 1 minute
  @Max(86400) // Maximum 24 hours
  frequency: number;

  @IsObject()
  @ValidateNested()
  @Type(() => Object) // Will be validated based on type
  config: AutomationConfig;

  @IsEnum(AutomationStatus)
  @IsOptional()
  status?: AutomationStatus = AutomationStatus.Inactive;

  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  priority?: number = 5;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/) // HH:MM format
  startTime?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  endTime?: string;

  @IsArray()
  @IsOptional()
  @IsEnum(WeekDay, { each: true })
  workingDays?: WeekDay[];

  @IsNumber()
  @Min(1)
  @Max(50)
  @IsOptional()
  maxConcurrentJobs?: number;
}

export class CreateAutomationResult {
  @IsString()
  id: string;

  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsEnum(AutomationType)
  type: AutomationType;

  @IsEnum(AutomationStatus)
  status: AutomationStatus;

  @IsString()
  createdAt: string;
}