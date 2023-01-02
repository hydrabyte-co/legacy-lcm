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

export class UpdateResultData extends UpdateOneData {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  code;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  parentCode;

  @IsOptional()
  @IsNumber()
  index;

  @IsOptional()
  @IsString()
  @MaxLength(48)
  @IsNotEmpty()
  name;

  @IsOptional()
  @IsString()
  note;

  @IsOptional()
  @IsBoolean()
  isActive;

  @IsOptional()
  @IsBoolean()
  isSelectable;
}
export class UpdateResultResult extends UpdateOneResult {
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
  isSelectable = true;
}
