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
  ExportData_ExportRule,
  ExportData_ToTable,
} from '../enum/export-data.enum';

export class UpdateExportDataData extends UpdateOneData {
  @IsOptional()
  @IsString()
  note;

  @IsOptional()
  @IsObject()
  settings: {
    sheets: {
      name: string;
      toTable: ExportData_ToTable;
      rule: ExportData_ExportRule;
      [key: string]: any;
    }[];
  };
}
export class UpdateExportDataResult extends UpdateOneResult {
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
