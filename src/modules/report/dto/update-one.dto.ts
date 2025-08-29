import { IsOptional, IsString, MaxLength, IsEnum, IsDateString, IsArray, IsNumber } from 'class-validator';
import { UpdateData as BaseUpdateData } from '../../../common/modules/base/dto/update-one.dto';
import { ReportType, ReportStatus, ReportFormat } from '../enum/report.enum';

export class UpdateReportData extends BaseUpdateData {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @IsOptional()
  @IsEnum(ReportFormat)
  format?: ReportFormat;

  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  partnerCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  staffCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(24)
  teamCode?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsArray()
  filters?: any[];

  @IsOptional()
  @IsArray()
  groupBy?: string[];

  @IsOptional()
  @IsArray()
  columns?: string[];

  @IsOptional()
  @IsNumber()
  totalRecords?: number;

  @IsOptional()
  @IsNumber()
  processedRecords?: number;

  @IsOptional()
  @IsString()
  filePath?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsNumber()
  fileSize?: number;

  @IsOptional()
  @IsNumber()
  generateTime?: number;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}