import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsObject,
  IsArray,
} from 'class-validator';
import {
  CreateData as BaseCreateData,
  CreateResult as BaseCreateResult,
} from '../../../common/modules/base/dto/create.dto';
import { StaffStatus, StaffType } from '../enum/staff.enum';

export class CreateStaffData extends BaseCreateData {
  @IsString()
  @IsNotEmpty()
  hostname = '';

  @IsString()
  @MaxLength(256)
  note = '';

  @IsEnum(StaffStatus)
  type = StaffType.Asterisk;

  @IsObject()
  attributes: { [key: string]: number | Date | string | boolean } = {};

  @IsEnum(StaffStatus)
  status = StaffStatus.Active;

  @IsArray()
  orgIds = [];
}
@Exclude()
export class CreateStaffResult extends BaseCreateResult {
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
