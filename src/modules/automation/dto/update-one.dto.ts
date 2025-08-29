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
import { UpdateData } from 'src/common/modules/base/dto/update-one.dto';
import { UpdateOneResult } from 'src/common/modules/base/dto/update-one.dto';
import { AutomationType, AutomationStatus, WeekDay } from '../enum/automation.enum';
import { AutomationConfig } from '../entity/automation-config.interface';

export class UpdateAutomationData extends UpdateData {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @IsNumber()
  @Min(60)
  @Max(86400)
  @IsOptional()
  frequency?: number;

  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  @IsOptional()
  config?: AutomationConfig;

  @IsEnum(AutomationStatus)
  @IsOptional()
  status?: AutomationStatus;

  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  priority?: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
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

export class UpdateAutomationResult extends UpdateOneResult {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsEnum(AutomationType)
  type: AutomationType;

  @IsEnum(AutomationStatus)
  status: AutomationStatus;
}

export class UpdateAutomationStatusData {
  @IsEnum(AutomationStatus)
  @IsNotEmpty()
  status: AutomationStatus;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  reason?: string;
}

export class UpdateAutomationStatusResult {
  @IsString()
  id: string;

  @IsEnum(AutomationStatus)
  status: AutomationStatus;

  @IsString()
  updatedAt: string;

  @IsString()
  @IsOptional()
  reason?: string;
}