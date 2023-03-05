import { Entity, Column, Index } from 'typeorm';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDate,
  IsDateString,
} from 'class-validator';
import { Base } from '../../../common/modules/base/entity/base.entity';
import { Controllers } from 'src/common/enums/controllers';

@Entity(Controllers.LCM_References)
export class Reference extends Base {
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  customerCode = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  relationCode = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  fullname = '';

  @Column()
  @IsString()
  @MaxLength(12)
  gender = '';

  @Column()
  @IsString()
  dob = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  identityNumber = '';

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  mobileNumber = '';

  @Column()
  @IsString()
  @MaxLength(12)
  officeNumber = '';

  @Column()
  @IsString()
  @MaxLength(36)
  email = '';

  @Column()
  @IsString()
  @MaxLength(180)
  temporaryAddress = '';

  @Column()
  @IsString()
  @MaxLength(180)
  permanentAddress = '';

  @Column()
  @IsString()
  @MaxLength(360)
  note = '';

  @Column()
  @IsString()
  fromFile = '';
}
