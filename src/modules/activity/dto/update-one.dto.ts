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

  @IsObject()
  contactInfo: {
    relation: string;
    fullname: string;
    phoneNumber?: string;
    facebookId?: string;
    zaloId?: string;
    chatId?: string;
  } = {
    relation: '',
    fullname: '',
    phoneNumber: '',
  };

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

  @IsDate()
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
