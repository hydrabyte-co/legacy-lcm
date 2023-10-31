import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsDate,
  IsEnum,
  IsObject,
  IsArray,
} from 'class-validator';
import {
  UpdateOneData,
  UpdateOneResult,
} from '../../../common/modules/base/dto/update-one.dto';
import { StaffStatus } from '../enum/staff.enum';

export class UpdateStaffData extends UpdateOneData {
  @IsString()
  @IsOptional()
  hostname;

  @IsString()
  @MaxLength(256)
  @IsOptional()
  note;

  @IsEnum(StaffStatus)
  @IsOptional()
  type;

  @IsObject()
  @IsOptional()
  attributes: { [key: string]: number | Date | string | boolean };

  @IsEnum(StaffStatus)
  @IsOptional()
  status;

  @IsArray()
  orgIds;
}
export class UpdateStaffResult extends UpdateOneResult {
  @Expose()
  hostname;

  @Expose()
  note;

  @Expose()
  type;

  @Expose()
  attributes;

  @Expose()
  status;

  @Expose()
  orgIds;
}
