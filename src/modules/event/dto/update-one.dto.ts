import { IsOptional, IsString, MaxLength, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { UpdateData as BaseUpdateData } from '../../../common/modules/base/dto/update-one.dto';
import { EventType, EventPriority, EventStatus } from '../enum/event.enum';

export class UpdateEventData extends BaseUpdateData {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @IsOptional()
  @IsEnum(EventPriority)
  priority?: EventPriority;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  partnerCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  customerCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  staffCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  moduleCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  action?: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @IsOptional()
  @IsDateString()
  processedDate?: string;

  @IsOptional()
  @IsNumber()
  executionTime?: number;

  @IsOptional()
  @IsString()
  result?: string;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsOptional()
  @IsNumber()
  retryCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}