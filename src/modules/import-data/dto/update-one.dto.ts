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
import {
  ImportData_ImportRule,
  ImportData_ToTable,
} from '../enum/import-data.enum';

export class UpdateImportDataData extends UpdateOneData {
  @IsOptional()
  @IsString()
  note;

  @IsOptional()
  @IsObject()
  settings: {
    sheets: {
      name: string;
      toTable: ImportData_ToTable;
      rule: ImportData_ImportRule;
      [key: string]: any;
    }[];
  };
}
export class UpdateImportDataResult extends UpdateOneResult {
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
