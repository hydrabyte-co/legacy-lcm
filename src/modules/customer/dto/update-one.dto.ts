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
  IsNumber,
  IsObject,
} from 'class-validator';
import {
  UpdateOneData,
  UpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';

export class UpdateCustomerData extends UpdateOneData {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  code;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  partnerCode;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  callStaffCode;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  fieldStaffCode;

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
  dob;

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
  @MaxLength(12)
  status;

  @IsOptional()
  @IsString()
  @MaxLength(360)
  note;

  @IsNumber()
  @IsOptional()
  priority?;

  @IsDateString()
  @IsOptional()
  lastActivityDate?;

  @IsObject()
  @IsOptional()
  lastActivity?;

  @IsObject()
  @IsOptional()
  lastPTPActivity?;
}
export class UpdateCustomerResult extends UpdateOneResult {
  @Expose()
  code = '';

  @Expose()
  partnerCode = '';

  @Expose()
  callStaffCode = '';

  @Expose()
  fieldStaffCode = '';

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
  status = '';

  @Expose()
  note = '';

  @Expose()
  priority;

  @Expose()
  lastActivityDate;

  @Expose()
  lastActivity;

  @Expose()
  lastPTPActivity;
}
