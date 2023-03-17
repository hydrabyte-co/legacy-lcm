import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';

export class CreateExportDataData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  partnerCode = '';

  @IsString()
  @IsNotEmpty()
  fileName = '';

  @IsString()
  @MaxLength(64)
  note = '';
}
@Exclude()
export class CreateExportDataResult extends BaseCreateResult {
  @Expose()
  fileName = '';

  @Expose()
  partnerCode = '';

  @Expose()
  info = {};

  @Expose()
  settings = {};

  @Expose()
  note = '';

  @Expose()
  status = '';
}
