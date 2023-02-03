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
  IsObject,
  IsDateString,
} from 'class-validator';
import {
  UpdateOneData,
  UpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';
import { ActivityType } from '../enum/activity.enum';

export class UpdateActivityData extends UpdateOneData {
  @IsObject()
  reference: {
    [key: string]: any;
  } = {};

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  resultCode = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  resultParentCode = '';

  @IsString()
  @IsNotEmpty()
  note = '';

  @IsDateString()
  @IsOptional()
  ptpDate;

  @IsNumber()
  @IsOptional()
  ptpAmount = 0;
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
  contactInfo = {};

  @Expose()
  reference = {};

  @Expose()
  resultCode = '';

  @Expose()
  resultParentCode = '';

  @Expose()
  note = '';

  @Expose()
  ptpDate;

  @Expose()
  ptpAmount;
}
