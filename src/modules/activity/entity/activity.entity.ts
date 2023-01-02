import { Entity, Column, Index } from 'typeorm';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDate,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';
import { ActivityType } from '../enum/activity.enum';

@Entity(Controllers.LCM_Activities)
export class Activity extends Base {
  @Column()
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
  @IsEnum(ActivityType)
  @IsNotEmpty()
  type = ActivityType.Call;

  @Column()
  @IsString()
  @MaxLength(24)
  referenceId = '';

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
  @IsString()
  @IsNotEmpty()
  note = '';
}
