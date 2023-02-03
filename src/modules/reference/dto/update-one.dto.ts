import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsDate,
  IsDateString,
  isBoolean,
} from 'class-validator';
import {
  UpdateOneData,
  UpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';

export class UpdateReferenceData extends UpdateOneData {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  customerCode;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  relation;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  fullname;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  gender;

  @IsOptional()
  @IsDateString()
  dob = '';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  identityNumber;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  mobileNumber;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  officeNumber;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  email;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  temporaryAddress;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  permanentAddress;

  @IsOptional()
  @IsString()
  @MaxLength(360)
  note;
}
export class UpdateReferenceResult extends UpdateOneResult {
  @Expose()
  customerCode = '';

  @Expose()
  relation = '';

  @Expose()
  fullname = '';

  @Expose()
  gender = '';

  @Expose()
  dob = new Date();

  @Expose()
  identityNumber = '';

  @Expose()
  mobileNumber = '';

  @Expose()
  officeNumber = '';

  @Expose()
  email = '';

  @Expose()
  temporaryAddress = '';

  @Expose()
  permanentAddress = '';

  @Expose()
  note = '';
}
