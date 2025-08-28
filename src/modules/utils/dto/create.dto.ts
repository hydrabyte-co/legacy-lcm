import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { UtilType, UtilStatus } from '../enum/utils.enum';

export class CreateUtilData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name = '';

  @IsString()
  @MaxLength(255)
  description = '';

  @IsEnum(UtilType)
  type = UtilType.DataProcessing;

  @IsString()
  @MaxLength(24)
  partnerCode = '';

  @IsString()
  @MaxLength(24)
  staffCode = '';

  @IsString()
  @MaxLength(50)
  operation = '';

  @IsOptional()
  @IsArray()
  parameters?: any[];

  @IsString()
  inputData = '';

  @IsString()
  @MaxLength(500)
  notes = '';
}

@Exclude()
export class CreateUtilResult extends BaseCreateResult {
  @Expose()
  name = '';

  @Expose()
  description = '';

  @Expose()
  type = '';

  @Expose()
  status = UtilStatus.Pending;

  @Expose()
  partnerCode = '';

  @Expose()
  staffCode = '';

  @Expose()
  operation = '';

  @Expose()
  parameters = [];

  @Expose()
  inputData = '';

  @Expose()
  outputData = '';

  @Expose()
  executionTime = 0;

  @Expose()
  notes = '';
}