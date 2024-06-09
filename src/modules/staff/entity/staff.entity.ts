import { Entity, Column, Index } from 'typeorm';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDate,
  IsEnum,
  IsObject,
  IsArray,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Resources } from 'src/common/enums/resources';
import { StaffStatus, StaffType } from '../enum/staff.enum';

@Entity(Resources.LCM_Staff)
export class Staff extends Base {
  @Column()
  hostname = '';

  @Column()
  note = '';

  @Column()
  type = StaffType.Asterisk;

  @Column()
  attributes: { [key: string]: number | Date | string | boolean } = {};

  @Column()
  orgIds: string[] = [];

  @Column()
  status = StaffStatus.Active;
}
