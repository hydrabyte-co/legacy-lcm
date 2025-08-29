import { IsOptional, IsString, MaxLength, IsEnum } from 'class-validator';
import { UpdateData as BaseUpdateData } from '../../../common/modules/base/dto/update-one.dto';
import { ExportData_Status, ExportData_FromDocuments } from '../enum/export-data.enum';

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
  @IsEnum(ExportData_FromDocuments)
  type?: ExportData_FromDocuments;

  @IsOptional()
  @IsEnum(ExportData_Status)
  status?: ExportData_Status;

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