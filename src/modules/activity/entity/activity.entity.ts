import { Entity, Column, Index } from 'typeorm';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDate,
  IsNumber,
  IsEnum,
  IsObject,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Resources } from 'src/common/enums/resources';
import { ActivityTypeCode } from '../enum/activity.enum';

@Entity(Resources.LCM_Activities)
export class Activity extends Base {
  @Column({ unique: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(48)
  staffCode = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(48)
  contractCode = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  customerCode = '';

  @Column()
  @IsObject()
  contactInfo: {
    relation: {
      code: string;
      name: string;
    };
    note?: string;
    address?: string;
    fullname: string;
    phoneNumber?: string;
    facebookId?: string;
    zaloId?: string;
    chatId?: string;
  } = {
    relation: { code: '', name: '' },
    fullname: '',
    phoneNumber: '',
    note: '',
    address: '',
  };

  @Column()
  @IsEnum(ActivityTypeCode)
  @IsNotEmpty()
  type = ActivityTypeCode.Call;

  @Column()
  @IsObject()
  reference: {
    [key: string]: any;
  } = {};

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  resultCode = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  resultParentCode = '';

  @Column()
  @IsDate()
  ptpDate;

  @Column()
  @IsNumber()
  ptpAmount;

  @Column()
  @IsString()
  @IsNotEmpty()
  note = '';

  @Column()
  @IsString()
  fromFile = '';

  @Column()
  @IsDate()
  performAt;
}
