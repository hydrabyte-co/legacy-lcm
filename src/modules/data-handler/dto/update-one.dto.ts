import { IsOptional, IsString, MaxLength, IsEnum, IsNumber } from 'class-validator';
import { UpdateData as BaseUpdateData } from '../../../common/modules/base/dto/update-one.dto';
import { DataHandlerType, DataHandlerStatus } from './create.dto';

export class UpdateDataHandlerData extends BaseUpdateData {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsEnum(DataHandlerType)
  type?: DataHandlerType;

  @IsOptional()
  @IsEnum(DataHandlerStatus)
  status?: DataHandlerStatus;

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
  sourceType?: string;

  @IsOptional()
  @IsString()
  targetType?: string;

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
  expectedRecords?: number;

  @IsOptional()
  @IsNumber()
  processedRecords?: number;

  @IsOptional()
  @IsNumber()
  errorRecords?: number;

  @IsOptional()
  @IsString()
  errorLog?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}