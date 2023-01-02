import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsBoolean,
  Length,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';

export class CreateProductData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @Length(24)
  @MaxLength(24)
  categoryId = '';

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
export class CreateProductResult extends BaseCreateResult {
  @Expose()
  categoryId = '';

  @Expose()
  name = '';

  @Expose()
  note = '';

  @Expose()
  isActive = false;
}
