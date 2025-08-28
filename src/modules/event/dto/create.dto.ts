import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { EventType, EventPriority, EventStatus } from '../enum/event.enum';

export class CreateEventData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name = '';

  @IsString()
  @MaxLength(255)
  description = '';

  @IsEnum(EventType)
  type = EventType.System;

  @IsEnum(EventPriority)
  priority = EventPriority.Medium;

  @IsString()
  @MaxLength(24)
  partnerCode = '';

  @IsString()
  @MaxLength(24)
  customerCode = '';

  @IsString()
  @MaxLength(24)
  staffCode = '';

  @IsString()
  @MaxLength(24)
  moduleCode = '';

  @IsString()
  @MaxLength(50)
  action = '';

  @IsString()
  details = '';

  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @IsString()
  @MaxLength(500)
  notes = '';
}

@Exclude()
export class CreateEventResult extends BaseCreateResult {
  @Expose()
  name = '';

  @Expose()
  description = '';

  @Expose()
  type = '';

  @Expose()
  priority = '';

  @Expose()
  status = EventStatus.Pending;

  @Expose()
  partnerCode = '';

  @Expose()
  customerCode = '';

  @Expose()
  staffCode = '';

  @Expose()
  moduleCode = '';

  @Expose()
  action = '';

  @Expose()
  details = '';

  @Expose()
  scheduledDate = new Date();

  @Expose()
  processedDate = new Date();

  @Expose()
  notes = '';
}