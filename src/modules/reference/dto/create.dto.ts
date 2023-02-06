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
import { ReferenceStatus } from '../enum/reference.enum';

export class CreateReferenceData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  customerCode = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  relationCode = '';

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
  identityNumber = '';

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

  @IsString()
  @MaxLength(360)
  note = '';
}
@Exclude()
export class CreateReferenceResult extends BaseCreateResult {
  @Expose()
  customerCode = '';

  @Expose()
  relationCode = '';

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
}
