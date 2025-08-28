import { IsOptional, IsString, MaxLength, IsEnum } from 'class-validator';
import { UpdateData as BaseUpdateData } from '../../../common/modules/base/dto/update-one.dto';
import { ExportDataStatus, ExportDataType } from '../enum/export-data.enum';

export class UpdateExportDataData extends BaseUpdateData {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsEnum(ExportDataType)
  type?: ExportDataType;

  @IsOptional()
  @IsEnum(ExportDataStatus)
  status?: ExportDataStatus;

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  totalRecords?: number;

  @IsOptional()
  exportedRecords?: number;

  @IsOptional()
  @IsString()
  filePath?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  fileSize?: number;

  @IsOptional()
  @IsString()
  errorLog?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}