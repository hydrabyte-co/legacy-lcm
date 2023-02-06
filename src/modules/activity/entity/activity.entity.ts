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
import { Controllers } from 'src/common/enums/controllers';
import { ActivityType } from '../enum/activity.enum';

@Entity(Controllers.LCM_Activities)
export class Activity extends Base {
  @Column({ unique: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  staffCode = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  contractCode = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  customerCode = '';

  @Column()
  @IsObject()
  contactInfo: {
    relationCode: string;
    fullname: string;
    phoneNumber?: string;
    facebookId?: string;
    zaloId?: string;
    chatId?: string;
  } = {
    relationCode: '',
    fullname: '',
    phoneNumber: '',
  };

  @Column()
  @IsEnum(ActivityType)
  @IsNotEmpty()
  type = ActivityType.Call;

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
}
