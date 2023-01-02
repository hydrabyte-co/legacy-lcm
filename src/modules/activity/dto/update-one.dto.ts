import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsDate,
  IsNumber,
  IsEnum,
} from 'class-validator';
import {
  UpdateOneData,
  UpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';
import { ActivityType } from '../enum/activity.enum';
import { Optional } from '@nestjs/common';

export class UpdateActivityData extends UpdateOneData {
  @Optional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  staffCode;

  @Optional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  contractCode;

  @Optional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  customerCode;

  @Optional()
  @IsEnum(ActivityType)
  @IsNotEmpty()
  type;

  @Optional()
  @IsString()
  @MaxLength(24)
  referenceId;

  @Optional()
  @IsString()
  @MaxLength(24)
  resultCode;

  @Optional()
  @IsString()
  @MaxLength(24)
  resultParentCode;

  @Optional()
  @IsString()
  @IsNotEmpty()
  note;
}
export class UpdateActivityResult extends UpdateOneResult {
  @Expose()
  staffCode = '';

  @Expose()
  contractCode = '';

  @Expose()
  customerCode = '';

  @Expose()
  type = ActivityType.Call;

  @Expose()
  referenceId = '';

  @Expose()
  resultCode = '';

  @Expose()
  resultParentCode = '';

  @Expose()
  note = '';
}
