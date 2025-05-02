import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsObject,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';

export class CreateImportDataData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  partnerCode = '';

  @IsString()
  @IsOptional()
  fileName = '';

  @IsString()
  @IsOptional()
  fileId = '';

  @IsString()
  @MaxLength(64)
  note = '';

  @IsOptional()
  @IsObject()
  settings: {
    closeAll: boolean;
    sheets: {
      name: string;
      [key: string]: any;
    }[];
  };
}
@Exclude()
export class CreateImportDataResult extends BaseCreateResult {
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
