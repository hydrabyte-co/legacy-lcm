import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsObject,
  IsArray,
  IsEnum,
  IsNumber,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { DataMigration_Datasource } from '../entity/data-migration.entity';
import { DataMigration_Collections } from '../enum/data-migration.enum';
import { MixedObject } from 'src/common/types/data';

export class CreateDataMigrationData extends BaseCreateData {
  @IsEnum(DataMigration_Collections)
  @IsString()
  @IsNotEmpty()
  collectionName = '';

  @IsObject()
  @IsNotEmpty()
  filter: MixedObject;

  @IsString()
  @MaxLength(64)
  note = '';

  @IsOptional()
  @IsNumber()
  recordsCount? = 0;
}
@Exclude()
export class CreateDataMigrationResult extends BaseCreateResult {
  @Expose()
  collectionName;

  @Expose()
  filter;

  @Expose()
  results;

  @Expose()
  error;

  @Expose()
  note;

  @Expose()
  status;
}
