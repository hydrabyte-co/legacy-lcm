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
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { ActivityType } from '../enum/activity.enum';

export class CreateActivityData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  staffCode = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  contractCode = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  customerCode = '';

  @IsEnum(ActivityType)
  @IsNotEmpty()
  type = ActivityType.Call;

  @IsString()
  @MaxLength(24)
  referenceId = '';

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
