import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty, MaxLength, IsBoolean } from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';

export class CreateCategoryData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  name = '';

  @IsString()
  note = '';

  @IsBoolean()
  isActive = false;
}
@Exclude()
export class CreateCategoryResult extends BaseCreateResult {
  @Expose()
  name = '';

  @Expose()
  note = '';

  @Expose()
  isActive = false;
}
