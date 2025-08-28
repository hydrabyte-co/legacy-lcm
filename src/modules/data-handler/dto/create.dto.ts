import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';

export enum DataHandlerType {
  Import = 'import',
  Export = 'export',
  Validation = 'validation',
  Transformation = 'transformation',
  Sync = 'sync'
}

export enum DataHandlerStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
  Cancelled = 'cancelled'
}

export class CreateDataHandlerData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name = '';

  @IsString()
  @MaxLength(255)
  description = '';

  @IsEnum(DataHandlerType)
  type = DataHandlerType.Import;

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  partnerCode = '';

  @IsString()
  @MaxLength(24)
  staffCode = '';

  @IsString()
  sourceType = '';

  @IsString()
  targetType = '';

  @IsString()
  filePath = '';

  @IsString()
  fileName = '';

  @IsOptional()
  @IsNumber()
  expectedRecords?: number;

  @IsString()
  @MaxLength(500)
  notes = '';
}

@Exclude()
export class CreateDataHandlerResult extends BaseCreateResult {
  @Expose()
  name = '';

  @Expose()
  description = '';

  @Expose()
  type = '';

  @Expose()
  partnerCode = '';

  @Expose()
  staffCode = '';

  @Expose()
  status = DataHandlerStatus.Pending;

  @Expose()
  sourceType = '';

  @Expose()
  targetType = '';

  @Expose()
  filePath = '';

  @Expose()
  fileName = '';

  @Expose()
  expectedRecords = 0;

  @Expose()
  processedRecords = 0;

  @Expose()
  errorRecords = 0;

  @Expose()
  notes = '';
}