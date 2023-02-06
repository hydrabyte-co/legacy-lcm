import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsDate,
  IsNumber,
} from 'class-validator';
import {
  UpdateOneData,
  UpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';

export class UpdateInvestigationData extends UpdateOneData {
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
}
export class UpdateInvestigationResult extends UpdateOneResult {
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
