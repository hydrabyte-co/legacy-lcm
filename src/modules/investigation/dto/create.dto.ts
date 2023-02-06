import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  IsDate,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';

export class CreateInvestigationData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  customerCode = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  staffCode = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  typeCode = '';

  @IsString()
  @IsNotEmpty()
  value = '';

  @IsString()
  @IsNotEmpty()
  note = '';

  @IsDateString()
  date: Date = new Date();
}
@Exclude()
export class CreateInvestigationResult extends BaseCreateResult {
  @Expose()
  customerCode = '';

  @Expose()
  staffCode = '';

  @Expose()
  typeCode = '';

  @Expose()
  value = '';

  @Expose()
  note = '';

  @Expose()
  date = new Date();
}
