import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  IsDate,
  IsOptional,
  IsNumber,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';

export class CreateResultData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  code = '';

  @IsString()
  @MaxLength(24)
  parentCode = '';

  @IsNumber()
  index = 0;

  @IsString()
  @IsNotEmpty()
  @MaxLength(48)
  name = '';

  @IsOptional()
  @IsString()
  note = '';

  @IsOptional()
  @IsBoolean()
  isActive = false;

  @IsOptional()
  @IsBoolean()
  isSelectable = false;
}
@Exclude()
export class CreateResultResult extends BaseCreateResult {
  @Expose()
  code = '';

  @Expose()
  parentCode = '';

  @Expose()
  index = 0;

  @Expose()
  name = '';

  @Expose()
  note = '';

  @Expose()
  isActive = false;

  @Expose()
  isSelectable = false;
}
