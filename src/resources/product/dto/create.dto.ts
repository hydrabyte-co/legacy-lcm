import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from 'src/resources/base/dto/create.dto';

export class CreateData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  name = '';

  @IsString()
  @IsNotEmpty()
  categoryId = '';
}
export class CreateResult extends BaseCreateResult {
  @IsString()
  name = '';

  @IsString()
  categoryId = '';
}
