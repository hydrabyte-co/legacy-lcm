import { IsOptional, IsString, MaxLength, IsEnum } from 'class-validator';
import { UpdateData as BaseUpdateData } from '../../../common/modules/base/dto/update-one.dto';
import { DataMigration_Status, DataMigration_Collections } from '../enum/data-migration.enum';

export class UpdateDataMigrationData extends BaseUpdateData {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsEnum(DataMigration_Collections)
  type?: DataMigration_Collections;

  @IsOptional()
  @IsEnum(DataMigration_Status)
  status?: DataMigration_Status;

  @IsOptional()
  @IsString()
  sourceConnection?: string;

  @IsOptional()
  @IsString()
  targetConnection?: string;

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  totalRecords?: number;

  @IsOptional()
  processedRecords?: number;

  @IsOptional()
  errorRecords?: number;

  @IsOptional()
  @IsString()
  errorLog?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}