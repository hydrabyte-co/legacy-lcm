import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  Matches,
  IsObject,
} from 'class-validator';
import { CommonStatuses } from 'src/common/enums/properties';
import { UpdateOneData } from 'src/common/modules/base/dto/update-one.dto';
import { CreateData } from '../base/dto/create.dto';
import { ScheduledTaskStatuses as ScheduledTaskStatuses } from './scheduled-task.misc';

export class CreateScheduledTaskData extends CreateData {
  @IsString()
  @IsNotEmpty()
  type = '';

  @IsString()
  @IsNotEmpty()
  schedule = '';

  @IsObject()
  @IsNotEmpty()
  parameters = {};

  @IsString()
  @IsOptional()
  note = '';

  @IsEnum(ScheduledTaskStatuses)
  status: ScheduledTaskStatuses = ScheduledTaskStatuses.Stopped;
}

export class UpdateScheduledTaskData extends UpdateOneData {
  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  schedule?: string;

  @IsObject()
  @IsOptional()
  parameters?: any;

  @IsString()
  @IsOptional()
  note?: string;

  @IsEnum(ScheduledTaskStatuses)
  @IsOptional()
  status?: ScheduledTaskStatuses;
}
