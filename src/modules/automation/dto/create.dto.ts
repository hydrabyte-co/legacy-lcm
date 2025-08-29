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
import { CreateData } from 'src/common/modules/base/dto/create.dto';
import { AutomationConfig } from '../entity/automation-config.interface';
import { AutomationStatus, AutomationType, WeekDay } from '../enum/automation.enum';

export class CreateAutomationData extends CreateData {
  @IsEnum(AutomationType)
  @IsNotEmpty()
  type: AutomationType;

  @IsNumber()
  @Min(30) // Minimum 30 seconds
  @Max(1800) // Maximum 30 minutes
  frequency: number;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(24)
  workingHours?: number[]; // 0-23 representing hours of the day

  @IsArray()
  @IsOptional()
  @IsEnum(WeekDay, { each: true })
  workingDays?: WeekDay[];

  @IsObject()
  @ValidateNested()
  @Type(() => Object) // Will be validated based on type
  config: AutomationConfig;

  @IsEnum(AutomationStatus)
  @IsOptional()
  status?: AutomationStatus = AutomationStatus.Inactive;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}

export class CreateAutomationResult {
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

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}