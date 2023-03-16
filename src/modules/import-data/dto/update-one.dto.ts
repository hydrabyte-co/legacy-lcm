import { Expose } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsObject,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import {
  UpdateOneData,
  UpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';
import { DataFile_ImportRule, DataFile_ToTable } from '../enum/import-data.enum';

export class UpdateDataFileData extends UpdateOneData {
  @IsOptional()
  @IsString()
  note;

  @IsOptional()
  @IsObject()
  settings: {
    sheets: {
      name: string;
      toTable: DataFile_ToTable;
      rule: DataFile_ImportRule;
      [key: string]: any;
    }[];
  };
}
export class UpdateDataFileResult extends UpdateOneResult {
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
