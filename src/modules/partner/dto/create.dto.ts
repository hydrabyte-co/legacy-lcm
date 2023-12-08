import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  IsDate,
  IsOptional,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';

export class CreatePartnerData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  code = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  businessCode = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  contractCode = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(48)
  name = '';

  @IsOptional()
  @IsString()
  userId = '';

  @IsOptional()
  @IsString()
  note = '';

  @IsOptional()
  @IsString()
  address = '';

  @IsOptional()
  @IsBoolean()
  isActive = false;

  @IsOptional()
  @IsDate()
  startedAt: Date = new Date();

  @IsOptional()
  @IsDate()
  endedAt: Date = new Date();
}
@Exclude()
export class CreatePartnerResult extends BaseCreateResult {
  @Expose()
  code = '';

  @Expose()
  businessCode = '';

  @Expose()
  contractCode = '';

  @Expose()
  name = '';

  @Expose()
  userId = '';

  @Expose()
  note = '';

  @Expose()
  address = '';

  @Expose()
  isActive = false;

  @Expose()
  startedAt = new Date();

  @Expose()
  endedAt = new Date();
}
