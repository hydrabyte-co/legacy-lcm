import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsObject,
  IsArray,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { ExportData_OutputFileType } from '../enum/export-data.enum';
import { ExportData_Datasource } from '../entity/export-data.entity';

export class CreateExportDataData extends BaseCreateData {
  @IsArray()
  datasources: ExportData_Datasource[];

  @IsString()
  @IsNotEmpty()
  outputFileType: ExportData_OutputFileType;

  @IsString()
  @MaxLength(64)
  note = '';
}
@Exclude()
export class CreateExportDataResult extends BaseCreateResult {
  @Expose()
  fileId;

  @Expose()
  datasources;

  @Expose()
  outputFileType;

  @Expose()
  note;

  @Expose()
  status;
}
