import { Expose } from 'class-transformer';
import { IsString, IsOptional, IsObject } from 'class-validator';
import {
  UpdateOneData,
  UpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';

export class UpdateDataFileData extends UpdateOneData {
  @IsOptional()
  @IsString()
  note;

  @IsOptional()
  @IsObject()
  settings;
}
export class UpdateDataFileResult extends UpdateOneResult {
  @Expose()
  fileName = '';

  @Expose()
  info = {};

  @Expose()
  settings = {};

  @Expose()
  note = '';

  @Expose()
  status = '';
}
