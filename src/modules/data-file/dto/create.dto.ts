import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';

export class CreateDataFileData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  fileName = '';

  @IsString()
  @MaxLength(64)
  note = '';
}
@Exclude()
export class CreateDataFileResult extends BaseCreateResult {
  @Expose()
  fileName = '';

  @Expose()
  info = {};

  @Expose()
  settings = {};

  @Expose()
  note = '';

  @Expose()
  status = '';
}
