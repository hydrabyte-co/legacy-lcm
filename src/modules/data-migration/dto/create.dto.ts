import { Exclude, Expose } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    MaxLength
} from 'class-validator';
import {
    CreateData as BaseCreateData,
    CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { MixedObject } from '../../../common/types/data';
import { DataMigration_Collections } from '../enum/data-migration.enum';

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
