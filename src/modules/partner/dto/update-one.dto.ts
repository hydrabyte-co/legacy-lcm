import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsDate,
} from 'class-validator';
import {
  UpdateOneData,
  UpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';

export class UpdatePartnerData extends UpdateOneData {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  code;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  businessCode;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  contractCode;

  @IsOptional()
  @IsString()
  @MaxLength(48)
  @IsNotEmpty()
  name;

  @IsOptional()
  @IsString()
  note;

  @IsOptional()
  @IsString()
  address;

  @IsOptional()
  @IsBoolean()
  isActive;

  @IsOptional()
  @IsDate()
  startedAt;

  @IsOptional()
  @IsDate()
  endedAt;
}
export class UpdatePartnerResult extends UpdateOneResult {
  @Expose()
  code = '';

  @Expose()
  businessCode = '';

  @Expose()
  contractCode = '';

  @Expose()
  name = '';

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
