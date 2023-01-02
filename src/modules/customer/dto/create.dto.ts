import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  IsDate,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { CustomerStatus } from '../enum/customer.enum';

export class CreateCustomerData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  code = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  partnerCode = '';

  @IsString()
  @MaxLength(12)
  callStaffCode = '';

  @IsString()
  @MaxLength(12)
  fieldStaffCode = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  fullname = '';

  @IsString()
  @MaxLength(12)
  gender = '';

  @IsDateString()
  dob = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  indentityNumber = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  mobileNumber = '';

  @IsString()
  @MaxLength(12)
  officeNumber = '';

  @IsString()
  @MaxLength(36)
  email = '';

  @IsString()
  @MaxLength(180)
  temporaryAddress = '';

  @IsString()
  @MaxLength(180)
  permanentAddress = '';

  @IsEnum(CustomerStatus)
  status = CustomerStatus.Active;

  @IsString()
  @MaxLength(360)
  note = '';
}
@Exclude()
export class CreateCustomerResult extends BaseCreateResult {
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
  indentityNumber = '';

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
}
