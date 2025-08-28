import { IsOptional, IsString, MaxLength, IsEnum, IsArray, IsNumber } from 'class-validator';
import { UpdateData as BaseUpdateData } from '../../../common/modules/base/dto/update-one.dto';
import { UtilType, UtilStatus } from '../enum/utils.enum';

export class UpdateUtilData extends BaseUpdateData {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsEnum(UtilType)
  type?: UtilType;

  @IsOptional()
  @IsEnum(UtilStatus)
  status?: UtilStatus;

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
  @MaxLength(50)
  operation?: string;

  @IsOptional()
  @IsArray()
  parameters?: any[];

  @IsOptional()
  @IsString()
  inputData?: string;

  @IsOptional()
  @IsString()
  outputData?: string;

  @IsOptional()
  @IsNumber()
  executionTime?: number;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsOptional()
  @IsNumber()
  retryCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}