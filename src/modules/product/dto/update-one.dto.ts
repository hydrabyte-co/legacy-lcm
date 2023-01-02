import { Expose } from 'class-transformer';
import { IsString, MaxLength, IsNotEmpty, IsBoolean } from 'class-validator';
import {
  UpdateOneData,
  UpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';

export class UpdateCategoryData extends UpdateOneData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  name = '';

  @IsString()
  note = '';

  @IsBoolean()
  isActive = false;
}
export class UpdateCategoryResult extends UpdateOneResult {
  @Expose()
  name = '';

  @Expose()
  note = '';

  @Expose()
  isActive = false;
}
