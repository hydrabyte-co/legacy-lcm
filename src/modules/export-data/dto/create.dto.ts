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
import { ExportData_OutputFileType } from '../enum/export-data.enum';
import { ExportData_Datasources } from '../entity/export-data.entity';

export class CreateExportDataData extends BaseCreateData {
  @IsObject()
  datasources: ExportData_Datasources;

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
