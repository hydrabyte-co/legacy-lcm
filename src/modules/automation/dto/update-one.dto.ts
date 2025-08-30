import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { UpdateData, UpdateOneResult } from '../../../common/modules/base/dto/update-one.dto';
import { AutomationConfig } from '../entity/automation-config.interface';
import { AutomationStatus, AutomationType, WeekDay } from '../enum/automation.enum';

export class UpdateAutomationData extends UpdateData {
  @IsNumber()
  @Min(30)
  @Max(1800)
  @IsOptional()
  frequency?: number;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(24)
  workingHours?: number[];

  @IsArray()
  @IsOptional()
  @IsEnum(WeekDay, { each: true })
  workingDays?: WeekDay[];

  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  @IsOptional()
  config?: AutomationConfig;

  @IsEnum(AutomationStatus)
  @IsOptional()
  status?: AutomationStatus;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}

export class UpdateAutomationResult extends UpdateOneResult {
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