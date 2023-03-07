import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  IsDate,
  IsOptional,
  IsNumber,
  IsEnum,
  IsObject,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { ActivityTypeCode } from '../enum/activity.enum';

export class CreateActivityData extends BaseCreateData {
  @IsString()
  @MaxLength(48)
  contractCode = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  customerCode = '';

  @IsString()
  @IsOptional()
  @MaxLength(24)
  staffCode? = '';

  @IsEnum(ActivityTypeCode)
  @IsNotEmpty()
  type = ActivityTypeCode.Call;

  @IsObject()
  contactInfo: {
    relationCode: string;
    fullname: string;
    phoneNumber?: string;
    facebookId?: string;
    zaloId?: string;
    chatId?: string;
  } = {
    relationCode: '',
    fullname: '',
    phoneNumber: '',
  };

  @IsObject()
  reference: {
    [key: string]: any;
  } = {};

  @IsString()
  @IsOptional()
  @MaxLength(24)
  resultCode? = '';

  @IsString()
  @IsOptional()
  @MaxLength(24)
  resultParentCode? = '';

  @IsString()
  @IsOptional()
  note? = '';

  @IsDate()
  @IsOptional()
  ptpDate;

  @IsNumber()
  @IsOptional()
  ptpAmount = 0;

  @IsDate()
  @IsOptional()
  performAt;
}
@Exclude()
export class CreateActivityResult extends BaseCreateResult {
  @Expose()
  staffCode = '';

  @Expose()
  contractCode = '';

  @Expose()
  customerCode = '';

  @Expose()
  type = ActivityTypeCode.Call;

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

  @Expose()
  performAt;
}
