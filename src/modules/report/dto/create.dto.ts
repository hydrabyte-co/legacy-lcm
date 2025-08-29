import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { ReportType, ReportStatus, ReportFormat } from '../enum/report.enum';

export class CreateReportData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name = '';

  @IsString()
  @MaxLength(255)
  description = '';

  @IsEnum(ReportType)
  type = ReportType.Performance;

  @IsEnum(ReportFormat)
  format = ReportFormat.Excel;

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  partnerCode = '';

  @IsString()
  @MaxLength(24)
  staffCode = '';

  @IsString()
  @MaxLength(24)
  teamCode = '';

  @IsDateString()
  @IsNotEmpty()
  fromDate = '';

  @IsDateString()
  @IsNotEmpty()
  toDate = '';

  @IsOptional()
  @IsArray()
  filters?: any[];

  @IsOptional()
  @IsArray()
  groupBy?: string[];

  @IsOptional()
  @IsArray()
  columns?: string[];

  @IsString()
  @MaxLength(500)
  notes = '';
}

@Exclude()
export class CreateReportResult extends BaseCreateResult {
  @Expose()
  name = '';

  @Expose()
  description = '';

  @Expose()
  type = '';

  @Expose()
  format = '';

  @Expose()
  status = ReportStatus.Pending;

  @Expose()
  partnerCode = '';

  @Expose()
  staffCode = '';

  @Expose()
  teamCode = '';

  @Expose()
  fromDate = '';

  @Expose()
  toDate = '';

  @Expose()
  filters = [];

  @Expose()
  groupBy = [];

  @Expose()
  columns = [];

  @Expose()
  totalRecords = 0;

  @Expose()
  filePath = '';

  @Expose()
  fileName = '';

  @Expose()
  notes = '';
}